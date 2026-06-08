import Link from 'next/link';
import { Home, Users, Calendar, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 border-r border-neutral-200 bg-slate-50 p-6">
        <nav className="flex flex-col space-y-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors">
            <Home className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors">
            <Users className="h-5 w-5" /> Users
          </Link>
          <Link href="/admin/events" className="flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors">
            <Calendar className="h-5 w-5" /> Events
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-white">
        {children}
      </main>
    </div>
  );
}
