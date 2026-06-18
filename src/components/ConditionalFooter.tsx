'use client';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return <Footer />;
}
