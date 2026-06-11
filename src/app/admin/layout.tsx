// app/admin/layout.tsx
import React from 'react';
import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server‑side auth check using Supabase
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/auth/login');
  }
  const role = (user as any).app_metadata?.role;
  if (role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar navigation – hidden on small screens */}
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <nav className="space-y-2">
          <a href="/admin/executives" className="block py-2 px-3 rounded hover:bg-gray-100">Executives</a>
          <a href="/admin/opportunities" className="block py-2 px-3 rounded hover:bg-gray-100">Opportunities</a>
          <a href="/admin/past-questions" className="block py-2 px-3 rounded hover:bg-gray-100">Past Questions</a>
          <a href="/admin/resources" className="block py-2 px-3 rounded hover:bg-gray-100">Resources</a>
          <a href="/admin/partners" className="block py-2 px-3 rounded hover:bg-gray-100">Partners</a>
          <a href="/admin/chatbot-logs" className="block py-2 px-3 rounded hover:bg-gray-100">Chatbot Logs</a>
          <a href="/admin/site-settings" className="block py-2 px-3 rounded hover:bg-gray-100">Site Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
