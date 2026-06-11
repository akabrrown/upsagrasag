import React from 'react';
import Link from 'next/link';

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

export default function Tooltip() {
  return (
    <ul className="flex justify-center space-x-6">
      {socials.map(({ href, iconUrl, label }, idx) => (
        <li key={idx} className="relative group">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 transition-colors"
          >
            <img src={iconUrl} alt={label} className="w-5 h-5" />
          </Link>
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
