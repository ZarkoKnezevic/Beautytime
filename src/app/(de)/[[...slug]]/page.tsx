import StoryPage, {
  storyPageMetadata,
  storyStaticParams,
  type SlugParams,
} from '@/components/site/StoryPage';

type Props = { params: Promise<SlugParams> };

/** Safety net; the Storyblok webhook (/api/revalidate) refreshes pages on publish. */
export const revalidate = 86400;

export async function generateStaticParams() {
  return storyStaticParams();
}

export async function generateMetadata({ params }: Props) {
  const { slug = [] } = await params;
  return storyPageMetadata('de', slug);
}

export default async function Page({ params }: Props) {
  const { slug = [] } = await params;
  return <StoryPage locale="de" slug={slug} />;
}
