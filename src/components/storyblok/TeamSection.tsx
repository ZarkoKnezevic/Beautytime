import { StoryblokServerComponent, storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

/**
 * Team section — a container for the Unser Team page that groups the team
 * members under one block (its `items` accept only `team_person`). Renders
 * them in order, each member staying a full-width section.
 */
export default function TeamSection({ blok }: { blok: StoryblokBlok }) {
  const items = (Array.isArray(blok.items) ? blok.items : []) as StoryblokBlok[];
  return (
    <div {...storyblokEditable(blok)}>
      {items.map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </div>
  );
}
