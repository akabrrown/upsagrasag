'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  const isAdminOrAuth = pathname?.startsWith('/admin') || pathname === '/signin' || pathname?.startsWith('/api/');

  if (isAdminOrAuth) return null;

  return <Footer />;
}

