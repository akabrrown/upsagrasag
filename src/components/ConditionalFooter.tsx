'use client';
import { usePathname } from 'next/navigation';

export default function ConditionalFooter() {
  const pathname = usePathname();
  // While public frontend is covered with the Launching Soon gateway, hide standard footer
  if (!pathname?.startsWith('/admin')) return null;
  return null;
}

