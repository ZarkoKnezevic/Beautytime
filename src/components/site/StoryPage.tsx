import type { Metadata } from 'next';
import { notFound, permanentRedirect, unstable_rethrow } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStories, fetchStory, fetchStoryMetadata } from '@/lib/storyblok';
import { setRequestLocale } from '@/lib/locale';
import CoreLayout from '@/components/CoreLayout';
import { env, localizeHref, storyPath, logger, type Locale } from '@/utils';
import { STORYBLOK_CONFIG } from '@/constants';

const SYSTEM_PATHS = ['favicon.ico', '.well-known', 'robots.txt', 'sitemap.xml'];

function isSystemPath(slug: string[]): boolean {
  const first = slug[0]?.toLowerCase() || '';
  return SYSTEM_PATHS.some((p) => first.includes(p));
}

export type SlugParams = { slug?: string[] };

/**
 * Static params for the locale catch-all routes: every published `page` story.
 * Unknown slugs still render on demand (and 404 if there is no story).
 */
export async function storyStaticParams(): Promise<{ slug: string[] }[]> {
  try {
    const { data } = await fetchStories('published', { content_type: 'page', per_page: 100 });
    return data.stories.map((story) => {
      const path = storyPath(story.full_slug);
      return { slug: path === '/' ? [] : path.slice(1).split('/') };
    });
  } catch (error) {
    unstable_rethrow(error);
    logger.error(`Could not load story slugs for static generation: ${error}`);
    return [];
  }
}

export function storyPageMetadata(locale: Locale, slug: string[]): Promise<Metadata> {
  if (isSystemPath(slug)) return Promise.resolve({});
  return fetchStoryMetadata(env.storyblok.version, slug, locale);
}

/**
 * Renders the Storyblok `page` story for a locale + slug.
 */
export default async function StoryPage({ locale, slug }: { locale: Locale; slug: string[] }) {
  setRequestLocale(locale);

  if (isSystemPath(slug)) {
    notFound();
  }

  // The home story lives at the locale root; its slug must not be a second URL.
  if (slug.length === 1 && slug[0] === STORYBLOK_CONFIG.defaultSlug) {
    permanentRedirect(localizeHref('/', locale));
  }

  const contentSlug = slug.length > 0 ? slug : [STORYBLOK_CONFIG.defaultSlug];
  const { data } = await fetchStory(env.storyblok.version, contentSlug, locale);

  if (!data?.story) {
    const hasToken = !!env.storyblok.accessToken;

    if (!hasToken || contentSlug[0] === STORYBLOK_CONFIG.defaultSlug) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-sand px-6">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="disp mb-6">Beautytime</h1>
            <p className="body muted mb-4">
              {hasToken
                ? `No Storyblok story found for "${STORYBLOK_CONFIG.defaultSlug}".`
                : 'Storyblok access token is missing.'}
            </p>
            <p className="cap">
              {hasToken
                ? 'Create a "home" story of type "page" in your space.'
                : 'Add STORYBLOK_ACCESS_TOKEN and STORYBLOK_VERSION to .env.local, then restart.'}
            </p>
          </div>
        </div>
      );
    }

    notFound();
  }

  const { story, links } = data;

  // Only `page` stories are routable; global stories like `settings` are not pages.
  if (story.content?.component !== 'page') {
    notFound();
  }

  return (
    <CoreLayout allResolvedLinks={links}>
      <StoryblokStory story={story} />
    </CoreLayout>
  );
}
