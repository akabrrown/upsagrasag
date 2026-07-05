'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, ChevronRight, Home, Users, Settings, Globe, Calendar, Award, 
  Briefcase, FolderOpen, BookOpen, Video, Newspaper, Image, Link as LinkIcon, LogOut, Bell
} from 'lucide-react';

export default function Sidebar({
  isOpen = true,
  onToggle,
}: {
  isOpen?: boolean;
  onToggle?: () => void;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Homepage Content', href: '/admin/president', icon: Globe },
    { name: 'Quick Links', href: '/admin/quick-links', icon: LinkIcon },
    { name: 'Events', href: '/admin/events_programmes', icon: Calendar }, // Assuming /admin/events_programmes matches the sample better
    { name: 'Academic Calendar', href: '/admin/academic-calendar', icon: Calendar },
    { name: 'Partners', href: '/admin/partners', icon: Users },
    { name: 'Leadership & Patrons', href: '/admin/leadership', icon: Award },
    { name: 'Opportunities', href: '/admin/opportunities', icon: Briefcase },
    { name: 'Resources', href: '/admin/resources', icon: FolderOpen },
    { name: 'Past Questions', href: '/admin/past_questions', icon: BookOpen },
    { name: 'Tutorials', href: '/admin/tutorials', icon: Video },
    { name: 'Research & Grants', href: '/admin/research_opportunities', icon: Award },
    { name: 'News & Updates', href: '/admin/news_updates', icon: Newspaper },
    { name: 'Admin Users', href: '/admin/users', icon: Users },
    { name: 'Gallery', href: '/admin/gallery', icon: Image },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'bg-[#0f172a] text-slate-300 h-full flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800',
        isOpen ? 'w-[260px]' : 'w-[72px]',
      )}
    >
      <div className="flex items-center justify-between p-5 mb-2">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              {/* Placeholder for Logo */}
              <div className="w-5 h-5 border-2 border-white rounded-sm transform rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-sm font-bold text-white tracking-wider">GRASAG UPSA</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-slate-400 hover:text-white hover:bg-white/10 ml-auto h-8 w-8"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block">
              <div
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  isActive 
                    ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {isOpen && <span className="font-medium text-sm">{item.name}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button className={cn(
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors",
          !isOpen && "justify-center px-0"
        )}>
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isOpen && <span className="font-medium text-sm">Log out</span>}
        </button>
      </div>
    </aside>
  );
}
