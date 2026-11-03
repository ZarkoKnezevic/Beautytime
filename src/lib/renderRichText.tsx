import { render } from 'storyblok-rich-text-react-renderer';

/** A Storyblok rich-text field value. */
export type RichTextField = Parameters<typeof render>[0];

/**
 * Render a Storyblok rich-text field to React.
 * Resolvers for embedded components can be added per block when needed.
 */
export function renderRichText(document?: RichTextField) {
  if (!document) return null;
  return render(document);
}
