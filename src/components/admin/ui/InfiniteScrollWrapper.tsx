"use client";
import { useEffect, useRef } from 'react';

type InfiniteScrollWrapperProps = {
  loadMore?: () => void;
  hasMore?: boolean;
  children: React.ReactNode;
};

export default function InfiniteScrollWrapper({ loadMore = () => {}, hasMore = false, children }: InfiniteScrollWrapperProps) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [loadMore, hasMore]);

  return (
    <div className="relative">
      {children}
      {hasMore && <div ref={sentinelRef} className="h-12" />}
    </div>
  );
}
