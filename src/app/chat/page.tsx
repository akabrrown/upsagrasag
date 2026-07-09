'use client';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
      content: "👋 Hello! I'm **Smart UPSA**, your virtual assistant.\n\nI can help with admissions, postgraduate programs, student life, past questions, and more at the University of Professional Studies, Accra. How can I assist you today?",
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

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="flex flex-col bg-[#F9FAFB] h-screen w-full relative font-sans overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 max-w-4xl mx-auto w-full relative">
          <Link href="/" className="absolute -left-12 sm:-left-16 p-2 rounded-full hover:bg-black/5 transition-colors hidden lg:flex items-center text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#004080] to-[#0a1f44] flex items-center justify-center text-[#FDB913] shadow-lg shadow-[#004080]/20 shrink-0">
            <Bot size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">Smart UPSA</h1>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-600 tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online & Ready
            </div>
          </div>
        </div>
      </header>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto w-full scroll-smooth">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8 pb-40 flex flex-col gap-6 sm:gap-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const isAI = message.role === 'assistant';
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex gap-3 sm:gap-4 max-w-[90%] sm:max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {isAI && (
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#0a1f44] text-[#FDB913] mt-1 shadow-md border-2 border-white">
                      <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-1.5 max-w-full ${isAI ? 'items-start' : 'items-end'}`}>
                    <div 
                      className={`relative px-5 py-3.5 sm:px-6 sm:py-4 text-[15px] sm:text-[15.5px] leading-relaxed shadow-sm
                      ${isAI 
                        ? 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)]' 
                        : 'bg-[#004080] text-white rounded-2xl rounded-tr-sm shadow-[0_4px_14px_rgb(0,64,128,0.2)]'
                      }`}
                    >
                      {message.content ? (
                        <div className={`[&>*:last-child]:mb-0 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold ${isAI ? '[&_strong]:text-gray-900' : '[&_strong]:text-white'} [&_a]:underline [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mb-1 break-words whitespace-pre-wrap`}>
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex gap-1.5 items-center py-2 px-1">
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                          <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        </div>
                      )}
                    </div>
                    {message.timestamp && (
                      <span className="text-[11px] font-medium text-gray-400 px-1 select-none">
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Form */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent pointer-events-none z-20">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200/60 p-1.5 sm:p-2 flex items-end transition-all focus-within:shadow-[0_8px_40px_rgb(0,64,128,0.12)] focus-within:ring-2 focus-within:ring-[#004080]/10"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about UPSA..."
              disabled={isLoading}
              className="flex-1 bg-transparent px-4 py-3 sm:px-5 sm:py-3.5 text-[15px] sm:text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 min-w-0"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#004080] text-white transition-all hover:bg-[#003060] hover:shadow-lg hover:shadow-[#004080]/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none disabled:bg-gray-300 disabled:text-gray-500 ml-2"
            >
              {isLoading ? <Loader2 className="h-5 w-5 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />}
            </button>
          </form>
          <div className="text-center mt-3 sm:mt-4">
            <span className="text-[10px] sm:text-xs font-medium text-gray-400">
              Smart UPSA can make mistakes. Verify important information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
