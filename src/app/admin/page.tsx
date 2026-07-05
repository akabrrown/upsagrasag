'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, FileText, Calendar, Briefcase, Globe, Newspaper, BookOpen, 
  TrendingUp, Activity, Bell, Settings, ChevronRight, Sparkles 
} from 'lucide-react';

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    setCurrentDate(new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    }).format(new Date()));
  }, []);

  const stats = [
    { label: 'Total Members', value: '2,450', trend: '+12%', icon: Users, color: 'from-[#004080] to-[#0050a0]' },
    { label: 'Active Events', value: '8', trend: '+2', icon: Calendar, color: 'from-[#FFB800] to-[#FFC833]' },
    { label: 'Pending Articles', value: '14', trend: '-3', icon: Newspaper, color: 'from-[#B8860B] to-[#D4AF37]' },
    { label: 'Total Visits (Month)', value: '18.2k', trend: '+24%', icon: Activity, color: 'from-[#10b981] to-[#34d399]' },
  ];

  const quickActions = [
    { name: 'President & Homepage', href: '/admin/president', icon: Globe, desc: 'Update hero banner & message' },
    { name: 'News & Updates', href: '/admin/news_updates', icon: Newspaper, desc: 'Manage blog and news articles' },
    { name: 'Events & Programmes', href: '/admin/events_programmes', icon: Calendar, desc: 'Schedule and track events' },
    { name: 'Opportunities', href: '/admin/opportunities', icon: Briefcase, desc: 'Post jobs and internships' },
    { name: 'Past Questions', href: '/admin/past_questions', icon: BookOpen, desc: 'Manage academic resources' },
  ];

  const recentActivity = [
    { user: 'Admin', action: 'published a new article', target: '"Spring Fest 2026 Announced"', time: '2 hours ago' },
    { user: 'System', action: 'automated backup completed', target: 'Database', time: '5 hours ago' },
    { user: 'Admin', action: 'updated event details', target: '"Career Fair"', time: '1 day ago' },
    { user: 'Admin', action: 'uploaded new resource', target: '"Macroeconomics Past Qs"', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004080] via-[#003060] to-[#001f40] rounded-[2rem] p-8 sm:p-12 text-white shadow-2xl shadow-[#004080]/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Globe className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-[#FFB800]" />
              <span>{currentDate}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
              {greeting}, Admin.
            </h1>
            <p className="text-white/80 text-lg max-w-xl font-medium leading-relaxed">
              Here is what's happening with the GRASAG-UPSA platform today. You have 14 pending tasks to review.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/settings" className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-colors border border-white/10">
              <Settings className="w-5 h-5" />
            </Link>
            <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-colors border border-white/10 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-inner`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <h3 className="text-gray-500 font-semibold text-sm mb-1">{stat.label}</h3>
                <p className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-[#004080] transition-colors">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Actions / Modules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Core Modules</h2>
            <Link href="/admin/settings" className="text-sm font-semibold text-[#004080] hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={i} href={action.href} className="group relative bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#004080]/30 transition-all duration-300 overflow-hidden flex items-start gap-4">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#004080] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#004080]/5 transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-[#004080] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#004080] transition-colors">{action.name}</h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="space-y-6">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex gap-4 relative">
                  {i !== recentActivity.length - 1 && (
                    <div className="absolute top-8 left-[11px] bottom-[-24px] w-px bg-gray-100"></div>
                  )}
                  <div className="w-6 h-6 rounded-full bg-[#004080]/10 border-2 border-white flex-shrink-0 z-10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#004080]"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-semibold text-[#004080]">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-400 font-semibold mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors">
              View Full Log
            </button>
          </div>
          {/* Announcements Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Announcements</h2>
            <p className="text-gray-600 mt-2">No new announcements.</p>
          </div>
          {/* System Health Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">System Health</h2>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Database: Operational</li>
              <li className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>API: Operational</li>
              <li className="flex items-center"><span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>Background Jobs: Running</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
