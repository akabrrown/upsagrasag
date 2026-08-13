"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import React from "react";

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={className}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex touch-none select-none p-0.5 bg-gray-200 transition-colors duration-200 ease-out hover:bg-gray-300">
        <ScrollAreaPrimitive.Thumb className="flex-1 bg-gray-500 rounded-md" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}

export default ScrollArea;
