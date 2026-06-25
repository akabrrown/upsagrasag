'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Calendar,
  FileText,
  Heart,
  Info,
  Users,
  Bot,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Image as LucideImage
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    if (!isHomePage) return;
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

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
        { name: 'Who We Are', href: '/about', icon: Info },
        { name: 'Our Community', href: '/about/community', icon: Users },
        { name: 'Leadership & Executives', href: '/leadership', icon: Users },
      ],
    },
    { name: 'Student Support', href: '#', dropdown: [
          { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
          { name: 'Welfare', href: '/welfare', icon: Heart },
          { name: 'Resources', href: '/resources', icon: FileText },
          { name: 'Past Questions', href: '/academics/past-questions', icon: FileText },
          { name: 'Tutorials', href: '/academics/tutorials', icon: GraduationCap },
          { name: 'Academic Calendar', href: '/student-support/academic-calendar', icon: Calendar }
        ] },
    { name: 'Events & Programmes', href: '/events', icon: Calendar },
    { name: 'Research & Opportunities', href: '/research-and-opportunities', icon: Bot },
    { name: 'News & Updates', href: '/news-updates', icon: Info },
  ];

  const headerClass = !isHomePage
    ? "sticky top-0 z-50 w-full bg-neutral-950/95 backdrop-blur-md border-b border-white/10 text-white"
    : (isScrolled || isOpen)
      ? "fixed top-0 z-50 w-full bg-neutral-950/95 backdrop-blur-md border-b border-white/10 text-white transition-all duration-300"
      : "absolute top-0 z-50 w-full bg-black/30 border-b border-white/10 text-white transition-all duration-300";

  return (
    <header className={headerClass}>
      {/* Top Bar */}
      <div className="hidden lg:flex h-10 w-full items-center justify-end px-8 border-b border-white/5 text-xs text-neutral-300 font-medium">
        {/* Right Side: Contact & Socials */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>+233 (0) 55 860 1545</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-[#B8860B]" />
            <span>grasagpresident@upsamail.edu.gh</span>
          </div>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6 py-1">
            <a href="#" className="hover:text-[#B8860B] transition-colors" aria-label="LinkedIn">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="#" className="hover:text-[#B8860B] transition-colors" aria-label="X (Twitter)">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-[#B8860B] transition-colors" aria-label="YouTube">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.51a3.004 3.004 0 0 0-2.11 2.108C0 8.023 0 12 0 12s0 3.977.502 5.837a3.003 3.003 0 0 0 2.11 2.108c1.86.51 9.388.51 9.388.51s7.528 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.977 24 12 24 12s0-3.977-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-20 w-full flex items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-auto flex items-center justify-center">
            <Image src="/GRASAG-LOGO- white text.png" alt="GRASAG UPSA Logo" className="object-contain h-full w-auto" width={272} height={80} priority />
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
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:text-white transition-all duration-200"
                  >
                    {item.name}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180 text-neutral-400" />
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 origin-top rounded-xl border border-white/10 bg-neutral-900 p-2 shadow-2xl transition-all duration-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50">
                    {item.dropdown.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors duration-150"
                        >
                          <Icon className="h-4 w-4 text-[#B8860B]" />
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
                className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-200 hover:text-white transition-all duration-200"
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/contact"
            className="bg-[#B8860B] hover:bg-[#9A7C1C] text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all shadow-md active:scale-95"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2.5 text-neutral-200 hover:bg-white/5 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute left-0 top-full w-full bg-neutral-950 text-white border-t border-white/10 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-1 p-4">
            {navItems.map((item) => (
              item.dropdown ? (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/5"
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
                          className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-neutral-300 hover:bg-white/5 hover:text-white transition-colors duration-150"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/5"
                >
                  {item.name}
                </Link>
              )
            ))}
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-white/10 mt-4 space-y-3 px-4">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center bg-[#B8860B] hover:bg-[#9A7C1C] text-white py-3 rounded-lg text-sm font-bold tracking-wide transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
