import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Social icons data
const socials = [
  {
    href: 'https://www.instagram.com/grasag_upsa?igsh=bWxtenV6NHY1djY0',
    iconUrl: 'https://cdn.simpleicons.org/instagram/fff',
    label: 'Instagram',
  },
  {
    href: 'https://x.com/grasag_upsa?s=21',
    iconUrl: 'https://cdn.simpleicons.org/x/fff',
    label: 'X (Twitter)',
  },
  {
    href: 'https://www.facebook.com/share/1JHWgU7ich/?mibextid=wwXIfr',
    iconUrl: 'https://cdn.simpleicons.org/facebook/fff',
    label: 'Facebook',
  },
];

interface TooltipProps {
  align?: 'left' | 'center';
}

export default function Tooltip({ align = 'center' }: TooltipProps) {
  return (
    <ul className={`flex ${align === 'left' ? 'justify-start space-x-4' : 'justify-center space-x-6'}`}>
      {socials.map(({ href, iconUrl, label }, idx) => (
        <li key={idx} className="relative group">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={iconUrl} alt={label} width={20} height={20} className="w-5 h-5 object-contain" />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
