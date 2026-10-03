import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* Header skeleton */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-100">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {Array.from({ length: 4 }).map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-gray-50/50">
                  {Array.from({ length: 4 }).map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <Skeleton className={`h-4 ${colIdx === 0 ? 'w-3/4' : 'w-1/2'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
