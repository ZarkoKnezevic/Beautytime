import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/constants';

/**
 * Minimal locale-aware sitemap (German at root, English under /en).
 * Expands to story-driven routes once content pages are built out.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_CONFIG.domain.replace(/\/$/, '');
  return [
    {
      url: base,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: { de: base, en: `${base}/en` } },
    },
    {
      url: `${base}/en`,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { de: base, en: `${base}/en` } },
    },
  ];
}
