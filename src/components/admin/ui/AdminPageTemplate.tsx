'use client';

import * as React from 'react';
import Header from '@/components/admin/ui/Header';
import Sidebar from '@/components/admin/ui/Sidebar';

export default function AdminPageTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  
  return (
    <div className="flex bg-[#F8FAFC] h-screen font-sans text-slate-900 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col h-screen transition-all duration-300 relative overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
