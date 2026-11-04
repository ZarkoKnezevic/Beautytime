import Image from 'next/image';
import LocaleLink from '@/components/LocaleLink';
import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Render a heading line, with `**word**` turned into a gold italic accent. */
function renderLine(line: string) {
  return line.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="it text-gold gw">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * Text + image intro — mirrors design/site/index.html: a captioned image
 * (clip-path reveal) beside a line-revealed heading (with a `**gold**` accent),
 * body copy and a link. `image_side` flips the layout. Reveals on scroll.
 */
export default function TextImage({ blok }: { blok: StoryblokBlok }) {
  const img = blok.image as { filename?: string; alt?: string } | undefined;
  const imgSrc = asText(img?.filename);
  const imgAlt = asText(img?.alt);
  const caption = asText(blok.image_caption);
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const body = asText(blok.body);
  const linkLabel = asText(blok.link_label);
  const { href } = prepareLinkProps({ link: blok.link });
  const right = asText(blok.image_side) === 'right';

  const imageCol = right ? '9 / span 4' : '1 / span 4';
  const textCol = right ? '1 / span 7' : '6 / span 7';

  return (
    <section
      {...storyblokEditable(blok)}
      className="wrap"
      data-io
      style={{
        paddingTop: 'clamp(72px, 15vw, 140px)',
        paddingBottom: 'clamp(72px, 15vw, 140px)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="two" style={{ alignItems: 'start' }}>
        <div className="m-full" style={{ gridColumn: imageCol }}>
          <div className="imgw clipl m-h" style={{ height: 460, maxWidth: 380 }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                sizes="(max-width: 760px) 100vw, 380px"
                className="object-cover"
                style={{ objectPosition: 'center 45%' }}
              />
            ) : null}
          </div>
          {caption ? (
            <div className="cap rv" style={{ marginTop: 14, transitionDelay: '.4s' }}>
              {caption}
            </div>
          ) : null}
        </div>

        <div style={{ gridColumn: textCol }}>
          <h2 className="h2">
            {lines.map((line, i) => (
              <span key={i} className="ln">
                <span style={{ transitionDelay: `${(0.1 + i * 0.15).toFixed(2)}s` }}>
                  {renderLine(line)}
                </span>
              </span>
            ))}
          </h2>
          {body ? (
            <p className="body rv" style={{ maxWidth: 520, margin: '40px 0 0', transitionDelay: '.5s' }}>
              {body}
            </p>
          ) : null}
          {href && linkLabel ? (
            <LocaleLink
              href={href}
              className="ul rv"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 36,
                fontSize: 15,
                transitionDelay: '.62s',
              }}
            >
              <span className="ul-t">{linkLabel}</span>
              <Arrow />
            </LocaleLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
