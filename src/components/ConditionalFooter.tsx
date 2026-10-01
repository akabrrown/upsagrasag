'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  const isAdminOrAuth = pathname?.startsWith('/admin') || pathname === '/signin' || pathname?.startsWith('/api/');
  const isLocalhost = process.env.NODE_ENV === 'development';

  if (isAdminOrAuth) return null;
  
  // While public frontend is covered with the Launching Soon gateway, hide standard footer in production
  if (!isLocalhost) return null;

  return <Footer />;
}

