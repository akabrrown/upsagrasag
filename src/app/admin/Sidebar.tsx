"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  Home,
  Image,
  ListChecks,
  Users,
  Settings,
  BarChart2,
  Calendar,
  Landmark,
  BookOpen,
  CalendarCheck,
  FileText,
  UserCircle,
  Link as LinkIcon,
  Search,
  Folder,
  Book,
  UserRound,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Hexagon // Using Hexagon as a placeholder brand icon
} from 'lucide-react';

// Navigation groups definition
const navGroups = [
  {
    label: 'Overview',
    links: [{ name: 'Dashboard', href: '/admin', icon: Home }],
  },
  {
    label: 'Content',
    links: [
      { name: 'Gallery', href: '/admin/gallery', icon: Image },
      { name: 'Opportunities', href: '/admin/opportunities', icon: ListChecks },
      { name: 'News Updates', href: '/admin/news_updates', icon: BarChart2 },
      { name: 'Partners', href: '/admin/partners', icon: Settings },
      { name: 'Resources', href: '/admin/resources', icon: Folder },
      { name: 'Tutorials', href: '/admin/tutorials', icon: Book },
      { name: 'Quick Links', href: '/admin/quick-links', icon: LinkIcon },
    ],
  },
  {
    label: 'Academics',
    links: [
      { name: 'Academic Calendar', href: '/admin/academic-calendar', icon: Calendar },
      { name: 'Congress', href: '/admin/congress', icon: Landmark },
      { name: 'Events & Programmes', href: '/admin/events_programmes', icon: CalendarCheck },
      { name: 'Leadership', href: '/admin/leadership', icon: Users },
      { name: 'Past Questions', href: '/admin/past_questions', icon: FileText },
      { name: 'President', href: '/admin/president', icon: UserCircle },
      { name: 'Research Opportunities', href: '/admin/research_opportunities', icon: Search },
    ],
  },
  {
    label: 'Administration',
    links: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
      { name: 'Users', href: '/admin/users', icon: UserRound },
    ],
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/signin');
  };

  return (
    <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Collapse / Expand Button */}
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand Header */}
      <div className="sidebar-header">
        <Hexagon className="w-6 h-6" />
        <span>UPSA Admin</span>
      </div>

      {/* Quick Search */}
      <div className="sidebar-search">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Quick search" />
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-nav">
        {navGroups.map((group, idx) => (
          <div key={idx} className="nav-section">
            <div className="nav-section-title">{group.label}</div>
            {group.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={isActive ? 'active' : ''} title={collapsed ? link.name : undefined}>
                  <div className="link-left">
                    <link.icon className={`w-4 h-4 ${isActive ? 'text-[#4f46e5]' : ''}`} />
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / User Profile */}
      <div className="sidebar-footer" onClick={handleLogout} title="Click to Sign Out">
        <div className="sidebar-footer-avatar">
          <UserRound className="w-5 h-5 text-gray-500" />
        </div>
        <div className="sidebar-footer-details">
          <div className="sidebar-footer-name">Admin User</div>
          <div className="sidebar-footer-role">Sign Out</div>
        </div>
        <LogOut className="w-4 h-4 text-gray-400 ml-auto" />
      </div>
    </nav>
  );
}
