// app/admin/layout.tsx
import React from 'react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side auth check using Supabase
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect('/signin');
  }
  const role = (user as any).app_metadata?.role;
  if (role && role !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
