import { STORYBLOK_CONFIG } from '@/constants';
import { logger } from '@/utils';

/**
 * Fetcher for Storyblok API calls.
 */
export async function fetcher(
  url: string,
  params: RequestInit = {}
): Promise<{ data: unknown; headers: Headers }> {
  try {
    const response = await fetch(url, params);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      data: await response.json(),
      headers: response.headers,
    };
  } catch (error) {
    logger.error('Error in fetcher:', error);
    throw error;
  }
}

/**
 * Next.js caching params based on the content version.
 * Published content is cached; draft (preview) is always fresh.
 */
export function getNextCachingParams(version: 'draft' | 'published') {
  return {
    next: {
      tags: [STORYBLOK_CONFIG.cacheTags.stories],
    },
    cache: version === 'published' ? ('default' as const) : ('no-store' as const),
  };
}
