import { render, MARK_LINK } from 'storyblok-rich-text-react-renderer';

/** A Storyblok rich-text field value. */
export type RichTextField = Parameters<typeof render>[0];

type LinkAttrs = { href?: string; target?: string; linktype?: string };

/**
 * Same output as the library's default link resolver, plus
 * `rel="noopener noreferrer"` whenever a link opens a new tab.
 */
function link(children: React.ReactNode, attrs?: LinkAttrs) {
  if (!attrs) return <a>{children}</a>;
  const href = attrs.linktype === 'email' ? `mailto:${attrs.href}` : attrs.href;
  const rel = attrs.target === '_blank' ? 'noopener noreferrer' : undefined;
  return (
    <a href={href} target={attrs.target} rel={rel}>
      {children}
    </a>
  );
}

/**
 * Render a Storyblok rich-text field to React.
 * Resolvers for embedded components can be added per block when needed.
 */
export function renderRichText(document?: RichTextField) {
  if (!document) return null;
  return render(document, { markResolvers: { [MARK_LINK]: link } });
}
