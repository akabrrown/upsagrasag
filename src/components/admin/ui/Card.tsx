import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Simple card container with UPSA‑styled background and border.
 */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-neutral-200 p-6 transition-transform transform hover:shadow-lg hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
