"use client";
import { Share } from 'lucide-react';
import React from 'react';

export default function ShareButton({ title, text }: { title: string, text: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <button onClick={handleShare} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
      <Share className="h-4 w-4" /> Share
    </button>
  );
}
