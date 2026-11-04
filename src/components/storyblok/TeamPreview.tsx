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

/** Heading line with `**word**` → gold clip-wipe accent (like the hero). */
function renderLine(line: string) {
  return line.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="it text-gold gw" style={{ fontSize: '1.08em' }}>
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function Member({
  img,
  href,
  delay,
  padTop,
}: {
  img?: { filename?: string; alt?: string };
  href: string;
  delay: string;
  padTop?: boolean;
}) {
  const src = asText(img?.filename);
  const alt = asText(img?.alt);
  return (
    <LocaleLink
      href={href || '#'}
      className="hz"
      style={{ flex: '1 1 0', minWidth: 0, display: 'block', paddingTop: padTop ? 28 : 0 }}
    >
      <div
        className="imgw clip"
        style={{
          aspectRatio: '4 / 5',
          height: 'auto',
          borderRadius: 8,
          boxShadow: '0 0 0 1px var(--surface), 0 18px 40px rgba(73,56,46,.10)',
          transitionDelay: delay,
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 760px) 48vw, 340px"
            className="object-cover"
            style={{ objectPosition: 'center top', transitionDelay: delay }}
          />
        ) : null}
      </div>
    </LocaleLink>
  );
}

/**
 * Team preview — mirrors design/site/index.html: a centered card with an
 * ornament, a headline (line reveal + gold wipe) and italic subtitle, the two
 * founders (clip reveal + hover zoom), the "Beauty — Time" wordmark reveal,
 * and a link. Reveals on scroll.
 */
export default function TeamPreview({ blok }: { blok: StoryblokBlok }) {
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const subtitle = asText(blok.subtitle);
  const imgL = blok.image_left as { filename?: string; alt?: string } | undefined;
  const imgR = blok.image_right as { filename?: string; alt?: string } | undefined;
  const wordLeft = asText(blok.word_left) || 'Beauty';
  const wordRight = asText(blok.word_right) || 'Time';
  const linkLabel = asText(blok.link_label);
  const { href } = prepareLinkProps({ link: blok.link });

  const word = { fontSize: 'clamp(36px, 4.6vw, 64px)', lineHeight: 1, color: 'var(--gold)' };

  return (
    <section {...storyblokEditable(blok)} className="wrap after" data-io style={{ paddingTop: 'clamp(72px, 14vw, 120px)', paddingBottom: 'clamp(80px, 16vw, 150px)' }}>
      <div
        style={{
          position: 'relative',
          background: 'var(--ivory)',
          border: '1px solid var(--surface)',
          borderRadius: 12,
          padding: 'clamp(52px, 10vw, 88px) clamp(20px, 4vw, 64px) clamp(48px, 9vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div className="spark" style={{ top: 44, left: '9%' }} />
        <div className="spark" style={{ top: 120, right: '12%', animationDelay: '1.1s', width: 4, height: 4 }} />
        <div className="spark" style={{ bottom: 150, left: '14%', animationDelay: '2s', width: 4, height: 4 }} />

        <div className="rv" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 36 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'block' }} />
          <span className="orn" style={{ height: 48 }} />
        </div>

        <h2
          style={{
            margin: 0,
            fontWeight: 400,
            fontSize: 'clamp(26px, 3.7vw, 52px)',
            lineHeight: 1.08,
            letterSpacing: '-.03em',
            maxWidth: 1000,
          }}
        >
          {lines.map((line, i) => (
            <span key={i} className="ln">
              <span style={{ transitionDelay: `${(i * 0.15).toFixed(2)}s` }}>{renderLine(line)}</span>
            </span>
          ))}
        </h2>

        {subtitle ? (
          <div
            className="it rv"
            style={{ fontSize: 'clamp(26px, 3.2vw, 44px)', color: 'var(--gold)', lineHeight: 1.1, marginTop: 10, transitionDelay: '.2s' }}
          >
            {subtitle}
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 48, width: '100%', maxWidth: 720 }}>
          <Member img={imgL} href={href} delay=".3s" />
          <Member img={imgR} href={href} delay=".5s" padTop />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32, width: '100%', maxWidth: 900, marginTop: 48 }}>
          <span className="it wl" data-io style={word}>
            {wordLeft}
          </span>
          <span
            className="rule"
            data-io
            aria-hidden="true"
            style={{ background: 'linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold))' }}
          />
          <span className="it wr" data-io style={word}>
            {wordRight}
          </span>
        </div>

        {href && linkLabel ? (
          <LocaleLink
            href={href}
            className="ul rv"
            style={{ marginTop: 52, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 10, transitionDelay: '.9s' }}
          >
            <span className="ul-t">{linkLabel}</span>
            <Arrow />
          </LocaleLink>
        ) : null}
      </div>
    </section>
  );
}
