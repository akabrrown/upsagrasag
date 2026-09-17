"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  // Generate breadcrumb parts
  const parts = pathname.split('/').filter(Boolean);
  const title = parts[parts.length - 1] || 'Dashboard';

  const breadcrumb = parts.map((part, idx) => {
    const href = '/' + parts.slice(0, idx + 1).join('/');
    const name = part.replace(/_/g, ' ');
    return (
      <React.Fragment key={href}>
        <Link href={href} className="text-sm text-gray-200 hover:underline">
          {name}
        </Link>
        {idx < parts.length - 1 && <span className="mx-1">/</span>}
      </React.Fragment>
    );
  });

  return (
    <header className="admin-header flex items-center justify-between px-6 py-3 bg-primary-blue text-white shadow-md sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold capitalize">{title}</h1>
        <nav className="flex items-center text-sm">{breadcrumb}</nav>
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-primary-blue">
          <User className="w-5 h-5" />
        </div>
        <Link href="/signin" className="logout-header flex items-center space-x-1 hover:opacity-80">
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
