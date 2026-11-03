/**
 * Custom next/image loader.
 *
 * Storyblok assets are served straight from Storyblok's image service, resized
 * to the exact requested width at high quality (min 90). This avoids a second
 * re-encode by Next's optimizer (the "double compression" that softens images)
 * and keeps everything razor-sharp on high-DPR screens.
 *
 * Non-Storyblok sources (e.g. the local placeholder) pass through unchanged.
 */
type LoaderParams = { src: string; width: number; quality?: number };

export default function storyblokImageLoader({ src, width, quality }: LoaderParams): string {
  if (!src.includes('storyblok.com')) {
    return src;
  }
  // Drop any existing transform, then resize to width (auto height) + quality.
  const base = src.replace(/\/m\/.*$/, '');
  const q = Math.max(quality ?? 75, 90);
  return `${base}/m/${width}x0/filters:quality(${q})`;
}
