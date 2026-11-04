// Global Storyblok type definitions.

export type { Locale } from '@/utils/i18n';

export interface BaseComponent {
  _uid: string;
  component: string;
  // Storyblok bloks carry arbitrary CMS-defined fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface StoryblokBlok extends BaseComponent {
  body?: StoryblokBlok[];
  items?: StoryblokBlok[];
}

export interface StoryblokStory {
  content: StoryblokBlok;
  name: string;
  created_at: string;
  published_at: string | null;
  id: number;
  uuid: string;
  slug: string;
  full_slug: string;
}

export interface StoryblokLink {
  id: number;
  slug: string;
  name: string;
  is_folder: boolean;
  parent_id: number | null;
  published: boolean;
  position: number;
  uuid: string;
  is_startpage: boolean;
  real_path: string;
  url?: string;
}

export interface StoryblokApiResponse {
  story: StoryblokStory | null;
  links?: StoryblokLink[];
}

export interface StoryblokStoriesResponse {
  stories: StoryblokStory[];
  links?: StoryblokLink[];
}
