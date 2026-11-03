import { StoryblokServerComponent, storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

interface PageProps {
  blok: StoryblokBlok;
}

/**
 * Root `page` content type — renders its nested `body` bloks in order.
 */
export default function Page({ blok }: PageProps) {
  return (
    <div {...storyblokEditable(blok)}>
      {(blok.body || []).map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </div>
  );
}
