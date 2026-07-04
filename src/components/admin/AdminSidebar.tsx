'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Calendar, 
  Briefcase, 
  BookOpen, 
  Image,
  Video, 
  Award,
  Globe,
  Newspaper,
  LogOut,
  FolderOpen,
  ChevronsLeft,
  ChevronsRight,
  Link as LinkIcon,
} from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Homepage Content', href: '/admin/president', icon: Globe },
  { name: 'Quick Links', href: '/admin/quick-links', icon: LinkIcon },
  { name: 'Events', href: '/admin/congress', icon: Calendar },
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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
    router.push('/signin');
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (typeof window !== 'undefined') {
      if (!collapsed) {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
    }
  };

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-white border-r border-slate-200 text-slate-700 flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar transition-all duration-300 z-30`}> 
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .sidebar-collapsed + div { margin-left: 4rem !important; }
      `}</style>
      
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">GRASAG</span> Admin
          </h2>
        )}
        <button 
          onClick={toggleCollapse} 
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors focus:outline-none ml-auto"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          // Precise active state matching
          const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/admin');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : ''}
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}
