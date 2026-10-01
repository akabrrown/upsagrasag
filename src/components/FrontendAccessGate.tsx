'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LaunchingSoonCover, { TARGET_LAUNCH_DATE } from './LaunchingSoonCover';

interface FrontendAccessGateProps {
  children: React.ReactNode;
}

export default function FrontendAccessGate({ children }: FrontendAccessGateProps) {
  const pathname = usePathname();
  
  // Check if we have passed the target launch date
  const [hasLaunched, setHasLaunched] = useState(() => Date.now() >= TARGET_LAUNCH_DATE);

  useEffect(() => {
    // If it hasn't launched yet, set a timer to automatically reveal the site when the countdown ends
    if (!hasLaunched) {
      const timeRemaining = TARGET_LAUNCH_DATE - Date.now();
      if (timeRemaining > 0) {
        const timer = setTimeout(() => {
          setHasLaunched(true);
        }, timeRemaining);
        return () => clearTimeout(timer);
      } else {
        setHasLaunched(true);
      }
    }
  }, [hasLaunched]);

  // Allow unrestricted access to Admin Dashboard, Admin APIs, and Sign-in authentication
  const isAdminOrAuth = 
    pathname.startsWith('/admin') || 
    pathname === '/signin' || 
    pathname.startsWith('/api/');

  // Bypass the gate in local development
  const isLocalhost = process.env.NODE_ENV === 'development';

  if (isAdminOrAuth || isLocalhost || hasLaunched) {
    return <>{children}</>;
  }

  // Cover all public frontend routes with the Launching Soon portal
  return <LaunchingSoonCover />;
}
