"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  const isAdminOrAuth = pathname?.startsWith('/admin') || pathname === '/signin' || pathname?.startsWith('/api/');
  const isLocalhost = process.env.NODE_ENV === 'development';

  if (isAdminOrAuth) return null;
  
  // While public frontend is covered with the Launching Soon gateway, hide standard navbar in production
  if (!isLocalhost) return null;

  return <Navbar />;
}

