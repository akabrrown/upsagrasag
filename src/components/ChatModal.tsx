/* src/components/ChatModal.tsx */
'use client';

import React from 'react';
import { X, Headset } from 'lucide-react';
import ChatPage from '@/app/chat/page';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChatModal({ open, onClose }: ChatModalProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl rounded-xl overflow-hidden w-full max-w-[400px] h-[600px] max-h-[calc(100vh-3rem)] bg-white border border-gray-200">
      {/* Header */}
      <div className="bg-[#FDB913] px-4 py-4 flex items-center justify-between text-[#0a1f44]">
        <div className="flex items-center gap-3">
          <Headset className="h-7 w-7" />
          <h2 className="font-bold text-lg">UPSA GRASAG Virtual Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="text-[#0a1f44] hover:text-[#0a1f44]/80 transition-colors"
          aria-label="Close chat"
        >
          <X size={24} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        <ChatPage />
      </div>
    </div>
  );
}
