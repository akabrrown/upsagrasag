import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 bg-neutral-950 text-white">
      {/* Newsletter / CTA banner */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <h2 className="text-xl font-bold text-accent">Subscribe to GRASAG Newsletter</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Receive weekly updates on opportunities, events, research grants, and welfare programs.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-sm text-white placeholder-white shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-accent/90 transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 overflow-hidden rounded-full bg-white relative">
                <img
                  src="/grasag-upsa-logo.png"
                  alt="GRASAG UPSA Logo"
                  className="object-contain"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <span className="font-sans text-base font-bold text-accent uppercase tracking-wider">GRASAG-UPSA</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Graduate Students' Association of Ghana, University of Professional Studies, Accra. Building a resource-filled graduate community since 2012.
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: 'https://www.instagram.com/grasag_upsa?igsh=bWxtenV6NHY1djY0', iconUrl: 'https://cdn.simpleicons.org/instagram/fff' },
                { href: 'https://x.com/grasag_upsa?s=21', iconUrl: 'https://cdn.simpleicons.org/x/fff' },
                { href: 'https://www.facebook.com/share/1JHWgU7ich/?mibextid=wwXIfr', iconUrl: 'https://cdn.simpleicons.org/facebook/fff' },
              ].map(({ href, iconUrl }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <img src={iconUrl} alt="social icon" width={20} height={20} className="inline-block hover:opacity-80 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Useful Links</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  About the Association
                </Link>
              </li>
              <li>
                <Link href="/academics" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Academics & Thesis Support
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Graduate Opportunities
                </Link>
              </li>
              <li>
                <Link href="/welfare" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Student Welfare Schemes
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/past-questions" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Past Question Bank
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Forms & Downloads
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Events & Congress
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-neutral-400 hover:text-accent transition-colors">
                  Governance Constitution
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Contact Info</h3>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-neutral-400 leading-relaxed">
                  Graduate School Building, Room 204, UPSA Campus, Madina, Accra
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-neutral-400">
                  +233 (0) 50 123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-neutral-400">
                  Grasagupsa2026@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-16 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-accent">
            &copy; {new Date().getFullYear()} GRASAG-UPSA. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
