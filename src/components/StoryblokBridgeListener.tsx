'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStoryblokBridge } from '@storyblok/react';

/**
 * Live visual-editor preview. Only active inside the Storyblok editor
 * (detected via the `_storyblok` query param). On content changes it calls
 * `router.refresh()`, which re-runs the Server Components against fresh draft
 * content — so edits appear without a full reload, even in our RSC setup.
 */
export default function StoryblokBridgeListener() {
  const router = useRouter();

  useEffect(() => {
    if (!window.location.search.includes('_storyblok')) return;

    let bridge: { on: (events: string[], cb: () => void) => void } | null = null;

    loadStoryblokBridge().then(() => {
      const SB = (window as unknown as { StoryblokBridge?: new () => typeof bridge })
        .StoryblokBridge;
      if (!SB) return;
      bridge = new SB() as typeof bridge;
      bridge?.on(['input', 'published', 'change'], () => router.refresh());
    });
  }, [router]);

  return null;
}
