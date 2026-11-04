/**
 * Type-safe access to environment variables with graceful fallbacks.
 *
 * Storyblok tokens are server-only (no NEXT_PUBLIC_ prefix) so they never end
 * up in the client bundle. `STORYBLOK_ACCESS_TOKEN` should be a *Public* token
 * in production (published content only); `STORYBLOK_PREVIEW_TOKEN` is the
 * Preview token used exclusively for draft content (visual editor).
 */

type ContentVersion = 'draft' | 'published';

function read(key: string, defaultValue = ''): string {
  return process.env[key] || defaultValue;
}

const isProduction = process.env.NODE_ENV === 'production';

function contentVersion(): ContentVersion {
  const v = read('STORYBLOK_VERSION');
  if (v === 'draft' || v === 'published') return v;
  // Never fall back to draft in production: unpublished content must not leak.
  return isProduction ? 'published' : 'draft';
}

const accessToken = read('STORYBLOK_ACCESS_TOKEN');
const previewToken = read('STORYBLOK_PREVIEW_TOKEN');

if (!accessToken && typeof window === 'undefined') {
  console.warn(
    '⚠️ STORYBLOK_ACCESS_TOKEN is not set. Create a .env.local file with your Storyblok access token.'
  );
}

export const env = {
  storyblok: {
    accessToken,
    /** Token for draft requests; falls back to the access token in development setups. */
    previewToken: previewToken || accessToken,
    apiGate: read('NEXT_PUBLIC_STORYBLOK_API_GATE', 'https://api.storyblok.com/v2/cdn'),
    version: contentVersion(),
  },
  app: {
    url: read('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    domain: read('NEXT_PUBLIC_DOMAIN', 'http://localhost:3000'),
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction,
} as const;
