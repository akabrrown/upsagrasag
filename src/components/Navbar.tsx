'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, GraduationCap, Briefcase, Calendar, FileText, Heart, Info, Users, PhoneCall, Bot } from 'lucide-react';
// import Image from 'next/image'; // Removed; using standard img tag for logo



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    {
      name: 'About',
      href: '#',
      dropdown: [
        { name: 'Overview & Mission', href: '/about', icon: Info },
        { name: 'Leadership & Executives', href: '/leadership', icon: Users },
        { name: 'Membership Benefits', href: '/membership', icon: Heart },
      ]
    },
    {
      name: 'Academics',
      href: '#',
      dropdown: [
        { name: 'Academics', href: '/academics', icon: GraduationCap },
        { name: 'Past Questions', href: '/past-questions', icon: FileText },
      ]
    },
    {
      name: 'Campus Hub',
      href: '#',
      dropdown: [
        { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
        { name: 'Welfare', href: '/welfare', icon: Heart },
        { name: 'Resources', href: '/resources', icon: FileText },
      ]
    },
    { name: 'Events & Congress', href: '/events', icon: Calendar },
    { name: 'Contact', href: '/contact', icon: PhoneCall },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 overflow-hidden rounded-full bg-background">
            <img
              src="/grasag-logo.jpeg"
              alt="GRASAG UPSA Logo"
              className="object-contain"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div>
            <h1 className="font-sans text-lg font-bold text-primary leading-tight">GRASAG-UPSA</h1>
            <p className="text-xs font-semibold text-accent tracking-wide uppercase">The Nation's Premium</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all duration-200"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute right-0 mt-1.5 w-64 origin-top-right rounded-xl border border-border bg-background p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                    {item.dropdown.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors duration-150"
                        >
                          <Icon className="h-4 w-4 text-accent" />
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-primary transition-all duration-200"
              >
                {item.name}
              </Link>
            );
          })}

          <Link
            href="/chat"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:scale-105 hover:bg-accent/90 transition-all duration-200 ml-4"
          >
            <Bot className="h-6 w-6" />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2.5 text-neutral-600 hover:bg-neutral-50 focus:outline-none lg:hidden"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>

    {/* Mobile Menu */}
    {isOpen && (
      <div className="fixed top-20 inset-x-0 bottom-0 z-50 bg-background border-t border-border p-4 shadow-lg lg:hidden overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
                  >
                    {item.name}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === item.name && (
                    <div className="pl-6 space-y-1">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-primary transition-colors duration-150"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/chat"
            onClick={() => setIsOpen(false)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-white"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Link>
        </div>
      </div>
    )}
  </>
);
}
