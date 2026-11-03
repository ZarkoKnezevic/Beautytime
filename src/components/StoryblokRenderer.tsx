import { StoryblokServerComponent } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

interface StoryblokRendererProps {
  blok: StoryblokBlok;
}

/**
 * Render a single Storyblok blok via the registered component.
 */
export default function StoryblokRenderer({ blok }: StoryblokRendererProps) {
  if (!blok || !blok.component) {
    return null;
  }

  return <StoryblokServerComponent blok={blok} />;
}
