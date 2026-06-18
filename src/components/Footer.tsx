'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Footer() {
  return (
    <footer className="admin-footer w-full border-t border-neutral-800 bg-neutral-950 text-white transition-all duration-300">
      {/* Contact Us Button */}
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8 flex justify-center">
          <Link href="/contact" className="rounded-xl bg-accent px-6 py-2 text-lg font-bold text-white shadow-md hover:bg-accent/90 transition-all duration-200">
            Contact Us
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-68 overflow-hidden bg-white rounded-md relative">
                <Image src="/grasag-logo.jpeg" alt="GRASAG UPSA Logo" className="object-contain w-full h-full" width={272} height={80} />
              </div>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Graduate Students&apos; Association of Ghana, University of Professional Studies, Accra. Building a resource-filled graduate community since 2012.
            </p>
            <Tooltip />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Useful Links</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/about" className="text-sm text-neutral-400 hover:text-accent transition-colors">About the Association</Link></li>
              <li><Link href="/academics" className="text-sm text-neutral-400 hover:text-accent transition-colors">Academics & Thesis Support</Link></li>
              <li><Link href="/opportunities" className="text-sm text-neutral-400 hover:text-accent transition-colors">Graduate Opportunities</Link></li>
              <li><Link href="/welfare" className="text-sm text-neutral-400 hover:text-accent transition-colors">Student Welfare Schemes</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              <li><Link href="/past-questions" className="text-sm text-neutral-400 hover:text-accent transition-colors">Past Question Bank</Link></li>
              <li><Link href="/resources" className="text-sm text-neutral-400 hover:text-accent transition-colors">Forms & Downloads</Link></li>
              <li><Link href="/events" className="text-sm text-neutral-400 hover:text-accent transition-colors">Events & Programmes</Link></li>
              <li><Link href="/about" className="text-sm text-neutral-400 hover:text-accent transition-colors">Governance Constitution</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">Contact Info</h3>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-neutral-400 leading-relaxed">Graduate School Building, Room 204, UPSA Campus, Madina, Accra</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-neutral-400">+233 (0) 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm text-neutral-400">Grasagupsa2026@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-16 border-t border-neutral-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-accent">&copy; {new Date().getFullYear()} GRASAG-UPSA. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
