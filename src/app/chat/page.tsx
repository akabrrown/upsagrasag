export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hello! I'm Smart UPSA, your virtual assistant. I can help with admissions, programs, student life, and more at the University of Professional Studies, Accra. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        // ignore parsing errors
      }
    }
  }, []);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: currentTime
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: currentTime
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
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: 'Sorry, I could not get an answer from the AI. Please try again later.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
        ]);
        return;
      }

      // Continue processing response
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
              ? { ...msg, content: accumulatedContent, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Sorry, I'm having trouble connecting to my service right now. Please try again later.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Persist messages to localStorage
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-white h-full w-full">
      {/* Sub Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 shrink-0">
        <h2 className="font-semibold text-[#0a1f44] text-lg"></h2>
        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Online
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-[#f8f9fa]">
        {messages.map((message) => {
          const isAI = message.role === 'assistant';
          return (
            <div
              key={message.id}
              className={
                `flex gap-3 max-w-[90%] ` +
                (isAI ? 'mr-auto' : 'ml-auto flex-row-reverse')
              }
            >
              {isAI && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0a1f44] text-[#FDB913] mt-1 shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-full ${isAI ? 'items-start' : 'items-end'}`}>
                <div className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${isAI ? 'bg-[#0a1f44] text-[#FDB913] rounded-tl-sm' : 'bg-[#FDB913] text-[#0a1f44] rounded-tr-sm font-medium'}`}>
                  {message.content || (
                    <span className="flex gap-1 items-center py-1">
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                  )}
                  {isAI && message.content && message.timestamp && (
                    <div className="text-[11px] text-gray-400 mt-2 block">
                      {message.timestamp}
                    </div>
                  )}
                </div>
                {!isAI && message.timestamp && (
                  <span className="text-[11px] text-gray-400 px-1">
                    {message.timestamp}
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
        className="bg-white p-4 shrink-0 border-t border-gray-100"
      >
        <div className="flex gap-3 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question about UPSA..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] shadow-sm focus:border-[#FDB913] focus:outline-none focus:ring-1 focus:ring-[#FDB913] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#0a1f44] text-white transition hover:bg-[#0a1f44]/90 disabled:opacity-50 disabled:bg-[#cbd5e1]"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}
