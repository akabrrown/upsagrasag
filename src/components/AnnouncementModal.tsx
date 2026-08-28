'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the announcement
    const hasSeen = localStorage.getItem('grasag_calendar_announced_2026');
    if (!hasSeen) {
      // Small delay to let the page load before showing the popup
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('grasag_calendar_announced_2026', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Header Graphic */}
        <div className="bg-gradient-to-br from-[#003366] to-[#002244] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 z-10">
            <button 
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-1.5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8860B] rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2" />
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-4 shadow-xl relative z-10">
            <Calendar className="w-8 h-8 text-[#B8860B]" />
          </div>
          
          <h2 className="text-2xl font-black text-white relative z-10">
            Important Update
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            2026/2027 Academic Calendar
          </h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            The official GRASAG-UPSA academic calendar for the 2026/2027 year has been released. View important dates for registration, lectures, and exams.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link 
              href="/student-support/academic-calendar"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 bg-[#B8860B] hover:bg-[#9A7C1C] text-white py-3 px-4 rounded-xl font-bold transition-all shadow-md shadow-[#B8860B]/20 active:scale-[0.98]"
            >
              View Calendar <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={handleClose}
              className="w-full py-3 px-4 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
