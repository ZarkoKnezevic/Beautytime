import { unstable_rethrow } from 'next/navigation';
import { STORYBLOK_CONFIG } from '@/constants';
import { logger } from '@/utils';

/** Single cache tag for every Storyblok request; the publish webhook revalidates it. */
export const STORYBLOK_CACHE_TAG = STORYBLOK_CONFIG.cacheTags.stories;

/** Strip the access token from a URL before it reaches any log output. */
const redact = (url: string) => url.replace(/([?&]token=)[^&]+/, '$1***');

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
      throw new Error(`HTTP error! status: ${response.status} (${redact(url)})`);
    }

    return {
      data: await response.json(),
      headers: response.headers,
    };
  } catch (error) {
    // Next's static-render bail-out is not a fetch failure; don't log it as one.
    unstable_rethrow(error);
    logger.error(
      'Error in fetcher:',
      redact(error instanceof Error ? error.message : String(error))
    );
    throw error;
  }
}

/**
 * Next.js caching params based on the content version.
 * Published content is cached in the Data Cache under one tag and refreshed by
 * the Storyblok webhook (/api/revalidate); draft (preview) is always fresh.
 */
export function getNextCachingParams(version: 'draft' | 'published'): RequestInit {
  return version === 'published'
    ? { cache: 'force-cache', next: { tags: [STORYBLOK_CACHE_TAG] } }
    : { cache: 'no-store' };
}
