'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  Calendar, 
  Briefcase, 
  Globe,
  Newspaper,
  BookOpen
} from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'President & Homepage', href: '/admin/president', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'News & Updates', href: '/admin/news_updates', icon: Newspaper, color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'Events & Programmes', href: '/admin/events_programmes', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Opportunities', href: '/admin/opportunities', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-50' },
    { name: 'Past Questions', href: '/admin/past_questions', icon: BookOpen, color: 'text-rose-500', bg: 'bg-rose-50' },
    { name: 'Executive Council', href: '/admin/executives', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, Admin!</h1>
        <p className="text-slate-500 mt-1">Manage the GRASAG-UPSA platform content and settings from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name} 
              href={stat.href}
              className="group bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all flex items-center gap-4"
            >
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {stat.name}
                </h3>
                <p className="text-sm text-slate-500 mt-0.5">Manage records &rarr;</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">Need to adjust global settings?</h2>
        <p className="text-blue-100 max-w-2xl mb-6">
          You can toggle Maintenance Mode to temporarily hide the website from the public during updates, or change your administrator password.
        </p>
        <Link 
          href="/admin/settings"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Go to Site Settings
        </Link>
      </div>
    </div>
  );
}
