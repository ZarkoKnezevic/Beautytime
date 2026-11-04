/**
 * Custom next/image loader.
 *
 * Storyblok assets are served straight from Storyblok's image service, resized
 * to the requested width (auto WebP for browsers that accept it). This avoids a
 * second re-encode by Next's optimizer. Quality defaults to 75; the hero passes
 * a higher value explicitly.
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
  return `${base}/m/${width}x0/filters:quality(${quality ?? 75})`;
}
