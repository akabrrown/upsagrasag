"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  const isAdminOrAuth = pathname?.startsWith('/admin') || pathname === '/signin' || pathname?.startsWith('/api/');

  if (isAdminOrAuth) return null;

  return <Navbar />;
}

