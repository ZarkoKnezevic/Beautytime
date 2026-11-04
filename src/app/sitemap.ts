import type { MetadataRoute } from 'next';
import { unstable_rethrow } from 'next/navigation';
import { fetchStories } from '@/lib/storyblok';
import { APP_CONFIG } from '@/constants';
import { absoluteUrl, storyPath, HREFLANG, LOCALES, logger } from '@/utils';

/**
 * Sitemap of all published `page` stories, listed once per locale with
 * bidirectional hreflang alternates. Only published content is ever listed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = APP_CONFIG.domain;

  let stories: { full_slug: string; published_at: string | null }[] = [];
  try {
    const { data } = await fetchStories('published', { content_type: 'page', per_page: 100 });
    stories = data.stories;
  } catch (error) {
    unstable_rethrow(error);
    logger.error(`Sitemap: could not load stories: ${error}`);
  }

  return stories.flatMap((story) => {
    const path = storyPath(story.full_slug);
    const languages = Object.fromEntries([
      ...LOCALES.map((l) => [HREFLANG[l], absoluteUrl(domain, path, l)]),
      ['x-default', absoluteUrl(domain, path, 'de')],
    ]);
    return LOCALES.map((locale) => ({
      url: absoluteUrl(domain, path, locale),
      lastModified: story.published_at ? new Date(story.published_at) : undefined,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
