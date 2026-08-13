'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Plus, Minus } from 'lucide-react';
import Tooltip from './Tooltip';

export default function Footer() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(prev => prev === title ? null : title);
  };

  return (
    <footer className="admin-footer w-full border-t border-neutral-800 bg-neutral-950 text-white transition-all duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8 lg:px-8 md:py-16">
        
        {/* Mobile View (Below md breakpoint) */}
        <div className="block md:hidden space-y-6 text-left">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-auto flex items-center justify-start">
              <Image src="/GRASAG-LOGO-white-text.png" alt="GRASAG UPSA Logo" className="object-contain h-full w-auto" width={272} height={80} />
            </div>
            <p className="text-[15px] sm:text-base text-neutral-300 leading-relaxed font-normal">
              Supporting the academic, professional and welfare needs of UPSA graduate students.
            </p>
            <div>
              <Tooltip align="left" />
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-2" />

          {/* Accordion: Useful Links */}
          <div className="border-b border-neutral-800">
            <button
              onClick={() => toggleAccordion('Useful Links')}
              className="w-full min-h-[48px] py-3 flex items-center justify-between text-left text-base font-bold text-white transition-colors"
              aria-expanded={openAccordion === 'Useful Links'}
            >
              <span>Useful Links</span>
              {openAccordion === 'Useful Links' ? (
                <Minus className="w-5 h-5 text-neutral-400" />
              ) : (
                <Plus className="w-5 h-5 text-neutral-400" />
              )}
            </button>
            {openAccordion === 'Useful Links' && (
              <ul className="pb-4 space-y-3">
                <li><Link href="/about" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">About the Association</Link></li>
                <li><Link href="/academics" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Academics & Thesis Support</Link></li>
                <li><Link href="/opportunities" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Graduate Opportunities</Link></li>
                <li><Link href="/welfare" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Student Welfare Schemes</Link></li>
              </ul>
            )}
          </div>

          {/* Accordion: Resources */}
          <div className="border-b border-neutral-800">
            <button
              onClick={() => toggleAccordion('Resources')}
              className="w-full min-h-[48px] py-3 flex items-center justify-between text-left text-base font-bold text-white transition-colors"
              aria-expanded={openAccordion === 'Resources'}
            >
              <span>Resources</span>
              {openAccordion === 'Resources' ? (
                <Minus className="w-5 h-5 text-neutral-400" />
              ) : (
                <Plus className="w-5 h-5 text-neutral-400" />
              )}
            </button>
            {openAccordion === 'Resources' && (
              <ul className="pb-4 space-y-3">
                <li><Link href="/past-questions" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Past Question Bank</Link></li>
                <li><Link href="/resources" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Forms & Downloads</Link></li>
                <li><Link href="/events" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Events & Programmes</Link></li>
                <li><Link href="/about" className="text-[15px] text-neutral-300 hover:text-accent transition-colors block">Governance Constitution</Link></li>
              </ul>
            )}
          </div>

          {/* Contact Details */}
          <div className="pt-4 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">CONTACT US</h3>
            <ul className="space-y-3.5 text-[15px] sm:text-base text-neutral-300 font-normal">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-accent" />
                <a href="tel:+233558601545" className="hover:text-accent transition-colors">+233 (0) 55 860 1545</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-accent" />
                <a href="mailto:grasagpresident@upsamail.edu.gh" className="hover:text-accent transition-colors break-all">grasagpresident@upsamail.edu.gh</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-accent" />
                <span>Student Centre, First Floor, UPSA</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-neutral-800 pt-6">
            <p className="text-xs text-accent">&copy; {new Date().getFullYear()} GRASAG-UPSA. All rights reserved.</p>
          </div>
        </div>

        {/* Desktop View (md and above) */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {/* Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-auto flex items-center justify-start">
                  <Image src="/GRASAG-LOGO-white-text.png" alt="GRASAG UPSA Logo" className="object-contain h-full w-auto" width={272} height={80} />
                </div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Supporting the academic, professional and welfare needs of UPSA graduate students.
              </p>
              <Tooltip align="left" />
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
              <h3 className="text-sm font-bold text-accent uppercase tracking-wider">CONTACT US</h3>
              <ul className="mt-4 space-y-3.5">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-accent" />
                  <a href="tel:+233558601545" className="text-sm text-neutral-400 hover:text-accent transition-colors">+233 (0) 55 860 1545</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-accent" />
                  <a href="mailto:grasagpresident@upsamail.edu.gh" className="text-sm text-neutral-400 hover:text-accent transition-colors">grasagpresident@upsamail.edu.gh</a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm text-neutral-400">Student Centre, First Floor, UPSA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-16 border-t border-neutral-800 pt-8 flex items-center justify-between gap-4">
            <p className="text-xs text-accent">&copy; {new Date().getFullYear()} GRASAG-UPSA. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-xs text-accent hover:text-accent/80 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
