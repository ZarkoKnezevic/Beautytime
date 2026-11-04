import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/live-preview', '/live-preview/', '/api/'],
    },
    sitemap: `${APP_CONFIG.domain}/sitemap.xml`,
  };
}
