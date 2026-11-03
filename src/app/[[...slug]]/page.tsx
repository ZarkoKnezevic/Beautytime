import { notFound } from 'next/navigation';
import { StoryblokStory } from '@storyblok/react/rsc';
import { fetchStory, fetchStoryMetadata } from '@/lib/storyblok';
import CoreLayout from '@/components/CoreLayout';
import { env, parseLocaleFromSlug } from '@/utils';
import { STORYBLOK_CONFIG } from '@/constants';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

const SYSTEM_PATHS = ['favicon.ico', '.well-known', 'robots.txt', 'sitemap.xml'];

function isSystemPath(slug: string[]): boolean {
  const first = slug[0]?.toLowerCase() || '';
  return SYSTEM_PATHS.some((p) => first.includes(p));
}

export async function generateMetadata(props: Props) {
  const { slug = [] } = await props.params;
  if (isSystemPath(slug)) return {};
  const { locale, rest } = parseLocaleFromSlug(slug);
  return fetchStoryMetadata(env.storyblok.version, rest, locale);
}

export async function generateStaticParams() {
  return [];
}

export default async function DynamicPage(props: Props) {
  const { slug: rawSlug = [] } = await props.params;

  if (isSystemPath(rawSlug)) {
    notFound();
  }

  const { locale, rest } = parseLocaleFromSlug(rawSlug);
  const contentSlug = rest.length > 0 ? rest : ['home'];

  const { data } = await fetchStory(env.storyblok.version, contentSlug, locale);

  if (!data?.story) {
    const hasToken = !!env.storyblok.accessToken;

    if (!hasToken || contentSlug[0] === 'home') {
      return (
        <main className="flex min-h-screen items-center justify-center bg-sand px-6">
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
                : 'Add NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN and STORYBLOK_VERSION to .env.local, then restart.'}
            </p>
          </div>
        </main>
      );
    }

    notFound();
  }

  const { story, links } = data;

  return (
    <CoreLayout allResolvedLinks={links}>
      <StoryblokStory story={story} />
    </CoreLayout>
  );
}
