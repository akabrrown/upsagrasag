'use client';

import { useEffect, useState } from 'react';
import { Image, ListChecks, Users, BarChart2, Settings, Activity } from 'lucide-react';
import QuickActionCard from '@/components/admin/ui/QuickActionCard';
import ActivityItem from '@/components/admin/ui/ActivityItem';
import { createClient } from '@/lib/supabase';

const quickActions = [
  { name: 'Gallery', href: '/admin/gallery', icon: 'Image', desc: 'Manage images and media' },
  { name: 'Opportunities', href: '/admin/opportunities', icon: 'ListChecks', desc: 'Create and edit opportunities' },
  { name: 'Leadership', href: '/admin/leadership', icon: 'Users', desc: 'Team members and roles' },
  { name: 'News Updates', href: '/admin/news_updates', icon: 'BarChart2', desc: 'Publish news and announcements' },
  { name: 'Partners', href: '/admin/partners', icon: 'Settings', desc: 'Partners and collaborations' },
] as const;

// Tables to monitor for activity
const MONITORED_TABLES = [
  'gallery', 'opportunities', 'news_updates', 'partners', 'leadership',
  'events_programmes', 'resources', 'tutorials', 'page_contents',
  'academic_calendar', 'past_questions', 'homepage_president', 'admin_users'
];

type ActivityEntry = {
  user: string;
  action: string;
  target: string;
  time: string;
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function eventToAction(eventType: string): string {
  switch (eventType) {
    case 'INSERT': return 'created';
    case 'UPDATE': return 'updated';
    case 'DELETE': return 'deleted';
    default: return 'modified';
  }
}

function tableToLabel(table: string): string {
  return table.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function AdminDashboardPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();

    // Get current user email for display
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email.split('@')[0]);
    });

    // Subscribe to real-time changes across all monitored tables
    const channel = supabase
      .channel('dashboard-activity-feed')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        const table = payload.table;
        if (!MONITORED_TABLES.includes(table)) return;

        const record = (payload.new || payload.old) as any;
        const itemName = record?.name || record?.title || record?.email || table;

        const entry: ActivityEntry = {
          user: 'System',
          action: eventToAction(payload.eventType),
          target: `${itemName} (${tableToLabel(table)})`,
          time: formatTimeAgo(new Date()),
        };

        setActivities(prev => [entry, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Re-render times every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => [...prev]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-layout">
      <main className="admin-main">
        {/* Hero Section */}
        <section className="admin-hero">
          <h1>Welcome{userEmail ? `, ${userEmail}` : ''}</h1>
          <p>Manage site content, partners, news, and more.</p>
        </section>

        {/* Quick Action Cards */}
        <section className="quick-action-grid">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.href}
              name={action.name}
              href={action.href}
              icon={action.icon}
              desc={action.desc}
            />
          ))}
        </section>

        {/* Real-time Activity Feed */}
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#004080]" />
            <h2 className="text-xl font-bold">Live Activity</h2>
            <span className="relative flex h-2.5 w-2.5 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-gray-400 text-sm font-medium">
                No activity yet. Changes made across the system will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              {activities.map((act, idx) => (
                <ActivityItem key={`${idx}-${act.time}`} activity={act} isLast={idx === activities.length - 1} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
