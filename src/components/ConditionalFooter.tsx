'use client';

import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import { TARGET_LAUNCH_DATE } from "@/components/LaunchingSoonCover";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const [hasLaunched, setHasLaunched] = useState(() => Date.now() >= TARGET_LAUNCH_DATE);
  
  useEffect(() => {
    if (!hasLaunched) {
      const timeRemaining = TARGET_LAUNCH_DATE - Date.now();
      if (timeRemaining > 0) {
        const timer = setTimeout(() => setHasLaunched(true), timeRemaining);
        return () => clearTimeout(timer);
      } else {
        setHasLaunched(true);
      }
    }
  }, [hasLaunched]);

  const isAdminOrAuth = pathname?.startsWith('/admin') || pathname === '/signin' || pathname?.startsWith('/api/');
  const isLocalhost = process.env.NODE_ENV === 'development';

  if (isAdminOrAuth) return null;
  
  // Hide standard footer if not launched and not in local dev
  if (!isLocalhost && !hasLaunched) return null;

  return <Footer />;
}

