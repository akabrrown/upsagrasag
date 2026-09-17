'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import LaunchingSoonCover from './LaunchingSoonCover';

interface FrontendAccessGateProps {
  children: React.ReactNode;
}

export default function FrontendAccessGate({ children }: FrontendAccessGateProps) {
  const pathname = usePathname();

  // Allow unrestricted access to Admin Dashboard, Admin APIs, and Sign-in authentication
  const isAdminOrAuth = 
    pathname.startsWith('/admin') || 
    pathname === '/signin' || 
    pathname.startsWith('/api/');

  if (isAdminOrAuth) {
    return <>{children}</>;
  }

  // Cover all public frontend routes with the Launching Soon portal
  return <LaunchingSoonCover />;
}
