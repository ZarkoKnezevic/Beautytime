import { storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Heading line with `**word**` → gold-light accent (same wipe as the hero). */
function renderLine(line: string) {
  return line.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="it gw" style={{ color: 'var(--gold-light)' }}>
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

/**
 * Full-bleed parallax statement — mirrors design/site/index.html: a background
 * image with a slow parallax (`.plx`, driven by the Reveal scroll handler), a
 * dark gradient, a bottom-aligned display heading (line reveal + gold-light
 * wipe) and a caption. Twinkling sparks. Reveals on scroll.
 */
export default function Statement({ blok }: { blok: StoryblokBlok }) {
  const img = blok.image as { filename?: string } | undefined;
  const rawSrc = asText(img?.filename);
  // Full-bleed background: resize via Storyblok's image service for sharpness.
  const imgSrc = rawSrc.includes('storyblok.com')
    ? `${rawSrc.replace(/\/m\/.*$/, '')}/m/1800x0/filters:quality(85)`
    : rawSrc;
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const caption = asText(blok.caption);

  return (
    <section {...storyblokEditable(blok)} className="plxw m-h after" data-io style={{ height: 760 }}>
      {imgSrc ? (
        // Parallax background needs 130%-tall positioning (.plxw img); plain img
        // keeps that intact and is driven by the scroll handler via `.plx`.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt="" aria-hidden="true" className="plx" style={{ objectPosition: 'center 50%' }} />
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(73,56,46,0) 30%, rgba(73,56,46,0.68) 100%)',
        }}
      />

      <div
        className="wrap"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: 72,
          color: 'var(--ivory)',
        }}
      >
        <h2 className="disp" style={{ color: 'var(--ivory)' }}>
          {lines.map((line, i) => (
            <span key={i} className="ln">
              <span style={{ transitionDelay: `${(i * 0.15).toFixed(2)}s` }}>{renderLine(line)}</span>
            </span>
          ))}
        </h2>
        {caption ? (
          <div className="cap rv" style={{ color: 'var(--gold-light)', marginTop: 28, transitionDelay: '.4s' }}>
            {caption}
          </div>
        ) : null}
      </div>

      <div className="spark" style={{ top: '18%', left: '12%' }} />
      <div className="spark" style={{ top: '32%', right: '18%', animationDelay: '1.4s' }} />
      <div className="spark" style={{ bottom: '30%', right: '8%', animationDelay: '.7s', width: 4, height: 4 }} />
    </section>
  );
}
