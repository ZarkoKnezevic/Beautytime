/**
 * Application constants.
 */

export const APP_CONFIG = {
  name: 'Beautytime',
  description: 'Beautytime Traun — Beauty Studio',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000',
} as const;

export const STORYBLOK_CONFIG = {
  defaultVersion: 'draft' as const,
  defaultSlug: 'home',
  cacheTags: {
    stories: 'storyblok-stories',
    links: 'storyblok-links',
  },
} as const;

export const ROUTES = {
  home: '/',
} as const;
