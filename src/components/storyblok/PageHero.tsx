import { type CSSProperties } from 'react';
import Image from 'next/image';
import { storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

type Img = { filename?: string; alt?: string } | undefined;

/** Heading line with `**word**` -> gold italic accent (uniform with the other
 *  section headings). */
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

type HeroImgProps = {
  img: Img;
  height: number;
  delay: string;
  pos: string;
  sizes: string;
  /** Above-the-fold hero images: `priority` preloads (LCP), `eager` just skips lazy loading. */
  loading?: 'priority' | 'eager';
};

function HeroImg({ img, height, delay, pos, sizes, loading }: HeroImgProps) {
  const src = asText(img?.filename);
  const alt = asText(img?.alt);
  return (
    <div className="imgw clip m-sm" style={{ height, transitionDelay: delay }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={loading === 'priority'}
          fetchPriority={loading === 'priority' ? 'high' : undefined}
          loading={loading === 'eager' ? 'eager' : undefined}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: pos, transitionDelay: delay }}
        />
      ) : null}
    </div>
  );
}

/**
 * Page hero (Leistungen / Unser Team intros) — mirrors the design. Two layouts:
 * - two images set → full-width headline on top, a two-image grid below
 *   (Leistungen);
 * - a single image → headline in the left column with one tall image + caption
 *   beside it at the top (Unser Team).
 * Reveals on load.
 */
export default function PageHero({ blok }: { blok: StoryblokBlok }) {
  const eyebrow = asText(blok.eyebrow);
  const lines = asText(blok.headline)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const subheading = asText(blok.subheading);
  const body = asText(blok.body);
  const caption = asText(blok.caption);
  const img1 = blok.image_1 as Img;
  const img2 = blok.image_2 as Img;
  const twoImages = !!asText(img2?.filename);

  // Match the hero's line-reveal timing: 0.9s cubic, ~0.17s stagger.
  const lineRise = (li: number): CSSProperties => ({
    transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: `${(0.2 + li * 0.17).toFixed(2)}s`,
  });

  const headline = (
    <>
      {eyebrow ? (
        <div className="cap rv page-hero-eyebrow" style={{ marginBottom: 32, transitionDelay: '.4s' }}>
          {eyebrow}
        </div>
      ) : null}
      <h1 className="disp page-hero-title" aria-label={lines.join(' ').replace(/\*\*/g, '')}>
        {lines.map((line, li) => (
          <span key={li} className="ln" aria-hidden="true">
            <span style={lineRise(li)}>{renderLine(line)}</span>
          </span>
        ))}
      </h1>
    </>
  );

  const subheadingEl = subheading ? (
    <div
      className="it gw"
      style={{
        fontSize: 'clamp(28px, 3.2vw, 46px)',
        color: 'var(--gold)',
        fontWeight: 600,
        lineHeight: 1.1,
        transitionDelay: '.7s',
      }}
    >
      {subheading.split('\n').map((l, i, arr) => (
        <span key={i}>
          {l}
          {i < arr.length - 1 ? <br /> : null}
        </span>
      ))}
    </div>
  ) : null;

  const bodyEl = (marginTop: number) =>
    body ? (
      <p className="body rv" style={{ maxWidth: 460, margin: `${marginTop}px 0 0`, transitionDelay: '.85s' }}>
        {body}
      </p>
    ) : null;

  const headerStyle: CSSProperties = {
    paddingTop: 'clamp(40px, 8vw, 64px)',
    paddingBottom: 'clamp(64px, 13vw, 120px)',
    position: 'relative',
  };

  // Two images (Leistungen): the header is a 12-column grid (see
  // `.page-hero-two` in globals.css). Up to 1100px the headline spans the full
  // width with the text + image pair below it (as in the prototype); on wider
  // screens the images rise to the top, beside the headline.
  if (twoImages) {
    return (
      <header
        {...storyblokEditable(blok)}
        className="wrap page-hero-two"
        data-load
        suppressHydrationWarning
        style={headerStyle}
      >
        {headline}
        <div className="page-hero-text">
          {subheadingEl}
          {bodyEl(32)}
        </div>
        <div className="m-full page-hero-images">
          <HeroImg img={img1} height={440} delay=".6s" pos="center 50%" sizes="(max-width: 760px) 55vw, 300px" loading="priority" />
          <HeroImg img={img2} height={320} delay=".8s" pos="center 30%" sizes="(max-width: 760px) 38vw, 200px" loading="eager" />
        </div>
        <div className="spark" style={{ top: 120, right: '22%' }} />
        <div className="spark" style={{ bottom: 140, left: '44%', animationDelay: '1.3s', width: 4, height: 4 }} />
      </header>
    );
  }

  // Single image (Unser Team): headline in the left column, image beside it.
  return (
    <header {...storyblokEditable(blok)} className="wrap" data-load suppressHydrationWarning style={headerStyle}>
      <div className="two" style={{ alignItems: 'start' }}>
        <div style={{ gridColumn: '1 / span 7', position: 'relative', zIndex: 2 }}>
          {headline}
          {subheadingEl}
          {bodyEl(48)}
        </div>
        <div className="m-full" style={{ gridColumn: '8 / span 5', position: 'relative' }}>
          <HeroImg img={img1} height={620} delay=".7s" pos="center 40%" sizes="(max-width: 760px) 100vw, (max-width: 1440px) 42vw, 520px" loading="priority" />
          {caption ? (
            <div className="cap rv" style={{ marginTop: 14, transitionDelay: '1.1s' }}>
              {caption}
            </div>
          ) : null}
          <div className="spark" style={{ top: -10, left: 24 }} />
          <div className="spark" style={{ bottom: 90, right: -8, animationDelay: '1.5s', width: 4, height: 4 }} />
        </div>
      </div>
    </header>
  );
}
