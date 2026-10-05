import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full animate-in fade-in duration-500">
      <div className="relative h-48 w-full bg-gray-100 flex-shrink-0">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-20 h-5 rounded-full" />
        </div>
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-4" />
        
        <div className="space-y-3 mb-6 mt-auto">
          <div className="flex items-start gap-3">
            <Skeleton className="w-4 h-4 rounded-full mt-0.5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-1/2 h-4" />
              <Skeleton className="w-1/3 h-3 opacity-70" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Skeleton className="w-4 h-4 rounded-full mt-0.5" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        </div>
        
        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full animate-in fade-in duration-500">
      <div className="relative h-56 bg-gray-100">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute top-4 left-4">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs mb-3">
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-4/5 h-6 mb-4" />
        <div className="space-y-2 mt-auto pt-4">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="animate-in fade-in duration-500 w-full max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Skeleton className="w-32 h-8 rounded-full" />
          <div className="space-y-4">
            <Skeleton className="w-full h-12 md:h-16" />
            <Skeleton className="w-5/6 h-12 md:h-16" />
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full h-5" />
            <Skeleton className="w-11/12 h-5" />
            <Skeleton className="w-4/5 h-5" />
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Skeleton className="w-40 h-12 rounded-lg" />
            <Skeleton className="w-40 h-12 rounded-lg" />
          </div>
        </div>
        <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
