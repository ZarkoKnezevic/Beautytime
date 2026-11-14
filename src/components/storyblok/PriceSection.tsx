import { StoryblokServerComponent, storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

/**
 * Price section — a container for the Leistungen page that groups the
 * `service_category` blocks under one block (its `items` accept only
 * `service_category`). Renders them in order, each category staying a
 * full-width section.
 */
export default function PriceSection({ blok }: { blok: StoryblokBlok }) {
  const items = (Array.isArray(blok.items) ? blok.items : []) as StoryblokBlok[];
  return (
    <div {...storyblokEditable(blok)}>
      {items.map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </div>
  );
}
