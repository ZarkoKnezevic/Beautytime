import { fetchStory } from './storyblok';
import { env, logger } from '@/utils';
import type { StoryblokBlok, StoryblokLink } from '@/types';

export interface GlobalSettings {
  header: StoryblokBlok | null;
  footer: StoryblokBlok | null;
  links: StoryblokLink[];
}

/**
 * Fetch global chrome (header/footer) from a `settings` (or `global`) story.
 * Supports both a `settings` blocks array and separate header/footer fields.
 * Also returns the story's resolved link tree for internal-link resolution.
 */
export async function getGlobalSettings(language?: string): Promise<GlobalSettings> {
  try {
    const slugs = ['settings', 'global'];

    for (const slug of slugs) {
      const { data } = await fetchStory(env.storyblok.version, [slug], language);
      const links = data?.links || [];

      if (data?.story?.content) {
        const content = data.story.content as StoryblokBlok & {
          header?: StoryblokBlok | StoryblokBlok[];
          footer?: StoryblokBlok | StoryblokBlok[];
          settings?: StoryblokBlok[];
        };

        if (Array.isArray(content.settings) && content.settings.length > 0) {
          const header =
            content.settings.find((i) => i.component?.toLowerCase() === 'header') || null;
          const footer =
            content.settings.find((i) => i.component?.toLowerCase() === 'footer') || null;

          if (header || footer) {
            return { header, footer, links };
          }
        }

        const header = Array.isArray(content.header)
          ? content.header[0] || null
          : content.header || null;
        const footer = Array.isArray(content.footer)
          ? content.footer[0] || null
          : content.footer || null;

        if (header || footer) {
          return { header, footer, links };
        }
      }
    }

    return { header: null, footer: null, links: [] };
  } catch (error) {
    logger.debug(`Error fetching global settings: ${error}`);
    return { header: null, footer: null, links: [] };
  }
}
