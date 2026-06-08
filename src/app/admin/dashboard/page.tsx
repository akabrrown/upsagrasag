import Link from 'next/link';
import { Users, Calendar, Settings } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-primary">Admin Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Welcome to the GRASAG‑UPSA admin panel. Use the navigation on the left to manage content.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/users"
          className="flex items-center gap-3 p-5 rounded-xl border border-neutral-200 bg-slate-50 hover:bg-slate-100 hover:border-accent/30 hover:scale-[1.01] transition-all duration-200 text-primary font-bold text-sm"
        >
          <Users className="h-5 w-5 text-accent" />
          Manage Users
        </Link>
        <Link
          href="/admin/events"
          className="flex items-center gap-3 p-5 rounded-xl border border-neutral-200 bg-slate-50 hover:bg-slate-100 hover:border-accent/30 hover:scale-[1.01] transition-all duration-200 text-primary font-bold text-sm"
        >
          <Calendar className="h-5 w-5 text-accent" />
          Manage Events
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 p-5 rounded-xl border border-neutral-200 bg-slate-50 hover:bg-slate-100 hover:border-accent/30 hover:scale-[1.01] transition-all duration-200 text-primary font-bold text-sm"
        >
          <Settings className="h-5 w-5 text-accent" />
          Settings
        </Link>
      </div>
    </div>
  );
}
