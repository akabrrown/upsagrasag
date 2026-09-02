import './admin.css';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { AdminDataProvider } from './AdminDataContext';
import AdminAuthGuard from './AdminAuthGuard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminDataProvider>
        <div className="admin-layout">
          <Sidebar />
          <div className="admin-content">
            <main className="admin-main">{children}</main>
          </div>
        </div>
      </AdminDataProvider>
    </AdminAuthGuard>
  );
}

