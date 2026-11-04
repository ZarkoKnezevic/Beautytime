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
 * Philosophy statement (Unser Team) — mirrors design/site/unser-team.html: a
 * full-bleed parallax image (`.plx`, driven by the Reveal scroll handler) under
 * a dark + gold overlay, with a centered eyebrow, a line-reveal heading (gold
 * wipe) and a team statement. Twinkling sparks. Reveals on scroll.
 */
export default function Philosophy({ blok }: { blok: StoryblokBlok }) {
  const img = blok.image as { filename?: string } | undefined;
  const rawSrc = asText(img?.filename);
  const imgSrc = rawSrc.includes('storyblok.com')
    ? `${rawSrc.replace(/\/m\/.*$/, '')}/m/1800x0/filters:quality(85)`
    : rawSrc;
  const eyebrow = asText(blok.eyebrow);
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const body = asText(blok.body);

  return (
    <section {...storyblokEditable(blok)} className="plxw m-h" data-io style={{ height: 680 }}>
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imgSrc} alt="" aria-hidden="true" className="plx" style={{ objectPosition: 'center 50%' }} />
      ) : null}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(73,56,46,0.2) 0%, rgba(73,56,46,0.6) 100%)',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(185,149,82,0.18)', mixBlendMode: 'multiply' }} />

      <div
        className="wrap"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'var(--ivory)',
        }}
      >
        {eyebrow ? (
          <div className="cap rv" style={{ color: 'var(--gold-light)', marginBottom: 28 }}>
            {eyebrow}
          </div>
        ) : null}
        <h2 className="h2" style={{ color: 'var(--ivory)', maxWidth: 900 }}>
          {lines.map((line, i) => (
            <span key={i} className="ln">
              <span style={{ transitionDelay: `${(i * 0.14).toFixed(2)}s` }}>{renderLine(line)}</span>
            </span>
          ))}
        </h2>
        {body ? (
          <p className="body rv" style={{ maxWidth: 520, margin: '32px 0 0', color: '#EDE1D2', transitionDelay: '.4s' }}>
            {body}
          </p>
        ) : null}
      </div>

      <div className="spark" style={{ top: '20%', left: '14%' }} />
      <div className="spark" style={{ top: '70%', right: '16%', animationDelay: '1.1s' }} />
    </section>
  );
}
