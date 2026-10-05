import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

interface AdminTableSkeletonProps {
  columns: number;
  rows?: number;
}

export function AdminTableSkeleton({ columns, rows = 5 }: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-50/50">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="flex items-center gap-3">
                {colIndex === 0 && (
                  <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                )}
                <div className="space-y-2 flex-1 w-full max-w-[200px]">
                  <Skeleton className="h-4 w-3/4" />
                  {colIndex === 0 && <Skeleton className="h-3 w-1/2 opacity-70" />}
                </div>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
