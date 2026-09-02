'use client';

import * as React from 'react';
import { Bell, Search, User, Settings, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header
      className={cn(
        'h-20 bg-white border-b border-gray-100 flex items-center justify-end px-8 sticky top-0 z-20 shadow-sm shadow-black/[0.01]'
      )}
    >
      <div className="flex items-center gap-6">
        
        {/* Global Search Placeholder (can be moved to page level if preferred, but good to have globally) */}
        <div className="hidden md:flex items-center gap-2 relative">
           <Search className="w-4 h-4 text-gray-400 absolute left-3" />
           <Input
             placeholder="Search everywhere..."
             className="pl-9 bg-gray-50/50 border-gray-200 text-gray-600 focus-visible:ring-[#004080] w-64 rounded-full h-10 text-sm shadow-inner"
           />
        </div>

        <div className="h-6 w-px bg-gray-200 hidden md:block" />

        {/* Action icons */}
        <div className="flex items-center gap-3">
          <button className="relative text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-2 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          
          <button className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-gray-100">
            <div className="w-9 h-9 rounded-full bg-[#004080] text-white flex items-center justify-center shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-900 leading-tight">Admin User</p>
              <p className="text-xs font-medium text-gray-500 leading-tight">Administrator</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
