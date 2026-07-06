import { Image, ListChecks, Users, BarChart2, Settings } from 'lucide-react';
import QuickActionCard from '@/components/admin/ui/QuickActionCard';
import ActivityItem from '@/components/admin/ui/ActivityItem';
import InfiniteScrollWrapper from '@/components/admin/ui/InfiniteScrollWrapper';

// Sample data for quick action cards
const quickActions = [
  { name: 'Gallery', href: '/admin/gallery', icon: 'Image', desc: 'Manage images and media' },
  { name: 'Opportunities', href: '/admin/opportunities', icon: 'ListChecks', desc: 'Create and edit opportunities' },
  { name: 'Leadership', href: '/admin/leadership', icon: 'Users', desc: 'Team members and roles' },
  { name: 'News Updates', href: '/admin/news_updates', icon: 'BarChart2', desc: 'Publish news and announcements' },
  { name: 'Partners', href: '/admin/partners', icon: 'Settings', desc: 'Partners and collaborations' },
] as const;

// Mock activity data (replace with real API in production)
const mockActivities = [
  { user: 'Admin', action: 'uploaded', target: 'new gallery image', time: '2 mins ago' },
  { user: 'Editor', action: 'published', target: 'news article', time: '1 hour ago' },
  { user: 'Admin', action: 'updated', target: 'partner info', time: 'Yesterday' },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-layout">
      <main className="admin-main">
        {/* Hero Section */}
        <section className="admin-hero">
          <h1>Welcome to the UPSA Admin Dashboard</h1>
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

        {/* Recent Activity Feed */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <InfiniteScrollWrapper>
            {mockActivities.map((act, idx) => (
              <ActivityItem key={idx} activity={act} isLast={idx === mockActivities.length - 1} />
            ))}
          </InfiniteScrollWrapper>
        </section>
      </main>
    </div>
  );
}
