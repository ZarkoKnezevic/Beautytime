import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Serve images via Storyblok's image CDN (resize + quality) instead of
    // Next's optimizer, to avoid double compression.
    loaderFile: './src/lib/storyblokImageLoader.ts',
    qualities: [75, 90, 100],
  },
  reactStrictMode: true,
};

export default nextConfig;
