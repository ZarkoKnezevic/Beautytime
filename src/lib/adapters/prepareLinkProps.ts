import type { StoryblokLink } from '@/types';

interface LinkStoryblok {
  link?: {
    linktype?: 'story' | 'url' | 'email';
    id?: string;
    url?: string;
    cached_url?: string;
  };
  text?: string;
  variant?: string;
  size?: string;
}

export interface LinkProps {
  text: string;
  href: string;
  variant?: string;
  size?: string;
}

/**
 * Convert a Storyblok link field (story / url / email) into an href.
 * Internal story links are resolved against the story's `links` tree.
 */
export const prepareLinkProps = (
  props?: LinkStoryblok,
  allResolvedLinks: StoryblokLink[] = []
): LinkProps => {
  if (!props || !props.link) {
    return {
      text: props?.text || '',
      href: '#',
    };
  }

  let url = '';

  if (props.link.linktype === 'url') {
    url = props.link.url || props.link.cached_url || '';
  } else if (props.link.linktype === 'story') {
    const resolvedLink = allResolvedLinks?.find((item) => item.uuid === props.link?.id);

    if (resolvedLink) {
      const linkUrl = resolvedLink.url || resolvedLink.real_path || resolvedLink.slug;
      url = linkUrl?.startsWith('/') ? linkUrl : `/${linkUrl}`;
    }
  } else if (props.link.linktype === 'email') {
    url = `mailto:${props.link.url}`;
  }

  return {
    text: props.text || '',
    href: url,
    variant: props.variant,
    size: props.size,
  };
};
