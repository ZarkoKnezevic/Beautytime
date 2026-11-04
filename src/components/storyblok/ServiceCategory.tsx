import Image from 'next/image';
import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import LocaleLink from '@/components/LocaleLink';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[äàá]/g, 'a')
    .replace(/[öòó]/g, 'o')
    .replace(/[üùú]/g, 'u')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CategoryImage({ img, clip }: { img?: { filename?: string; alt?: string }; clip: string }) {
  const src = asText(img?.filename);
  const alt = asText(img?.alt);
  return (
    <div className="stick hz">
      <div className={`imgw ${clip}`} style={{ height: 600 }}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 760px) 100vw, (max-width: 1440px) 40vw, 560px"
            className="object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Service category (Leistungen) — mirrors design/site/leistungen.html: a
 * two-column section with a sticky image on one side and, on the other, the
 * category number, a line-reveal heading, description, a list of price rows
 * (hover accent bar), and a CTA link. `image_side` alternates left/right.
 */
export default function ServiceCategory({ blok }: { blok: StoryblokBlok }) {
  const number = asText(blok.number);
  const titleLines = asText(blok.title)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const description = asText(blok.description);
  const image = blok.image as { filename?: string; alt?: string } | undefined;
  const imageLeft = asText(blok.image_side) !== 'right';
  const items = (Array.isArray(blok.items) ? blok.items : []) as StoryblokBlok[];
  const ctaLabel = asText(blok.cta_label);
  const { href: ctaHref } = prepareLinkProps({ link: blok.cta_link });
  const ctaExternal = /^https?:\/\//.test(ctaHref);
  const ctaInternal = ctaHref.startsWith('/');

  const imageCol = imageLeft ? '1 / span 5' : '8 / span 5';
  const contentCol = imageLeft ? '7 / span 6' : '1 / span 6';
  const clip = imageLeft ? 'clip' : 'clipl';
  const ctaStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 36,
    fontSize: 15,
    transitionDelay: '.5s',
  } as const;
  // Stable, locale-independent anchor (falls back to a slug of the title).
  const id = asText(blok.anchor) || slugify(titleLines.join(' '));

  const imageBlock = (
    <div style={{ gridColumn: imageCol }}>
      <CategoryImage img={image} clip={clip} />
    </div>
  );

  const contentBlock = (
    <div style={{ gridColumn: contentCol }}>
      {number ? (
        <div className="it rv" style={{ fontSize: 26, color: 'var(--gold)' }}>
          {number}
        </div>
      ) : null}

      <h2 className="h2" style={{ marginTop: 12 }} aria-label={titleLines.join(' ')}>
        {titleLines.map((line, i) => (
          <span key={i} className="ln" style={{ transitionDelay: `${(0.1 + i * 0.1).toFixed(2)}s` }} aria-hidden="true">
            <span>{line}</span>
          </span>
        ))}
      </h2>

      {description ? (
        <p className="body muted rv" style={{ maxWidth: 460, margin: '28px 0 40px', transitionDelay: '.25s' }}>
          {description}
        </p>
      ) : null}

      {items.length ? (
        <div className="rv" style={{ transitionDelay: '.35s' }}>
          {items.map((row, i) => (
            <div className="row" key={row._uid ?? i} {...storyblokEditable(row)}>
              <span>{asText(row.label)}</span>
              <span className="it pr">{asText(row.price) || '[Preis]'}</span>
            </div>
          ))}
        </div>
      ) : null}

      {ctaHref && ctaLabel ? (
        ctaInternal ? (
          <LocaleLink href={ctaHref} className="ul rv" style={ctaStyle}>
            <span className="ul-t">{ctaLabel}</span>
            <Arrow />
          </LocaleLink>
        ) : (
          <a
            href={ctaHref}
            className="ul rv"
            style={ctaStyle}
            {...(ctaExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            <span className="ul-t">{ctaLabel}</span>
            <Arrow />
          </a>
        )
      ) : null}
    </div>
  );

  return (
    <section {...storyblokEditable(blok)} className="wrap cat two" data-io id={id || undefined}>
      {imageLeft ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
}
