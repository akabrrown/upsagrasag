"use client";
import { Share } from 'lucide-react';
import React from 'react';

export default function ShareButton({ title, text, imageUrl }: { title: string, text: string, imageUrl?: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        // If the image URL is provided and the platform supports sharing files, include the image
        if (imageUrl && navigator.canShare && navigator.canShare({ files: [] })) {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], 'cover.jpg', { type: blob.type });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              text,
              files: [file],
              url: window.location.href,
            });
            return;
          }
        }
        // Fallback to sharing just title, text, and URL
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
