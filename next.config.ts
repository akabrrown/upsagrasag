import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self' https://vercel.live;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com https://vercel.live;
    img-src 'self' blob: data: https://images.unsplash.com https://cdn.simpleicons.org https://res.cloudinary.com https://img.youtube.com https://translate.google.com https://translate.googleapis.com https://fonts.gstatic.com https://www.gstatic.com https://www.google.com https://vercel.live https://vercel.com;
    font-src 'self' https://db.onlinewebfonts.com https://vercel.live https://assets.vercel.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src 'self' https://vercel.live https://maps.google.com https://www.google.com;
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vercel.live wss://ws-us3.pusher.com https://api.cloudinary.com https://translate.googleapis.com;
    media-src 'self' https://res.cloudinary.com;
`.replace(/\n/g, '');

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ]
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
