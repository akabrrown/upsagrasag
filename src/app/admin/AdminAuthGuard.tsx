'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/signin');
          return;
        }

        // Check if user is in admin_users and if they need to change password
        const { data: adminRecord, error } = await supabase
          .from('admin_users')
          .select('must_change_password')
          .eq('auth_uid', session.user.id)
          .single();

        if (error || !adminRecord) {
          // No admin record found, meaning they aren't authorized for the dashboard
          console.error('Admin Auth Check Error:', error);
          router.push('/signin');
          return;
        }

        // If they need to change their password and they are NOT on the change-password page
        if (adminRecord.must_change_password && pathname !== '/admin/change-password') {
          router.push('/admin/change-password');
          return;
        }

        // If they don't need to change password but are ON the change-password page, redirect them away
        if (!adminRecord.must_change_password && pathname === '/admin/change-password') {
          router.push('/admin');
          return;
        }

        setAuthenticated(true);
      } catch (e) {
        console.error('Unexpected auth error', e);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes (e.g. logout in another tab)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/signin');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [pathname, router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#004080] animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
