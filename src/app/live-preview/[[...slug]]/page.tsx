import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStory } from '@/lib/storyblok';
import CoreLayout from '@/components/CoreLayout';
import { parseLocaleFromSlug } from '@/utils';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

/**
 * Live preview route for the Storyblok visual editor. Always renders draft.
 */
export default async function LivePreviewPage(props: Props) {
  const { slug: rawSlug = [] } = await props.params;
  const { locale, rest } = parseLocaleFromSlug(rawSlug);
  const contentSlug = rest.length > 0 ? rest : ['home'];

  const { data } = await fetchStory('draft', contentSlug, locale);

  if (!data?.story) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sand px-6">
        <p className="body muted">No draft story found for &quot;{contentSlug.join('/')}&quot;.</p>
      </main>
    );
  }

  return (
    <CoreLayout allResolvedLinks={data.links}>
      <StoryblokStory story={data.story} />
    </CoreLayout>
  );
}
