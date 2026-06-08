'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chatMessages');
      if (stored) {
        try {
          return JSON.parse(stored) as Message[];
        } catch {
          // ignore parsing errors
        }
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am your GRASAG-UPSA AI Assistant. Ask me anything about postgraduate programmes, welfare packages, past questions, registration, or campus events."
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What welfare schemes are available for graduate students?",
    "How can I access the Past Question Bank?",
    "Where is the GRASAG-UPSA secretariat located?",
    "What are the requirements for MBA programs at UPSA?"
  ];

  // Persist messages to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: ''
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const allMessages = [...messages, userMessage];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get answer from AI');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No readable stream available');
      }

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, I'm having trouble connecting to my service right now. Please try again later." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I am your GRASAG-UPSA AI Assistant. Ask me anything about postgraduate programmes, welfare packages, past questions, registration, or campus events."
      }
    ]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 h-[calc(100vh-14rem)] flex flex-col lg:flex-row gap-8 bg-background text-foreground">
      {/* Sidebar - Info / Suggestions */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="site-card-dark">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-primary">GRASAG AI</h2>
              <p className="text-xs text-neutral-400">Always active assistant</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-neutral-600 leading-relaxed">
            This chatbot connects to our self-hosted LLM running on Render. It is designed to assist you with all association queries without quota limits.
          </p>
        </div>

        <div className="site-card-light bg-white">
          <div className="flex items-center gap-2 font-bold text-primary text-sm mb-4">
            <HelpCircle className="h-4 w-4 text-accent" /> Suggested Questions
          </div>
          <div className="flex flex-col gap-2.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-left text-xs rounded-xl border border-neutral-200 bg-slate-50 p-3 hover:bg-neutral-100 hover:text-accent transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        
        <div className="site-card-dark bg-slate-50">
          <h2 className="font-bold text-primary text-sm">Upcoming Congress</h2>
          <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
            <span className="font-bold text-accent">14th Annual GRASAG‑UPSA General Congress</span><br />
            Join our research symposium, professional development panels, and networks. Ensure you register and reserve your delegates slot.
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="lg:hidden text-neutral-500 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h2 className="font-bold text-primary">Student Assistant</h2>
              <p className="text-xs text-emerald-600 font-medium">Online & ready</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Clear chat
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/30">
          {messages.map((message) => {
            const isAI = message.role === 'assistant';
            return (
              <div
                key={message.id}
                className={`flex gap-4 max-w-2xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isAI ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
                  {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${isAI ? 'bg-white border border-neutral-200 text-neutral-800' : 'bg-primary text-white'}`}>
                  {message.content || (
                    <span className="flex gap-1 items-center py-1">
                      <span className="h-1.5 w-1.5 bg-neutral-450 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-neutral-450 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 bg-neutral-450 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="border-t border-neutral-100 bg-white p-4"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              disabled={isLoading}
              className="form-input"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-accent shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
