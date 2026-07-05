'use client';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/signin')) return null;
  return <Footer />;
}
