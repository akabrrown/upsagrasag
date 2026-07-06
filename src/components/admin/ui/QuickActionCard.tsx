"use client";
import Link from 'next/link';
import React from 'react';
import * as Icons from 'lucide-react';

type QuickActionCardProps = {
  name: string;
  href: string;
  icon: keyof typeof Icons;
  desc: string;
};

export default function QuickActionCard({ name, href, icon, desc }: QuickActionCardProps) {
  const Icon = Icons[icon] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  return (
    <Link
      href={href}
      className="group relative glass-card fade-slide rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#004080]/30 transition-all duration-300 overflow-hidden flex items-start gap-4"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-[#004080] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#004080]/5 transition-colors">
        <Icon className="w-6 h-6 text-gray-600 group-hover:text-[#004080] transition-colors" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#004080] transition-colors">{name}</h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}
