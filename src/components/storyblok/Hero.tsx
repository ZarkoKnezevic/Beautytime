import { type CSSProperties } from 'react';
import Image from 'next/image';
import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import GoldWord from '@/components/GoldWord';
import LocaleLink from '@/components/LocaleLink';
import type { StoryblokBlok } from '@/types';

interface HeroProps {
  blok: StoryblokBlok;
}

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Home hero — mirrors design/site/index.html: eyebrow, two-line display
 * headline with a gold-italic emphasis, body + CTA, and the founders image
 * with a clip-path/scale reveal and floating sparkles.
 */
export default function Hero({ blok }: HeroProps) {
  const eyebrow = asText(blok.eyebrow);
  const lines = asText(blok.headline)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const emphasis = asText(blok.headline_emphasis);
  const body = asText(blok.body);
  const cta = prepareLinkProps(
    blok.cta_link
      ? { link: blok.cta_link, text: asText(blok.cta_label) }
      : { text: asText(blok.cta_label) }
  );
  const img = blok.image as { filename?: string; alt?: string } | undefined;
  const imgSrc = asText(img?.filename);
  const imgAlt = asText(img?.alt) || 'Beautytime Traun';

  const fullHeadline = [...lines, emphasis].filter(Boolean).join(' ');
  // Line reveal timing (per spec): 0.9s, cubic-bezier(.22,1,.36,1), ~0.17s stagger.
  const lineRise = (li: number): CSSProperties => ({
    transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: `${(0.2 + li * 0.17).toFixed(2)}s`,
  });

  return (
    <header
      {...storyblokEditable(blok)}
      className="wrap"
      data-load
      style={{
        paddingTop: 'clamp(32px, 7vw, 56px)',
        paddingBottom: 'clamp(64px, 14vw, 120px)',
        position: 'relative',
      }}
    >
      <div className="two" style={{ alignItems: 'start' }}>
        <div style={{ gridColumn: '1 / span 8', position: 'relative', zIndex: 2 }}>
          {eyebrow ? (
            <div className="cap rv" style={{ marginBottom: 32, transitionDelay: '.4s' }}>
              {eyebrow}
            </div>
          ) : null}

          <h1 className="disp" aria-label={fullHeadline}>
            {lines.map((line, li) => {
              const isLast = li === lines.length - 1;
              return (
                <span key={li} className="ln" aria-hidden="true">
                  <span style={lineRise(li)}>
                    {line}
                    {isLast && emphasis ? (
                      <>
                        {' '}
                        <GoldWord word={emphasis} />
                      </>
                    ) : null}
                  </span>
                </span>
              );
            })}
          </h1>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 32,
              marginTop: 48,
            }}
          >
            {body ? (
              <p className="body rv" style={{ maxWidth: 440, margin: 0, transitionDelay: '.95s' }}>
                {body}
              </p>
            ) : null}
            {cta.text ? (
              cta.href.startsWith('/') ? (
                <LocaleLink href={cta.href} className="btn rv" style={{ transitionDelay: '1.15s' }}>
                  <span>{cta.text}</span>
                  <Arrow />
                </LocaleLink>
              ) : (
                <a href={cta.href || '#'} className="btn rv" style={{ transitionDelay: '1.15s' }}>
                  <span>{cta.text}</span>
                  <Arrow />
                </a>
              )
            ) : null}
          </div>
        </div>

        <div className="m-full" style={{ gridColumn: '9 / span 4', position: 'relative' }}>
          <div className="imgw clip m-h" style={{ height: 660, marginLeft: -140, transitionDelay: '.7s' }}>
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                priority
                fetchPriority="high"
                quality={80}
                sizes="(max-width: 760px) 100vw, (max-width: 1440px) 42vw, 600px"
                className="object-cover"
                style={{ objectPosition: 'center top', transitionDelay: '.7s' }}
              />
            ) : null}
          </div>
          <div className="spark" style={{ top: -12, right: 24 }} />
          <div className="spark" style={{ bottom: 72, left: -156, animationDelay: '1.2s' }} />
          <div
            className="spark"
            style={{ top: '40%', right: -10, animationDelay: '2.1s', width: 4, height: 4 }}
          />
        </div>
      </div>
    </header>
  );
}
