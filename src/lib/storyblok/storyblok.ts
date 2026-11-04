import type { Metadata } from 'next';
import { unstable_rethrow } from 'next/navigation';
import { env, logger, DEFAULT_LOCALE, storyPath, localeAlternates, type Locale } from '@/utils';
import { SITE_META } from '@/constants';
import { fetcher, getNextCachingParams } from './utils';
import type { StoryblokApiResponse, StoryblokStoriesResponse, StoryblokStory } from '@/types';

type ContentVersion = 'draft' | 'published';

/** Draft content needs the Preview token; published content works with a Public token. */
function tokenFor(version: ContentVersion): string {
  return version === 'draft' ? env.storyblok.previewToken : env.storyblok.accessToken;
}

/**
 * Storyblok's cache version (`cv`). Published requests must carry it, or the
 * API answers with a redirect and its CDN may serve stale content. It is
 * cached under the same tag as the stories, so a publish webhook refreshes
 * both together.
 */
async function getCacheVersion(version: ContentVersion): Promise<string | null> {
  if (version !== 'published') return null;
  try {
    const url = `${env.storyblok.apiGate}/spaces/me?token=${tokenFor(version)}`;
    const { data } = await fetcher(url, { method: 'GET', ...getNextCachingParams(version) });
    const cv = (data as { space?: { version?: number } })?.space?.version;
    return cv ? String(cv) : null;
  } catch {
    return null;
  }
}

async function versionParams(version: ContentVersion): Promise<Record<string, string>> {
  // Draft (preview/editor) must bypass Storyblok's CDN cache so saved edits
  // show immediately; published uses the space's cache version.
  if (version === 'draft') return { cv: Date.now().toString() };
  const cv = await getCacheVersion(version);
  return cv ? { cv } : {};
}

/**
 * Fetch a single story. Empty slug resolves to `home`.
 */
export async function fetchStory(
  version: ContentVersion,
  slug?: string[],
  language?: string
): Promise<{ data: StoryblokApiResponse }> {
  const token = tokenFor(version);
  if (!token) {
    return { data: { story: null, links: [] } };
  }

  const correctSlug = `/${slug && slug.length > 0 ? slug.join('/') : 'home'}`;

  const searchParams = new URLSearchParams({
    version,
    token,
    resolve_links: 'url',
  });

  // German is the base content (no language param); other locales translate.
  if (language && language !== DEFAULT_LOCALE) {
    searchParams.set('language', language);
  }

  for (const [k, v] of Object.entries(await versionParams(version))) searchParams.set(k, v);

  const url = `${env.storyblok.apiGate}/stories${correctSlug}?${searchParams.toString()}`;

  try {
    const { data } = await fetcher(url, {
      method: 'GET',
      ...getNextCachingParams(version),
    });

    return { data: data as StoryblokApiResponse };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('status: 404')) {
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
  version: ContentVersion,
  params?: Record<string, string | number | boolean>
): Promise<{ data: StoryblokStoriesResponse }> {
  const token = tokenFor(version);
  if (!token) {
    return { data: { stories: [], links: [] } };
  }

  const searchParams = new URLSearchParams({
    version,
    token,
    ...(params as Record<string, string>),
    ...(await versionParams(version)),
  });

  const url = `${env.storyblok.apiGate}/stories?${searchParams.toString()}`;

  const { data } = await fetcher(url, {
    method: 'GET',
    ...getNextCachingParams(version),
  });

  return { data: data as StoryblokStoriesResponse };
}

/** Strip `**accent**` markers and line breaks from a CMS headline. */
const plainHeadline = (v: unknown) =>
  typeof v === 'string'
    ? v
        .replace(/\*\*/g, '')
        .replace(/\s*\n\s*/g, ' ')
        .trim()
    : '';

/**
 * Title for a story without an explicit `seoTitle`: the page's own headline
 * (page hero / legal page), else the story name. Home uses the site default.
 */
function deriveTitle(story: StoryblokStory, locale: Locale): string {
  if (storyPath(story.full_slug) === '/') return SITE_META[locale].title;
  const first = story.content.body?.[0];
  const headline =
    first?.component === 'page_hero'
      ? plainHeadline(first.headline)
      : first?.component === 'legal_page'
        ? plainHeadline(first.title)
        : '';
  return (headline || story.name).replace(/\.$/, '');
}

/**
 * Description for a story without an explicit `seoDescription`: the page
 * hero's intro paragraph (or subheading), trimmed to meta length. Legal pages
 * and the home page fall back to the site description.
 */
function deriveDescription(story: StoryblokStory): string {
  const first = story.content.body?.[0];
  if (first?.component !== 'page_hero') return '';
  const text = plainHeadline(first.body) || plainHeadline(first.subheading);
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, '')}…`;
}

/**
 * Fetch SEO metadata for a story.
 */
export async function fetchStoryMetadata(
  version: ContentVersion,
  slug?: string[],
  locale: Locale = DEFAULT_LOCALE
): Promise<Metadata> {
  if (!tokenFor(version)) {
    return {
      title: 'Storyblok Setup Required',
      description: 'Please configure your Storyblok access token',
    };
  }

  try {
    const {
      data: { story },
    } = await fetchStory(version, slug, locale);

    if (!story) {
      logger.warn(`Missing metadata for story: ${slug?.join('/') || 'home'}`);
      return {};
    }

    const content = story.content as {
      seoTitle?: string;
      seoDescription?: string;
      ogImage?: { filename?: string; alt?: string };
      robots?: string;
    };
    const site = SITE_META[locale];
    const path = storyPath(story.full_slug);
    const isHome = path === '/';

    const title = content.seoTitle || deriveTitle(story, locale);
    const description = content.seoDescription || deriveDescription(story) || site.description;
    const { canonical, languages } = localeAlternates(env.app.domain, path, locale);

    const openGraph: Metadata['openGraph'] = {
      type: 'website',
      siteName: site.siteName,
      locale: site.ogLocale,
      alternateLocale: [SITE_META[locale === 'de' ? 'en' : 'de'].ogLocale],
      url: canonical,
      title: isHome ? title : `${title} | ${site.siteName}`,
      description,
      // Story-specific OG image; otherwise the site default from /public.
      images: content.ogImage?.filename
        ? [
            {
              url: `${content.ogImage.filename}/m/1200x630/filters:quality(75)`,
              width: 1200,
              height: 630,
              alt: content.ogImage.alt || site.siteName,
            },
          ]
        : [{ url: '/og-default.jpg', width: 1200, height: 630, alt: site.siteName }],
    };

    return {
      metadataBase: new URL(env.app.domain),
      // Home keeps the site title verbatim; other pages get the "| Beautytime Traun" template.
      title: isHome ? { absolute: title } : title,
      description,
      alternates: { canonical, languages },
      openGraph,
      // Pages are indexable unless an editor explicitly opts out.
      robots: content.robots === 'noindex' ? { index: false, follow: false } : undefined,
    };
  } catch (error) {
    // Let Next's own control-flow errors (dynamic bail-out, redirects) through.
    unstable_rethrow(error);
    logger.error(`Error fetching story metadata: ${error}`);
    return {};
  }
}
