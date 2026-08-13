"use client";

import React, { useState } from 'react';
import { MessageCircle, Send, ThumbsUp, User, ChevronDown } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  body: string;
  timestamp: string;
  likes: number;
}

// Lightweight localStorage key helper
const storageKey = (articleId: string) => `grasag_comments_${articleId}`;

function loadComments(articleId: string): Comment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(articleId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveComments(articleId: string, comments: Comment[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(articleId), JSON.stringify(comments));
}

export default function CommentsSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>(() => loadComments(articleId));
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;

    const newComment: Comment = {
      id: `${Date.now()}`,
      author: name.trim(),
      body: body.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(articleId, updated);
    setName('');
    setBody('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) return;
    const updated = comments.map(c =>
      c.id === id ? { ...c, likes: c.likes + 1 } : c
    );
    setComments(updated);
    saveComments(articleId, updated);
    setLikedIds(prev => [...prev, id]);
  };

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <section className="mt-10 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/60">
        <MessageCircle className="w-5 h-5 text-[#0c2340]" />
        <h2 className="text-base font-extrabold text-[#0c2340]">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-xs font-bold bg-[#0c2340] text-white px-2 py-0.5 rounded-full">
              {comments.length}
            </span>
          )}
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 border-b border-gray-100 space-y-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leave a comment</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={60}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0c2340] transition-all"
          />
          {/* Email optional — no backend, just cosmetic */}
          <input
            type="email"
            placeholder="Email (optional, not published)"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0c2340] transition-all"
          />
        </div>

        <textarea
          placeholder="Share your thoughts on this article…"
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          rows={4}
          maxLength={800}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0c2340] transition-all resize-none"
        />

        <div className="flex items-center justify-between">
          <p className="text-[11px] text-gray-400">{body.length}/800 characters</p>
          <button
            type="submit"
            className="bg-[#0c2340] hover:bg-[#1a3a5c] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            disabled={!name.trim() || !body.trim()}
          >
            <Send className="w-4 h-4" />
            Post Comment
          </button>
        </div>

        {submitted && (
          <p className="text-xs text-emerald-600 font-semibold animate-fade-in">
            ✓ Your comment has been posted. Thank you!
          </p>
        )}
      </form>

      {/* Comment List */}
      <div className="divide-y divide-gray-50">
        {comments.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400 space-y-1">
            <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="font-semibold text-gray-500">No comments yet.</p>
            <p>Be the first to share your thoughts.</p>
          </div>
        ) : (
          <>
            {visibleComments.map(c => (
              <div key={c.id} className="px-6 py-5 flex items-start gap-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-[#0c2340]/10 text-[#0c2340] flex items-center justify-center shrink-0 font-bold text-sm uppercase">
                  {c.author.charAt(0)}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-extrabold text-[#0c2340] text-sm">{c.author}</span>
                    <time className="text-[11px] text-gray-400 font-medium">
                      {new Date(c.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.body}</p>

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(c.id)}
                    disabled={likedIds.includes(c.id)}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold transition-colors cursor-pointer mt-1 ${
                      likedIds.includes(c.id)
                        ? 'text-[#d4af37]'
                        : 'text-gray-400 hover:text-[#0c2340]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {c.likes > 0 ? c.likes : ''} {likedIds.includes(c.id) ? 'Liked' : 'Like'}
                  </button>
                </div>
              </div>
            ))}

            {/* Show more */}
            {comments.length > 3 && !showAll && (
              <div className="px-6 py-4 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-xs font-bold text-[#0c2340] hover:text-[#d4af37] flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                  Show {comments.length - 3} more comment{comments.length - 3 !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
