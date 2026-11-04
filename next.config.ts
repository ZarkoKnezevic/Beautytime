import type { NextConfig } from 'next';

/**
 * Security headers. `frame-ancestors` keeps the Storyblok visual editor
 * (which iframes the site) working while blocking everyone else.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://app.storyblok.com" },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  images: {
    // Serve images via Storyblok's image CDN (resize + quality) instead of
    // Next's optimizer, to avoid double compression.
    loaderFile: './src/lib/storyblokImageLoader.ts',
    qualities: [75, 80],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
