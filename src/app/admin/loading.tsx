import React from 'react';
import Spinner from '@/components/ui/spinner';

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 w-full">
      <Spinner />
      <p className="text-sm font-semibold text-neutral-500 animate-pulse">Loading dashboard...</p>
    </div>
  );
}
