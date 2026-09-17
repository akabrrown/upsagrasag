'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';


export default function LaunchingSoonCover() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setStatusMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setStatusMsg('');

    try {
      const res = await fetch('/api/launch-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setStatusMsg(data.message || 'Thank you for subscribing! You will receive launch updates directly in your inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Unable to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network connection error. Please try again.');
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-x-hidden font-sans text-white select-none">
      
      {/* Fullscreen Video Background with Cinematic Overlay */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/IMG_5241.jpg"
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        >
          <source src="/anticipate.mp4" type="video/mp4" />
        </video>
        {/* Layered dark vignette and readability overlay */}
        <div className="absolute inset-0 bg-black/55 md:bg-black/50 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/80" />
      </div>

      {/* Top Header / Brand Crest */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-11 sm:h-14 w-auto flex items-center">
            <Image 
              src="/GRASAG-LOGO-white-text.png" 
              alt="GRASAG-UPSA Official Logo" 
              width={260} 
              height={70} 
              className="object-contain h-full w-auto drop-shadow-md"
              priority
            />
          </div>
        </div>
      </header>

      {/* Main Center Content: Split Design */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-12 sm:py-20 my-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Big Bold Typography */}
          <div className="md:col-span-6 flex flex-col justify-center text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] uppercase drop-shadow-lg">
              WE ARE<br />
              COMING<br />
              SOON!
            </h1>
          </div>

          {/* Center Divider: Thin Clean Line (Hidden on small screens) */}
          <div className="hidden md:flex md:col-span-1 justify-center items-center h-full min-h-[300px]">
            <div className="w-[2px] h-4/5 bg-white/40 rounded-full" />
          </div>

          {/* Right Column: Description, Subscribe Form, and Social Icons */}
          <div className="md:col-span-5 flex flex-col justify-center text-left space-y-6">
            
            {/* Description Paragraph */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal drop-shadow">
              The official digital portal for graduate students of the University of Professional Studies, Accra is undergoing final deployment. Access timetables, research archives, academic support, and student welfare in one unified space.
            </p>

            {/* Subscribe Heading */}
            <div className="space-y-3">
              <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide">
                Subscribe and get updates
              </h2>

              {/* Subscribe Form */}
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex w-full items-stretch shadow-xl">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="flex-1 bg-black/40 border border-white/40 border-r-0 px-4 py-3.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-black/60 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3.5 bg-[#3b5998] hover:bg-[#2d4373] text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-colors shrink-0 flex items-center justify-center border border-[#3b5998] disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Sending...' : 'SUBSCRIBE'}
                  </button>
                </div>

                {statusMsg && (
                  <div className={`p-2.5 text-xs font-semibold flex items-center gap-2 rounded ${
                    status === 'success' 
                      ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/40' 
                      : 'bg-red-950/80 text-red-200 border border-red-500/40'
                  }`}>
                    {status === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{statusMsg}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Square Outlined Social Buttons & Contact Link */}
            <div className="pt-2 flex items-center gap-3">
              <a 
                href="https://www.facebook.com/share/1JHWgU7ich/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-10 h-10 border border-white/60 hover:border-white hover:bg-white/10 rounded flex items-center justify-center text-white transition-all text-sm font-bold"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/grasag_upsa?s=21" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                title="X (Twitter)"
                className="w-10 h-10 border border-white/60 hover:border-white hover:bg-white/10 rounded flex items-center justify-center text-white transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/grasag_upsa?igsh=bWxtenV6NHY1djY0" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-10 h-10 border border-white/60 hover:border-white hover:bg-white/10 rounded flex items-center justify-center text-white transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="mailto:grasagpresident@upsamail.edu.gh" 
                aria-label="Email GRASAG President"
                title="grasagpresident@upsamail.edu.gh"
                className="w-10 h-10 border border-white/60 hover:border-white hover:bg-white/10 rounded flex items-center justify-center text-white transition-all"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>

          </div>

        </div>
      </main>

      {/* Footer / Copyright */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pb-6 text-xs text-gray-300/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} GRASAG-UPSA. Graduate Students' Association of Ghana, University of Professional Studies, Accra.
        </div>
        <div className="text-[11px] text-gray-400">
          School of Graduate Studies Complex • P.O. Box LG 149, Accra
        </div>
      </footer>

    </div>
  );
}
