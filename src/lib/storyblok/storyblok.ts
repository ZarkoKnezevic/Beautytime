import type { Metadata } from 'next';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import { env, logger, DEFAULT_LOCALE } from '@/utils';
import { COMPONENTS } from '@/constants/storyblok-components';
import { fetcher, getNextCachingParams } from './utils';
import type {
  StoryblokApiResponse,
  StoryblokStoriesResponse,
  StoryblokApiInit,
} from '@/types';

/**
 * Lazy Storyblok API initialization — handles a missing token gracefully.
 */
let storyblokApiInstance: ReturnType<typeof storyblokInit> | null = null;

export function getStoryblokApi() {
  if (!env.storyblok.accessToken) {
    return null;
  }

  if (!storyblokApiInstance) {
    storyblokApiInstance = storyblokInit({
      accessToken: env.storyblok.accessToken,
      use: [apiPlugin],
      components: COMPONENTS,
    } as StoryblokApiInit);
  }

  return storyblokApiInstance;
}

/**
 * Fetch a single story. Empty slug resolves to `home`.
 */
export async function fetchStory(
  version: 'draft' | 'published',
  slug?: string[],
  language?: string
): Promise<{ data: StoryblokApiResponse }> {
  if (!env.storyblok.accessToken) {
    return { data: { story: null, links: [] } };
  }

  getStoryblokApi();
  const correctSlug = `/${slug && slug.length > 0 ? slug.join('/') : 'home'}`;

  const searchParams = new URLSearchParams({
    version,
    token: env.storyblok.accessToken,
    resolve_links: 'url',
  });

  // German is the base content (no language param); other locales translate.
  if (language && language !== DEFAULT_LOCALE) {
    searchParams.set('language', language);
  }

  // Draft (preview/editor) must bypass Storyblok's CDN cache so saved edits
  // show immediately. Published stays cacheable (no cv → CDN-cached).
  if (version === 'draft') {
    searchParams.set('cv', Date.now().toString());
  }

  const url = `${env.storyblok.apiGate}/stories${correctSlug}?${searchParams.toString()}`;

  try {
    const { data } = await fetcher(url, {
      method: 'GET',
      ...getNextCachingParams(version),
    });

    return { data: data as StoryblokApiResponse };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('404')) {
      logger.warn(`Story not found: ${correctSlug}`);
      return { data: { story: null, links: [] } };
    }
    throw error;
  }
}

/**
 * Fetch multiple stories.
 */
export async function fetchStories(
  version: 'draft' | 'published',
  params?: Record<string, string | number | boolean>
): Promise<{ data: StoryblokStoriesResponse }> {
  if (!env.storyblok.accessToken) {
    return { data: { stories: [], links: [] } };
  }

  getStoryblokApi();

  const searchParams = new URLSearchParams({
    version,
    token: env.storyblok.accessToken,
    ...(params as Record<string, string>),
  });

  const url = `${env.storyblok.apiGate}/stories?${searchParams.toString()}`;

  const { data } = await fetcher(url, {
    method: 'GET',
    ...getNextCachingParams(version),
  });

  return { data: data as StoryblokStoriesResponse };
}

/**
 * Fetch SEO metadata for a story.
 */
export async function fetchStoryMetadata(
  version: 'draft' | 'published',
  slug?: string[],
  language?: string
): Promise<Metadata> {
  if (!env.storyblok.accessToken) {
    return {
      title: 'Storyblok Setup Required',
      description: 'Please configure your Storyblok access token',
    };
  }

  try {
    const {
      data: { story },
    } = await fetchStory(version, slug, language);

    if (!story) {
      logger.warn(`Missing metadata for story: ${slug?.join('/') || 'home'}`);
      return {};
    }

    const content = story.content as {
      seoTitle?: string;
      seoDescription?: string;
      ogImage?: { filename?: string };
      seoKeywords?: string;
      robots?: string;
    };

    const seoTitle = content.seoTitle || story.name || '';
    const seoDescription = content.seoDescription || '';
    const ogImage = content.ogImage;
    const seoKeywords = content.seoKeywords || '';
    const robots = content.robots;

    const openGraph: Metadata['openGraph'] = {
      title: seoTitle,
      description: seoDescription,
      // Story-specific OG image, else the founders photo as the site-wide
      // default (a page's openGraph overrides the layout's, so set it here).
      images: ogImage?.filename
        ? [{ url: `${ogImage.filename}/m/1200x630/filters:quality(75)` }]
        : [{ url: '/og-default.jpg', width: 1200, height: 630 }],
    };

    const correctSlug = story.full_slug === 'home' ? '' : story.full_slug;
    const canonical = new URL(`${env.app.domain}/${correctSlug}`).toString();

    return {
      alternates: { canonical },
      metadataBase: new URL(env.app.domain),
      title: seoTitle,
      description: seoDescription,
      openGraph,
      keywords: seoKeywords,
      robots: robots === 'index' ? { index: true } : { index: false },
    };
  } catch (error) {
    logger.error(`Error fetching story metadata: ${error}`);
    return {};
  }
}
