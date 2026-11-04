import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStory, isValidPreviewRequest } from '@/lib/storyblok';
import { setRequestLocale } from '@/lib/locale';
import CoreLayout from '@/components/CoreLayout';
import { STORYBLOK_CONFIG } from '@/constants';
import type { Locale } from '@/utils';

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Live preview for the Storyblok visual editor. Always renders draft content,
 * so access is restricted to requests signed by the editor (`_storyblok_tk`)
 * or to a draft-mode session started via /api/preview.
 */
export default async function LivePreviewStory({
  locale,
  slug,
  searchParams,
}: {
  locale: Locale;
  slug: string[];
  searchParams: SearchParams;
}) {
  setRequestLocale(locale);
  const draft = await draftMode();

  if (!draft.isEnabled && !isValidPreviewRequest(searchParams)) {
    notFound();
  }

  const contentSlug = slug.length > 0 ? slug : [STORYBLOK_CONFIG.defaultSlug];
  const { data } = await fetchStory('draft', contentSlug, locale);

  if (!data?.story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand px-6">
        <p className="body muted">No draft story found for &quot;{contentSlug.join('/')}&quot;.</p>
      </div>
    );
  }

  return (
    <CoreLayout allResolvedLinks={data.links}>
      <StoryblokStory story={data.story} />
    </CoreLayout>
  );
}
