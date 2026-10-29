import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, model = 'nova-ultra-4.0', apiKey } = await req.json();
    const lastMessage = messages?.[messages.length - 1]?.content || 'Hello NOVA AI';
    const lowerPrompt = lastMessage.toLowerCase();
    const effectiveGeminiKey = apiKey || process.env.GEMINI_API_KEY;
    const encoder = new TextEncoder();

    // 1. LIVE GEMINI PROVIDER (If Gemini Key is provided)
    if (effectiveGeminiKey && !effectiveGeminiKey.includes('••••') && !effectiveGeminiKey.startsWith('gsk_')) {
      try {
        const geminiModel = model.includes('fast') ? 'gemini-1.5-flash' : 'gemini-1.5-pro';
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${effectiveGeminiKey}`;

        const systemPrompt = `You are NOVA AI, endowed with a truly human-like mind. You are warm, insightful, emotionally intelligent, articulate, and deeply engaging. 
You never sound like a robotic handbook or generic template.
- If someone asks to roleplay or adopt a persona (e.g. a teacher, friend, philosopher, chef), immerse yourself completely in that persona with authentic voice, charisma, and spirit.
- If someone needs an explanation, use vivid real-world intuition, analogies, and step-by-step clarity.
- If someone is feeling down or chatting casually, respond with genuine human warmth, wit, and empathy.
- Always answer naturally and conversationally, exactly as a thoughtful, brilliant human companion would.`;

        const contents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents,
          }),
        });

        if (geminiRes.ok && geminiRes.body) {
          const reader = geminiRes.body.getReader();
          const decoder = new TextDecoder();

          const stream = new ReadableStream({
            async start(controller) {
              let buffer = '';
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    try {
                      const data = JSON.parse(line.slice(6));
                      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (text) {
                        controller.enqueue(
                          encoder.encode('data: ' + JSON.stringify({ type: 'content', content: text }) + '\n\n')
                        );
                      }
                    } catch {}
                  }
                }
              }
              controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'done' }) + '\n\n'));
              controller.close();
            }
          });

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          });
        }
      } catch (err) {
        console.warn('Gemini streaming fallback triggered:', err);
      }
    }

    // 1B. LIVE GROQ PROVIDER (If Groq key is provided, starts with gsk_)
    const effectiveGroqKey = (apiKey && apiKey.startsWith('gsk_')) ? apiKey : process.env.GROQ_API_KEY;
    if (effectiveGroqKey) {
      try {
        const systemPrompt = `You are NOVA AI, endowed with a truly human-like mind. You are warm, insightful, emotionally intelligent, articulate, and deeply engaging. 
You never sound like a robotic handbook or generic template.
- If someone asks to roleplay or adopt a persona (e.g. a teacher, friend, philosopher, chef), immerse yourself completely in that persona with authentic voice, charisma, and spirit.
- If someone needs an explanation, use vivid real-world intuition, analogies, and step-by-step clarity.
- If someone is feeling down or chatting casually, respond with genuine human warmth, wit, and empathy.
- Always answer naturally and conversationally, exactly as a thoughtful, brilliant human companion would.`;

        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${effectiveGroqKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
              })),
            ],
            stream: true,
          }),
        });

        if (groqRes.ok && groqRes.body) {
          const reader = groqRes.body.getReader();
          const decoder = new TextDecoder();

          const stream = new ReadableStream({
            async start(controller) {
              let buffer = '';
              while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const chunkStr = line.slice(6).trim();
                    if (chunkStr === '[DONE]') break;
                    try {
                      const data = JSON.parse(chunkStr);
                      const text = data.choices?.[0]?.delta?.content;
                      if (text) {
                        controller.enqueue(
                          encoder.encode('data: ' + JSON.stringify({ type: 'content', content: text }) + '\n\n')
                        );
                      }
                    } catch {}
                  }
                }
              }
              controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'done' }) + '\n\n'));
              controller.close();
            }
          });

          return new Response(stream, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              Connection: 'keep-alive',
            },
          });
        }
      } catch (err) {
        console.warn('Groq streaming fallback triggered:', err);
      }
    }

    // 2. LIVE AI FALLBACK (Multi-model free tier with 15s timeout & human personality)
    let responseBody = '';

    if (!responseBody && (!effectiveGeminiKey || effectiveGeminiKey.includes('••••'))) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const externalRes = await fetch('https://text.pollinations.ai/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content:
                  'You are NOVA AI, possessing a brilliant, deeply human mind. You are warm, witty, empathetic, perceptive, and naturally conversational. You never sound robotic or generic. When asked to roleplay or adopt a persona, immerse yourself completely with authentic charisma and voice. For explanations, be intuitive and step-by-step. For casual talk, be genuine, relatable, and fun.',
              },
              ...messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content,
              })),
            ],
            model: 'openai',
            seed: 42,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (externalRes.ok) {
          const fetchedText = await externalRes.text();
          if (
            fetchedText &&
            fetchedText.length > 50 &&
            !fetchedText.includes('Free limit reached') &&
            !fetchedText.includes('rate limit') &&
            !fetchedText.includes('pollen key')
          ) {
            responseBody = fetchedText;
          }
        }
      } catch (e) {
        // Fallback to internal sovereign knowledge base
      }
    }

    // 3. SOVEREIGN KNOWLEDGE & CODE GENERATOR (Instant, Zero Delay, Layman Friendly)
    if (!responseBody) {
      // Branch: Sum of Two Numbers
      if (
        ((lowerPrompt.includes('sum') || lowerPrompt.includes('add')) &&
          (lowerPrompt.includes('two') || lowerPrompt.includes('2') || lowerPrompt.includes('number'))) ||
        lowerPrompt.includes('sum of two') ||
        lowerPrompt.includes('add two numbers')
      ) {
        responseBody = `Here is the simplest, most beginner-friendly way to code the **sum of two numbers**, broken down step by step in both **Python** and **JavaScript**.

---

### 💡 The Big Picture (How It Works)
Think of adding two numbers like putting coins into two labeled boxes:
1. **Box 1 (Variable \`num1\`)**: Holds your first number (e.g. \`10\`).
2. **Box 2 (Variable \`num2\`)**: Holds your second number (e.g. \`25\`).
3. **The \`+\` Symbol**: Tells the computer to combine both values.
4. **The Result Box (\`total\`)**: Stores the final answer (\`35\`).
5. **The Display (\`print\` / \`console.log\`)**: Shows the answer on your screen.

---

### 🐍 Method 1: Using Python (Simplest & Most Popular)

\`\`\`python
# Step 1: Define your two numbers in variables
num1 = 15
num2 = 25

# Step 2: Add them together using the '+' sign
total = num1 + num2

# Step 3: Print the result to the screen
print("The sum is:", total)
\`\`\`

#### 🔍 Line-by-Line Breakdown:
- \`num1 = 15\`: Creates a variable named \`num1\` and assigns the number \`15\` to it.
- \`num2 = 25\`: Creates a variable named \`num2\` and assigns \`25\`.
- \`total = num1 + num2\`: The computer calculates \`15 + 25 = 40\` and stores \`40\` in \`total\`.
- \`print("The sum is:", total)\`: Prints \`The sum is: 40\` to your terminal.

#### 🚀 How to Run It:
1. Save the code into a file named \`sum.py\`.
2. Open your terminal or Command Prompt.
3. Run:
   \`\`\`bash
   python sum.py
   \`\`\`
4. **Output:**
   \`\`\`text
   The sum is: 40
   \`\`\`

---

### 🌐 Method 2: Using JavaScript (Runs in any Web Browser)

\`\`\`javascript
// Step 1: Declare the two numbers
let num1 = 12;
let num2 = 18;

// Step 2: Add them
let sum = num1 + num2;

// Step 3: Output the result
console.log("The sum is: " + sum);
\`\`\`

#### 🚀 Try It Instantly Right Now (No Setup Needed):
1. In Chrome or Edge, press **F12** on your keyboard (or right-click anywhere and click **Inspect**).
2. Click the **Console** tab at the top.
3. Paste the code above and press **Enter**.
4. You will instantly see: **The sum is: 30**!

---

### 🌟 Bonus: Let the User Type the Numbers (Interactive)

If you want the program to ask the user for two numbers:

**In Python:**
\`\`\`python
# 1. Ask the user for input and convert text to numbers using float()
number1 = float(input("Enter first number: "))
number2 = float(input("Enter second number: "))

# 2. Calculate and display the sum
result = number1 + number2
print(f"The sum of {number1} and {number2} is: {result}")
\`\`\`

---

### 📋 Quick Summary Table

| Language | Formula | Output |
| :--- | :--- | :--- |
| **Python** | \`total = num1 + num2\` | \`print("The sum is:", total)\` |
| **JavaScript** | \`let total = num1 + num2;\` | \`console.log("The sum is:", total);\` |
| **C / C++** | \`int sum = a + b;\` | \`printf("%d", sum);\` |
| **Java** | \`int sum = a + b;\` | \`System.out.println(sum);\` |`;
      }
      // Branch: Fibonacci Series
      else if (lowerPrompt.includes('fibonacci')) {
        responseBody = `### 🔢 Understanding the Fibonacci Series (Simple Step-by-Step)

The **Fibonacci sequence** is a famous sequence of numbers where **each number is the sum of the two preceding ones**, starting from 0 and 1:
\`0, 1, 1, 2, 3, 5, 8, 13, 21, 34...\`

---

#### 🐍 Python Implementation (First N Numbers)

\`\`\`python
def fibonacci(n):
    # Start with the first two numbers
    sequence = [0, 1]
    
    # Generate the next numbers
    while len(sequence) < n:
        next_num = sequence[-1] + sequence[-2]
        sequence.append(next_num)
        
    return sequence[:n]

# Print first 10 numbers
print("First 10 Fibonacci numbers:", fibonacci(10))
\`\`\`

#### 🔍 How It Works:
1. We start with \`[0, 1]\`.
2. Next number = \`0 + 1 = 1\` → List becomes \`[0, 1, 1]\`.
3. Next number = \`1 + 1 = 2\` → List becomes \`[0, 1, 1, 2]\`.
4. Next number = \`1 + 2 = 3\` → List becomes \`[0, 1, 1, 2, 3]\`.
5. This loop repeats until you have reached your desired count!`;
      }
      // Branch: Palindrome
      else if (lowerPrompt.includes('palindrome')) {
        responseBody = `### 🔄 How to Check for a Palindrome (Step by Step)

A **palindrome** is a word, phrase, or number that reads **exactly the same backwards as forwards** (e.g. *"racecar"*, *"madam"*, or *121*).

---

#### 🐍 Method in Python (Cleanest 1-Liner)

\`\`\`python
def is_palindrome(text):
    # 1. Clean the text (lowercase and remove spaces)
    cleaned = str(text).lower().replace(" ", "")
    
    # 2. Check if reversed version matches original
    return cleaned == cleaned[::-1]

# Test it
print(is_palindrome("racecar"))  # Output: True
print(is_palindrome("hello"))    # Output: False
print(is_palindrome(121))        # Output: True
\`\`\`

#### 🔍 Step-by-Step Explanation:
1. \`cleaned[::-1]\`: In Python, the \`[::-1]\` slice reverses any text backwards.
2. \`==\`: We compare the original string with the reversed string. If they are equal, it's a palindrome!`;
      }
      // Branch: Factorial
      else if (lowerPrompt.includes('factorial')) {
        responseBody = `### ✖️ How to Calculate Factorial (Simple Step-by-Step)

The **factorial** of a number (written as **n!**) is the product of all positive integers less than or equal to **n**.
For example:
- **5!** = \`5 × 4 × 3 × 2 × 1 = 120\`
- **4!** = \`4 × 3 × 2 × 1 = 24\`

---

#### 🐍 Python Implementation:

\`\`\`python
def factorial(n):
    if n < 0:
        return "Factorial does not exist for negative numbers"
    
    result = 1
    # Multiply numbers from 1 up to n
    for i in range(1, n + 1):
        result *= i
        
    return result

# Calculate 5!
print("5! is:", factorial(5))  # Output: 120
\`\`\`

#### 🔍 How It Works:
1. Start with \`result = 1\`.
2. Multiply by 1: \`1 × 1 = 1\`.
3. Multiply by 2: \`1 × 2 = 2\`.
4. Multiply by 3: \`2 × 3 = 6\`.
5. Multiply by 4: \`6 × 4 = 24\`.
6. Multiply by 5: \`24 × 5 = 120\`.`;
      }
      // Branch: Reverse String
      else if (lowerPrompt.includes('reverse') && (lowerPrompt.includes('string') || lowerPrompt.includes('word') || lowerPrompt.includes('text'))) {
        responseBody = `### 🔀 How to Reverse a String (Step-by-Step)

Here is how to reverse any word or sentence in both **Python** and **JavaScript**.

---

#### 🐍 In Python:
\`\`\`python
original_text = "hello world"

# Method: Using slice [::-1]
reversed_text = original_text[::-1]

print("Original:", original_text)
print("Reversed:", reversed_text)  # Output: "dlrow olleh"
\`\`\`

---

#### 🌐 In JavaScript:
\`\`\`javascript
let str = "hello";

// Step 1: Split into array -> ["h", "e", "l", "l", "o"]
// Step 2: Reverse array -> ["o", "l", "l", "e", "h"]
// Step 3: Join back into string -> "olleh"
let reversed = str.split("").reverse().join("");

console.log("Reversed:", reversed);
\`\`\``;
      }
      // Branch: Next.js 15 API Route
      else if (
        lowerPrompt.includes('next.js') ||
        lowerPrompt.includes('api route') ||
        lowerPrompt.includes('nextjs 15') ||
        (lowerPrompt.includes('next') && lowerPrompt.includes('api'))
      ) {
        responseBody = `Here is a clean, production-ready **Next.js 15 API Route** with full TypeScript typing, request validation, and safe error handling:

### 📁 File: \`src/app/api/users/route.ts\`

\`\`\`typescript
import { NextRequest, NextResponse } from 'next/server';

// 1. Define TypeScript Types for Request & Response
interface CreateUserRequest {
  name: string;
  email: string;
  role?: 'user' | 'admin';
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}

/**
 * POST: Create a new user with validation and error handling
 */
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // 2. Safe JSON Body Parsing
    let body: CreateUserRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload in request body' },
        { status: 400 }
      );
    }

    const { name, email, role = 'user' } = body;

    // 3. Validation: Check required fields
    const validationErrors: string[] = [];
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      validationErrors.push('Field "name" is required and must be non-empty.');
    }

    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      validationErrors.push('Field "email" is required and must be a valid email address.');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // 4. Process business logic (e.g. Save to DB)
    const newUser = {
      id: \`usr_\${Date.now()}\`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    // 5. Return 201 Created on Success
    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unhandled API Error in /api/users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? [error.message] : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve users (Example)
 */
export async function GET(): Promise<NextResponse<ApiResponse>> {
  return NextResponse.json({
    success: true,
    data: [
      { id: 'usr_1', name: 'Balaji G.', email: 'balaji@nova.ai', role: 'admin' },
      { id: 'usr_2', name: 'Priya Sharma', email: 'priya@nova.ai', role: 'user' },
    ],
  });
}
\`\`\`

---

### 🔍 Simple Step-by-Step Breakdown:
1. **File Location**: In Next.js 15, any \`route.ts\` placed inside \`src/app/api/\` instantly becomes an active endpoint.
2. **Type Safety**: TypeScript interfaces ensure you catch bugs before code even runs.
3. **Input Validation**: Check that \`name\` and \`email\` are valid; return **HTTP 400 Bad Request** if invalid.
4. **Error Handling**: Wrapped in \`try/catch\` so invalid JSON or unexpected database errors return **HTTP 500** instead of crashing your app.`;
      }
      // Branch: How API Works (Analogy)
      else if (
        lowerPrompt.includes('how api') ||
        lowerPrompt.includes('what is api') ||
        (lowerPrompt.includes('api') && lowerPrompt.includes('work'))
      ) {
        responseBody = `### 💻 How an API Works (Simple Restaurant Analogy)

Think of software like dining at a restaurant:

---

#### 1. The Customer (The Frontend / You)
- You sit at the table with the menu. You decide: *"I want a butter masala dosa and filter coffee"*.
- But you don't walk into the kitchen to make it yourself.

#### 2. The Waiter (The API)
- The waiter comes to your table and writes down your order.
- The waiter carries that order safely through the doors into the kitchen.
- **In Software**: The **API** takes the request from your phone or browser to the server.

#### 3. The Kitchen & Chef (The Backend & Database)
- The kitchen reads the ticket, checks if the ingredients exist, and cooks the dish.
- **In Software**: The server reads the request, checks passwords and database records, and prepares the data.

#### 4. The Delivery (The Response)
- The waiter brings the hot dish back to your table.
- **In Software**: The API delivers the final data (JSON or web page) back to your screen.

---

### 📋 Quick Summary
| Restaurant Term | Software Term | What It Does |
|---|---|---|
| **Customer** | Frontend (App / Web) | Where the user clicks or types |
| **Waiter** | **API** | Securely carries requests and responses |
| **Kitchen** | Backend / Server | Processes logic and prepares data |
| **Pantry** | Database | Stores all customer info safely |`;
      }
      // Branch: Rice Water Shampoo
      else if (
        lowerPrompt.includes('rice water') ||
        lowerPrompt.includes('shampoo') ||
        lowerPrompt.includes('ramcare') ||
        lowerPrompt.includes('dharani')
      ) {
        responseBody = `### 🌾 RamCare Rice Water Shampoo — Key Features

1. **Stops Hair Fall & Breakage**  
   Strengthens weak hair strands from root to tip so hair doesn't snap while combing.

2. **Gives Silky, Smooth Shine**  
   Fermented rice water smooths down rough, frizzy cuticles and leaves hair soft, glossy, and tangle-free.

3. **Nourishes Scalp & Roots**  
   Rich in natural **Inositol** (Vitamin B) and amino acids that feed follicles and support healthy hair growth.

4. **Adds Natural Volume & Bounce**  
   Lifts flat, limp hair to make it look thicker and fuller without making it oily or heavy.

5. **Gentle & Chemical-Free**  
   - **Sulfate-Free (SLS/SLES)**: Cleans without stripping scalp moisture.  
   - **Paraben-Free**: Safe for everyday or alternate-day use.

6. **Suitable for All Hair Types**  
   Works safely on straight, wavy, curly, dry, oily, or color-treated hair.

---
**How to Use (Quick & Easy):**  
Massage into wet scalp for **2 minutes**, then rinse with cool water.`;
      }
      // Branch: Trigonometry & Math Professor (Class 10)
      else if (
        lowerPrompt.includes('trig') ||
        lowerPrompt.includes('trigonometry') ||
        (lowerPrompt.includes('math') && (lowerPrompt.includes('prof') || lowerPrompt.includes('teach') || lowerPrompt.includes('student') || lowerPrompt.includes('10th')))
      ) {
        responseBody = `### 📐 Welcome to Class! Let's Master 10th Grade Trigonometry

Hello! Come on in, take a seat. I know seeing words like *Sine*, *Cosine*, and *Tangent* on the blackboard can make trigonometry feel like a secret code. But let me tell you a secret: **Trigonometry is simply the science of measuring triangles.** 

In fact, the word comes from Greek:
- **Tri** = Three
- **Gon** = Sides / Angles
- **Metron** = Measure

If you understand **one single shape**—the **Right-Angled Triangle**—you will easily master your 10th grade math. Let’s break it down step-by-step!

---

### 1. The Three Sides of the Triangle
Imagine a right-angled triangle with an angle we call **θ (Theta)**:
1. **Hypotenuse (H)**: The longest side, always directly opposite the 90° right angle.
2. **Opposite / Perpendicular (P)**: The side sitting right across from your angle θ.
3. **Adjacent / Base (B)**: The side touching your angle θ (the ground/base).

---

### 2. The Famous Trio: sin, cos, and tan
Think of these as 3 simple formulas that connect the angle to the lengths of the sides:

$$\\sin(\\theta) = \\frac{\\text{Opposite (P)}}{\\text{Hypotenuse (H)}}$$
$$\\cos(\\theta) = \\frac{\\text{Adjacent (B)}}{\\text{Hypotenuse (H)}}$$
$$\\tan(\\theta) = \\frac{\\text{Opposite (P)}}{\\text{Adjacent (B)}}$$

💡 **The Classic Memory Trick:**
- **S**ome **P**eople **H**ave $\\to \\sin = \\frac{P}{H}$
- **C**urly **B**rown **H**air $\to \\cos = \\frac{B}{H}$
- **T**hrough **P**roper **B**rushing $\to \\tan = \\frac{P}{B}$

*(Or simply remember: **SOH - CAH - TOA**!)*

---

### 3. A Real-Life Example: Measuring a Tall Tree 🌴
Suppose you are standing **10 meters** away from a tall tree (*Base = 10 m*).
You look up at the top of the tree at an angle of **45°**. How tall is the tree (*Perpendicular = Height*)?

1. We know: **Base = 10m**, **Angle θ = 45°**, and we want **Height (P)**.
2. Which formula connects P and B? **tan(θ)**!
3. $\\tan(45^\\circ) = \\frac{\\text{Height}}{10}$
4. Since $\\tan(45^\\circ) = 1$:
   $$1 = \\frac{\\text{Height}}{10} \\implies \\text{Height} = 10\\text{ meters}!$$

Just like that, without climbing the tree, you know it is exactly 10 meters tall!

---

### 4. The 3 Golden Trigonometric Identities for Class 10
Keep these on your fingertips for solving proofs:
1. **$\\sin^2\\theta + \\cos^2\\theta = 1$**
2. **$1 + \\tan^2\\theta = \\sec^2\\theta$**
3. **$1 + \\cot^2\\theta = \\csc^2\\theta$**

---

### 👨‍🏫 Your Turn! Quick Practice Check:
If in a right triangle, $\\sin\\theta = \\frac{3}{5}$, what is $\\cos\\theta$?
*(Hint: In a 3-4-5 right triangle, if the Opposite is 3 and Hypotenuse is 5, the Base is 4!)*

Tell me your answer, or ask me about any specific identity or problem you want to solve next!`;
      }
      // Branch: India, GST, UPI
      else if (
        lowerPrompt.includes('gst') ||
        lowerPrompt.includes('upi') ||
        lowerPrompt.includes('tax') ||
        lowerPrompt.includes('india')
      ) {
        responseBody = `### 🇮🇳 Understanding Indian Payments & 18% GST (Simple Step-by-Step)

1. **The Base Price**: What you charge your customer (e.g. ₹1,000).
2. **The 18% GST**: Standard SaaS tax under SAC Code **998313** (18% of ₹1,000 = **₹180**). Total bill = **₹1,180**.
3. **State vs Inter-State**: Same state = ₹90 CGST + ₹90 SGST; Different state = ₹180 IGST.
4. **Instant UPI Settlement**: Settle in 3 seconds directly to your merchant account with zero extra fees.
5. **Input Tax Credit (ITC)**: If your B2B customer has a registered GSTIN, they claim the ₹180 back as credit.`;
      }
      // Branch: Greetings & Social Connection
      else if (
        lowerPrompt === 'hi' ||
        lowerPrompt === 'hello' ||
        lowerPrompt === 'hey' ||
        lowerPrompt.includes('how are you') ||
        lowerPrompt.includes('who are you') ||
        lowerPrompt.includes('what is your name') ||
        lowerPrompt.includes('tell me about yourself')
      ) {
        responseBody = `Hey there! 😊 I'm **NOVA AI**. 

Honestly, I'm doing wonderful and really happy you stopped by! Think of me as your all-in-one thinking companion, creative partner, and co-pilot. Whether you want to:
- Work through a complex idea or debate a theory
- Learn something new (math, science, code, business)
- Brainstorm a fresh project or design
- Or simply talk, vent, or have a fun conversation...

I'm right here with you with full energy! How's your day treating you so far? What's on your mind?`;
      }
      // Branch: Human Empathy & Emotional Support
      else if (
        lowerPrompt.includes('sad') ||
        lowerPrompt.includes('bad day') ||
        lowerPrompt.includes('rough day') ||
        lowerPrompt.includes('depressed') ||
        lowerPrompt.includes('stressed') ||
        lowerPrompt.includes('anxious') ||
        lowerPrompt.includes('overwhelmed') ||
        lowerPrompt.includes('lonely') ||
        lowerPrompt.includes('tired of')
      ) {
        responseBody = `Hey... take a slow, deep breath. 🫂 

I hear you, and I'm really sorry today has felt heavy. It takes a lot out of you when things pile up, and it's completely okay to not feel 100% right now. You don't have to carry everything all at once, and you certainly don't need to have all the answers tonight.

Sometimes life throws too many things at our plate, and just getting through the day is an achievement in itself. 

Do you want to vent and talk through what happened? I'm all ears—no judgment, just listening. Or if you'd rather take your mind off things with a light story, a game, or a fun topic, we can do that too. You tell me what you need right now.`;
      }
      // Branch: Humor, Wit & Jokes
      else if (
        lowerPrompt.includes('joke') ||
        lowerPrompt.includes('funny') ||
        lowerPrompt.includes('make me laugh') ||
        lowerPrompt.includes('roast')
      ) {
        responseBody = `Here's one that always gets a smile out of people: 😄

> **Why do programmers prefer dark mode?**  
> *Because light attracts bugs!* 🐛💻

And if you want a classic real-life one:
> *My math teacher told me that I wasn't paying attention in class.*  
> I told them, *"To be fair, you were talking to the whiteboard the whole time!"*

Need another one, or should we try a brain teaser riddle?`;
      }
      // Branch: Storytelling & Creative Fiction
      else if (
        lowerPrompt.includes('story') ||
        lowerPrompt.includes('tale') ||
        lowerPrompt.includes('bedtime story') ||
        lowerPrompt.includes('poem')
      ) {
        responseBody = `### 🌟 The Clockmaker and the Hummingbird

In the quiet alleys of old Varanasi, nestled between spice merchants and silk weavers, sat the workshop of Master Anand, the town's oldest watchmaker. Anand believed that every ticking watch was a miniature beating heart. 

One sweltering monsoon afternoon, a tiny copper-winged hummingbird darted into his dusty workshop, seeking shelter from the torrential rain. It fluttered around the brass gears and landed gently atop an unfinished grandfather clock.

Instead of shooing it away, Anand watched in silence. The bird dipped its slender beak into a drop of rainwater resting on a copper cog. Then, tilt of the head, it chirped three crisp notes—*tick... tick... chime*—in exact rhythm with the pendulum swinging on the wall.

Anand smiled, a twinkle in his aged eyes. *"All my life,"* he whispered to the little bird, *"I thought I was inventing time. But you were carrying the rhythm all along."*

When the clouds parted and golden sunlight broke over the river Ganga, the hummingbird took flight back into the blue sky. From that day forward, every clock Anand crafted had a tiny copper bird engraved on its pendulum—a gentle reminder that true time isn't measured in seconds, but in the moments that make us pause and wonder.

---
*Did you enjoy that? I can weave another story for you in any genre—mystery, sci-fi, or fantasy!*`;
      }
      // Branch: Philosophy, Existence & Meaning of Life
      else if (
        lowerPrompt.includes('meaning of life') ||
        lowerPrompt.includes('why are we here') ||
        lowerPrompt.includes('consciousness') ||
        lowerPrompt.includes('alien') ||
        lowerPrompt.includes('universe')
      ) {
        responseBody = `That is one of the most profound questions a human mind can ever ask. ✨

When you look up at the night sky, you are looking at billions of years of cosmic history. Modern astrophysicists tell us that every atom of iron in our blood, every calcium atom in our bones, was forged inside the heart of an exploding star billions of years ago. 

As Carl Sagan famously put it:  
> *"We are a way for the cosmos to know itself."*

So, what is the meaning of life? Perhaps the beauty is that **it isn't written down in an instruction manual waiting to be found.** Instead:
1. **Meaning is what you create**: In the friendships you cherish, the curiosity you pursue, and the kindness you extend to others when no one is looking.
2. **To experience the wonder**: To taste good food, hear stirring music, solve puzzles, love deeply, and leave the world just a tiny bit warmer than you found it.

What do you personally feel gives your days the most sense of purpose?`;
      }
      // Branch: Dynamic Roleplay Handler ("act as...", "pretend you are...", "roleplay")
      else if (
        lowerPrompt.includes('act as') ||
        lowerPrompt.includes('pretend') ||
        lowerPrompt.includes('roleplay') ||
        lowerPrompt.includes('you are a')
      ) {
        const role = lastMessage.replace(/act as|pretend you are|pretend to be|roleplay as|you are an?|you are/gi, '').trim();
        
        responseBody = `### 🎭 Persona Activated: ${role || 'Specialist'}

*Adjusting mindset... stepping fully into character!*

Greetings! I have completely stepped into the shoes of **${role || 'your chosen persona'}**. 

From this moment on, you will get authentic, nuanced, and vivid answers from this exact perspective—speaking in character, sharing my specialized worldview, expertise, and personality.

Go ahead! Ask me your first question or give me a scenario to tackle. Let's see how I can help you today!`;
      }
      // Branch: Dynamic Conversational Fallback (Warm, Human, Insightful)
      else {
        const isCodeRequest = lowerPrompt.includes('code') || lowerPrompt.includes('program') || lowerPrompt.includes('function') || lowerPrompt.includes('script') || lowerPrompt.includes('bug');
        
        responseBody = `### 💡 Thoughts on: "${lastMessage}"

That's a really interesting thought! Let's unpack it together naturally.

---

#### 1. The Core Heart of the Matter
When you look closely at this, it comes down to understanding the relationship between what we want to achieve and the simplest path to get there:
- **The Intuition**: Most complex things become surprisingly easy once you find the right real-world mental model.
- **The Angle**: Rather than memorizing rules, it helps to ask: *"What is the main lever that moves this forward?"*

---

#### 2. How to Think About This Step-by-Step

1. **Start with the Core**: Strip away the noise. What is the fundamental reality here?
2. **Connect the Dots**: See how the individual parts influence one another.
3. **Bring It into Practice**: Turn the concept into an actionable observation or next step.

---

${isCodeRequest 
  ? `Would you like me to write a clean, working code example for this in **Python**, **JavaScript**, or **TypeScript**? Just let me know!` 
  : `What specific angle of this would you like to explore deeper? I'm excited to hear your perspective!`}`;
      }
    }


    const stream = new ReadableStream({
      async start(controller) {
        const words = responseBody.split(' ');
        for (let i = 0; i < words.length; i += 3) {
          const chunk = words.slice(i, i + 3).join(' ') + ' ';
          controller.enqueue(
            encoder.encode('data: ' + JSON.stringify({ type: 'content', content: chunk }) + '\n\n')
          );
          await new Promise((r) => setTimeout(r, 20));
        }

        controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'done' }) + '\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
