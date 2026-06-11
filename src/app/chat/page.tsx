'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
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

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSaveChat = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-conversation.json';
    a.click();
    URL.revokeObjectURL(url);
  };

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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
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
    localStorage.removeItem('chatMessages');
  };

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Suggestion buttons component
  const suggestedQuestions = [
    "What programs are available?",
    "How do I apply?",
    "Scholarship info?",
    "Campus events?",
  ];

  const suggestionButtons = (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestedQuestions.map((q) => (
        <button
          key={q}
          onClick={() => handleSend(q)}
          className="px-3 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition"
        >
          {q}
        </button>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 h-screen flex flex-col lg:flex-row gap-8 bg-background text-foreground">
      {/* Sidebar - Info / Suggestions */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="site-card-dark p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-primary">GRASAG AI</h2>
              <p className="text-xs text-neutral-400">Always active assistant</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-primary mb-2">Quick Prompts</h2>
          {suggestionButtons}
        </div>
        <button
          onClick={handleSaveChat}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
        >
          Save Conversation
        </button>
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
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 hover:text-rose-600 transition-colors"
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
                className={
                  `flex gap-4 max-w-2xl ` +
                  (isAI ? 'mr-auto' : 'ml-auto flex-row-reverse')
                }
              >
                <div
                  className={
                    `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ` +
                    (isAI ? 'bg-accent text-white' : 'bg-primary text-white')
                  }
                >
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
            {/* Loading spinner */}
            {isLoading && (
              <div className="flex items-center gap-2 text-primary">
                <Loader2 className="animate-spin h-5 w-5" />
                Thinking...
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-accent shrink-0 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
