import './admin.css';
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { AdminDataProvider } from './AdminDataContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminDataProvider>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </AdminDataProvider>
  );
}

