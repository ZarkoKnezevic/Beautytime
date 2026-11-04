import Image from 'next/image';
import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { cn } from '@/utils';
import LocaleLink from '@/components/LocaleLink';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconWhatsapp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z" />
      <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .4.6 1 1.5 1.8 2.6 2.4.2.1.3.1.4 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.3.5-.1.8-.7 1.5-1.5 1.6-1.3.2-2.9-.5-4.3-1.9-1.4-1.4-2.1-3-1.9-4.3z" />
    </svg>
  );
}

function ServiceCard({
  blok,
  index,
  moreLabel,
}: {
  blok: StoryblokBlok;
  index: number;
  moreLabel: string;
}) {
  const title = asText(blok.title);
  const tagline = asText(blok.tagline);
  const description = asText(blok.description);
  const chips = asText(blok.chips)
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
  const featured = !!blok.featured;
  const img = blok.image as { filename?: string; alt?: string } | undefined;
  const imgSrc = asText(img?.filename);
  const imgAlt = asText(img?.alt) || title;
  const { href } = prepareLinkProps({ link: blok.link });
  const num = String(index + 1).padStart(2, '0');

  return (
    <LocaleLink
      href={href || '#'}
      {...storyblokEditable(blok)}
      className={cn('card rv', featured && 'feat')}
      style={{ transitionDelay: `${(0.1 + index * 0.1).toFixed(2)}s` }}
    >
      <div className="pic">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={imgAlt}
            fill
            sizes={
              featured
                ? '(max-width: 1000px) 100vw, 66vw'
                : '(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 33vw'
            }
            className="object-cover"
          />
        ) : null}
        <span className="n">{num}</span>
      </div>
      <div className="bd">
        {title ? <h3>{title}</h3> : null}
        {tagline ? <div className="tg">{tagline}</div> : null}
        {description ? <p>{description}</p> : null}
        {chips.length > 0 ? (
          <div className="chips">
            {chips.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        ) : null}
        <span className="more">
          {moreLabel} <Arrow />
        </span>
      </div>
    </LocaleLink>
  );
}

/**
 * Services preview grid — mirrors design/site/index.html: a title with a gold
 * italic accent, a row of service cards (the first featured/wide), and a gold
 * CTA card. Reveals on scroll (`data-io`); cards stagger via `.rv`.
 */
export default function Services({ blok }: { blok: StoryblokBlok }) {
  const title = asText(blok.title);
  const titleAccent = asText(blok.title_accent);
  const linkLabel = asText(blok.link_label);
  const { href: linkHref } = prepareLinkProps({ link: blok.link });
  const items = Array.isArray(blok.items) ? (blok.items as StoryblokBlok[]) : [];
  const moreLabel = asText(blok.more_label) || 'Mehr erfahren';

  const ctaHeading = asText(blok.cta_heading);
  const ctaText = asText(blok.cta_text);
  const ctaPrimary = prepareLinkProps({
    link: blok.cta_primary_link,
    text: asText(blok.cta_primary_label),
  });
  const ctaWa = prepareLinkProps({
    link: blok.cta_whatsapp_link,
    text: asText(blok.cta_whatsapp_label),
  });

  return (
    <section
      {...storyblokEditable(blok)}
      className="wrap"
      data-io
      style={{ paddingBottom: 'clamp(80px, 16vw, 150px)', position: 'relative' }}
    >
      <div className="star" style={{ top: 24, right: '9%' }} />
      <div className="star" style={{ top: 110, left: '44%', width: 11, height: 11, animationDelay: '1.4s' }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: 24,
          flexWrap: 'wrap',
          paddingBottom: 40,
        }}
      >
        <h2 className="h2">
          <span className="ln">
            <span style={{ transitionDelay: '.1s' }}>{title}</span>
          </span>
          {titleAccent ? (
            <span className="ln">
              <span style={{ transitionDelay: '.25s' }}>
                <em className="it text-gold-dark gw" style={{ fontSize: '.78em' }}>
                  {titleAccent}
                </em>
              </span>
            </span>
          ) : null}
        </h2>
        {linkHref && linkLabel ? (
          <LocaleLink href={linkHref} className="ul rv" style={{ fontSize: 15, transitionDelay: '.3s' }}>
            <span className="ul-t">{linkLabel}</span>
          </LocaleLink>
        ) : null}
      </div>

      <div className="sgrid">
        {items.map((item, i) => (
          <ServiceCard key={item._uid} blok={item} index={i} moreLabel={moreLabel} />
        ))}

        {ctaHeading || ctaText ? (
          <div className="card cta rv" style={{ transitionDelay: `${(0.1 + items.length * 0.1).toFixed(2)}s` }}>
            <div className="star" style={{ top: 22, right: 22, background: 'var(--ivory)' }} />
            {ctaHeading ? (
              <div className="it" style={{ fontSize: 36, lineHeight: 1.05 }}>
                {ctaHeading}
              </div>
            ) : null}
            {ctaText ? (
              <p style={{ margin: 0, color: 'var(--ivory)', fontSize: 15, lineHeight: 1.5, opacity: 0.9 }}>
                {ctaText}
              </p>
            ) : null}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
              {ctaPrimary.text ? (
                <a href={ctaPrimary.href || '#'} className="btn solid">
                  <span>{ctaPrimary.text}</span>
                </a>
              ) : null}
              {ctaWa.text ? (
                <a href={ctaWa.href || '#'} className="btn" target="_blank" rel="noopener noreferrer">
                  <IconWhatsapp />
                  <span>{ctaWa.text}</span>
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
