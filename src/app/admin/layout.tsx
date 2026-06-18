import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  // Fetch role from admin_user table if session exists
  let userRole: string | null = null;
  if (session) {
    const { data: admin, error: adminErr } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    if (!adminErr && admin) {
      userRole = admin.role;
      console.log('Fetched user role:', userRole);
    }
  }

  if (error || !session) {
    redirect('/signin');
  }

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have administrative privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen admin-page">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
