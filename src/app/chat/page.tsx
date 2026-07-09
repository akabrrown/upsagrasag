'use client';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Sparkles, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

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
      content: "👋 Hello! I'm your virtual assistant. I can help with admissions, programs, student life, and more at the University of Professional Studies, Accra. How can I assist you today?",
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
    <div className="flex-1 flex flex-col bg-white h-full w-full items-center">
      {/* Header */}
      <div className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md px-5 py-4 shrink-0 flex justify-center z-10 sticky top-0">
        <div className="w-full max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004080] text-[#FDB913]">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-[#004080] text-lg tracking-tight">AI Assistant</h2>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </div>
        </div>
      </div>

      {/* Messages Body */}
      <div className="w-full flex-1 overflow-y-auto bg-white flex justify-center scroll-smooth">
        <div className="w-full max-w-3xl px-4 py-8 space-y-8 flex flex-col">
          <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isAI = message.role === 'assistant';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex gap-4 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm mt-1 ${isAI ? 'bg-[#004080] text-[#FDB913]' : 'bg-gray-100 text-gray-400'}`}>
                  {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-full ${isAI ? 'items-start' : 'items-end'}`}>
                  <div className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                    isAI 
                      ? 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm' 
                      : 'bg-[#f3f4f6] text-gray-800 rounded-2xl rounded-tr-sm font-medium'
                  }`}>
                    {message.content ? (
                      <div className={`[&>*:last-child]:mb-0 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-bold [&_a]:underline [&_a]:text-[#004080] [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mb-1 break-words`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="flex gap-1.5 items-center py-2 px-1">
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="h-1.5 w-1.5 bg-[#004080]/50 rounded-full"></motion.span>
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-1.5 w-1.5 bg-[#004080]/50 rounded-full"></motion.span>
                        <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-1.5 w-1.5 bg-[#004080]/50 rounded-full"></motion.span>
                      </span>
                    )}
                  </div>
                  {message.timestamp && (
                    <span className="text-[11px] text-gray-400 px-1 font-medium mt-1">
                      {message.timestamp}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Input Form */}
      <div className="w-full bg-white border-t border-gray-100 p-4 shrink-0 flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="w-full max-w-3xl flex gap-3 items-end"
        >
          <div className="flex-1 relative flex items-end shadow-sm border border-gray-200 rounded-2xl bg-[#f9fafb] overflow-hidden focus-within:border-[#004080] focus-within:ring-1 focus-within:ring-[#004080] transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full bg-transparent px-4 py-3.5 text-[15px] focus:outline-none disabled:opacity-50 text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl bg-[#004080] text-white transition-all hover:bg-[#003060] disabled:opacity-40 disabled:hover:bg-[#004080] shadow-md shadow-[#004080]/20 active:scale-95"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
          </button>
        </form>
      </div>
    </div>
  );
}
