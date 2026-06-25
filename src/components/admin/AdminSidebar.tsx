'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
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
  { name: 'Congress Events', href: '/admin/congress', icon: Calendar },
  { name: 'Academic Calendar', href: '/admin/academic-calendar', icon: Calendar },
  { name: 'Partners', href: '/admin/partners', icon: Users },
  { name: 'Leadership & Patrons', href: '/admin/leadership', icon: Award },

  { name: 'Opportunities', href: '/admin/opportunities', icon: Briefcase },
  { name: 'Resources', href: '/admin/resources', icon: FolderOpen },
  { name: 'Past Questions', href: '/admin/past_questions', icon: BookOpen },
  { name: 'Tutorials', href: '/admin/tutorials', icon: Video },
  { name: 'Events & Programmes', href: '/admin/events_programmes', icon: Calendar },
  { name: 'Research & Grants', href: '/admin/research_opportunities', icon: Award },
  { name: 'News & Updates', href: '/admin/news_updates', icon: Newspaper },
  { name: 'Admin Users', href: '/admin/users', icon: Users },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();
  // Add admin-page class for global styling (hide footer)
  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  // Collapse state for sidebar
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
    <div className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 overflow-y-auto custom-scrollbar transition-all duration-300 z-10`}> 
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .sidebar-collapsed + div { margin-left: 4rem; }
        .admin-page:has(.sidebar-collapsed) > div:last-child { margin-left: 4rem; }
      `}</style>
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-blue-500">GRASAG</span> Admin
          </h2>
        )}
        <button onClick={toggleCollapse} className="text-gray-300 hover:text-white focus:outline-none">
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 pb-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : ''}
              className={`flex items-center ${collapsed ? 'justify-center gap-0' : 'gap-3'} px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-200'}`} />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-slate-300 hover:bg-red-500 hover:text-white"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}
