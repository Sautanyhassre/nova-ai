'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import {
  ArrowUp,
  Plus,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Paperclip,
  Code2,
  Lightbulb,
  FileText,
  Compass,
} from 'lucide-react';

interface ChatStudioProps {
  selectedModel: string;
}

export const ChatStudio: React.FC<ChatStudioProps> = ({ selectedModel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() && attachedFiles.length === 0) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
      attachments: attachedFiles.length > 0 ? [...attachedFiles] : undefined,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setAttachedFiles([]);
    setIsStreaming(true);

    const assistantMsgId = `asst-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
    };

    setMessages([...newMessages, initialAssistantMsg]);

    try {
      const storedKey = typeof window !== 'undefined' ? localStorage.getItem('nova_gemini_key') : null;
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel,
          apiKey: storedKey || undefined,
          reasoningMode: 'balanced',
        }),
      });

      if (!response.body) throw new Error('No streaming response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'content') {
                assistantContent += data.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: assistantContent } : m
                  )
                );
              }
            } catch (e) {}
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content: `Something went wrong. Please check your connection and try again.`,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems = Array.from(files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      type: f.type || 'text/plain',
    }));
    setAttachedFiles((prev) => [...prev, ...newItems]);
  };

  const starterCards = [
    {
      title: 'Analyze product features',
      subtitle: 'e.g. RamCare Rice Water Shampoo benefits',
      icon: Lightbulb,
      prompt: 'Can you give the features of the rice water shampoo in a simple, clear, step-by-step way?',
    },
    {
      title: 'Help me code',
      subtitle: 'e.g. Write a clean Next.js 15 API route',
      icon: Code2,
      prompt: 'Write a clean Next.js 15 API route with error handling and TypeScript',
    },
    {
      title: 'Explain something simply',
      subtitle: 'e.g. How Indian GST works for SaaS',
      icon: Compass,
      prompt: 'Explain how 18% GST works for Indian online businesses in plain words',
    },
    {
      title: 'Draft a plan or email',
      subtitle: 'e.g. Marketing strategy for product launch',
      icon: FileText,
      prompt: 'Help me draft a simple, clear launch plan for a new digital product in India',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#212121] text-[#ececec] overflow-hidden select-text">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* ChatGPT Empty State */
          <div className="h-full flex flex-col items-center justify-center px-4 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-white mb-8 tracking-tight">
              What can I help with today?
            </h2>

            {/* Clean Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              {starterCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSend(card.prompt)}
                    className="p-3.5 rounded-2xl bg-[#2a2a2a] hover:bg-[#333333] border border-[#383838] transition text-left group"
                  >
                    <Icon className="h-4 w-4 text-slate-400 mb-2 group-hover:text-white transition" />
                    <p className="text-sm font-medium text-slate-200">{card.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{card.subtitle}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Conversation List (Exact ChatGPT Layout) */
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.role === 'user' ? (
                  /* User Bubble (ChatGPT Rounded Grey Capsule) */
                  <div className="max-w-[80%] rounded-3xl bg-[#2f2f2f] px-5 py-3 text-[#ececec] text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {msg.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-black/40 px-2.5 py-1 rounded-lg text-slate-300 flex items-center space-x-1.5"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span>{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {msg.content}
                  </div>
                ) : (
                  /* Assistant Response (Clean Full-width text with markdown) */
                  <div className="w-full text-[#ececec] text-sm md:text-base leading-relaxed space-y-3">
                    <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* Action Bar (Copy, Regenerate, Thumbs) */}
                    {msg.content && (
                      <div className="flex items-center space-x-2 pt-2 text-slate-400 text-xs">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="p-1.5 rounded-lg hover:text-white hover:bg-[#2f2f2f] transition"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSend(messages[messages.indexOf(msg) - 1]?.content)}
                          className="p-1.5 rounded-lg hover:text-white hover:bg-[#2f2f2f] transition"
                          title="Regenerate"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isStreaming && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                <span>Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area (Centered Max-w-3xl Capsule, Exact ChatGPT style) */}
      <div className="p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent">
        <div className="max-w-3xl mx-auto w-full">
          {/* File Attachments Pills */}
          {attachedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachedFiles.map((f, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#2f2f2f] text-xs text-slate-200 border border-[#3d3d3d]"
                >
                  <Paperclip className="h-3 w-3" />
                  <span>{f.name}</span>
                  <button
                    onClick={() => setAttachedFiles(attachedFiles.filter((_, idx) => idx !== i))}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input Capsule */}
          <div className="relative rounded-3xl bg-[#2f2f2f] border border-[#383838] focus-within:border-[#4d4d4d] transition-all px-4 py-3 flex items-end shadow-lg">
            {/* Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 -ml-1 text-slate-400 hover:text-white transition rounded-full hover:bg-[#383838]"
              title="Attach files"
            >
              <Plus className="h-5 w-5" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Message NOVA..."
              rows={1}
              className="flex-1 bg-transparent text-sm md:text-base text-white placeholder-slate-400 resize-none focus:outline-none px-3 py-1 max-h-48 overflow-y-auto"
            />

            {/* Circular Send Button (Black/White icon button like ChatGPT) */}
            <button
              onClick={() => handleSend()}
              disabled={isStreaming || (!input.trim() && attachedFiles.length === 0)}
              className="h-8 w-8 rounded-full bg-white disabled:bg-[#424242] text-black disabled:text-[#888] flex items-center justify-center transition shrink-0 ml-2"
              title="Send message"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* ChatGPT-style Subtext */}
          <p className="text-center text-[11px] text-slate-400 mt-2">
            NOVA can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};
