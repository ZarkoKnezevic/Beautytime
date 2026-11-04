import type { Metadata } from 'next';
import LivePreviewStory from '@/components/site/LivePreviewStory';

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LivePreviewPage(props: Props) {
  const [{ slug = [] }, searchParams] = await Promise.all([props.params, props.searchParams]);
  return <LivePreviewStory locale="en" slug={slug} searchParams={searchParams} />;
}
