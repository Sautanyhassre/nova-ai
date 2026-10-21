import { NextRequest, NextResponse } from 'next/server';

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

    const validationErrors: string[] = [];
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      validationErrors.push('Field "name" is required and must be non-empty.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Unhandled API Error in /api/users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve users (Instant browser test)
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
