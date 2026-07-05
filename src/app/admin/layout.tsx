import React from 'react';
import Head from 'next/head';
import AdminPageTemplate from '@/components/admin/ui/AdminPageTemplate';
import { AdminDataProvider } from '@/app/admin/AdminDataContext';
import '@/app/admin/globals.css';
import ThemeProvider from '@/app/admin/ThemeProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Giga+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <AdminDataProvider>
        <AdminPageTemplate>{children}</AdminPageTemplate>
      </AdminDataProvider>
    </ThemeProvider>
  );
}
