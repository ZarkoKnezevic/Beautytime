'use client';

import { ReactNode } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';

interface StoryblokProviderProps {
  children: ReactNode;
}

/**
 * Client-side Storyblok init (visual editor support).
 */
export default function StoryblokProvider({ children }: StoryblokProviderProps) {
  getStoryblokApi();
  return <>{children}</>;
}
