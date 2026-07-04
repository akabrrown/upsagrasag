import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminDataProvider } from '@/app/admin/AdminDataContext';
import { Bell, Search, UserCircle } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminDataProvider>
      <div className="flex bg-[#F8FAFC] min-h-screen admin-page font-sans text-slate-900">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ml-64">
          {/* Top Header Bar */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center text-slate-500">
              <Search className="w-5 h-5 mr-3" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:outline-none text-sm text-slate-700 w-64 placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-5">
              <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200"></div>
              <button className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full pr-4 transition-colors">
                <UserCircle className="w-8 h-8 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">Admin</span>
              </button>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
