import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { getRequestLocale } from '@/lib/locale';
import type { StoryblokBlok, Locale } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Heading line with `**word**` → gold italic accent (like the hero / team preview). */
function renderLine(line: string) {
  return line.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="it text-gold gw" style={{ fontSize: '1.02em' }}>
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

const RATING_LABEL: Record<Locale, (n: number) => string> = {
  de: (n) => `Bewertung: ${n} von 5 Sternen`,
  en: (n) => `Rating: ${n} out of 5 stars`,
};

function Stars({ rating, locale }: { rating: number; locale: Locale }) {
  const n = Math.max(1, Math.min(5, Math.round(rating) || 5));
  return (
    <div
      role="img"
      aria-label={RATING_LABEL[locale](n)}
      style={{ color: 'var(--gold)', fontSize: 16, letterSpacing: 2 }}
    >
      <span aria-hidden="true">{'★'.repeat(n)}</span>
    </div>
  );
}

function ReviewCard({ item, delay, locale }: { item: StoryblokBlok; delay: string; locale: Locale }) {
  const quote = asText(item.quote);
  const name = asText(item.name);
  const source = asText(item.source) || 'Google';
  const rating = Number(item.rating) || 5;
  return (
    <figure
      {...storyblokEditable(item)}
      className="rv"
      style={{
        margin: 0,
        background: 'var(--ivory)',
        border: '1px solid var(--surface)',
        borderRadius: 16,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transitionDelay: delay,
      }}
    >
      <Stars rating={rating} locale={locale} />
      <blockquote
        className="it"
        style={{ margin: 0, fontSize: 24, lineHeight: 1.25, color: 'var(--text)' }}
      >
        {quote ? `„${quote}“` : ''}
      </blockquote>
      <figcaption className="cap">
        {[name, source].filter(Boolean).join(' · ')}
      </figcaption>
    </figure>
  );
}

/**
 * Reviews — mirrors design/site/index.html: a sticky-feeling two-column block
 * with an eyebrow, line-reveal headline (gold accent), muted subtitle and a
 * Google link on the left, and a grid of five-star review cards on the right.
 */
export default function Reviews({ blok }: { blok: StoryblokBlok }) {
  const locale = getRequestLocale();
  const eyebrow = asText(blok.eyebrow) || 'Bewertungen';
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const subtitle = asText(blok.subtitle);
  const linkLabel = asText(blok.link_label);
  const { href } = prepareLinkProps({ link: blok.link });
  const items = (Array.isArray(blok.items) ? blok.items : []) as StoryblokBlok[];

  return (
    <section
      {...storyblokEditable(blok)}
      className="wrap after"
      data-io
      style={{ paddingTop: 'clamp(24px, 6vw, 40px)', paddingBottom: 'clamp(80px, 16vw, 150px)' }}
    >
      <div className="two" style={{ alignItems: 'start' }}>
        <div
          style={{
            gridColumn: '1 / span 4',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {eyebrow ? <div className="cap rv">{eyebrow}</div> : null}

          <h2 className="h2" style={{ fontSize: 'clamp(32px, 3.6vw, 52px)' }}>
            {lines.map((line, i) => (
              <span key={i} className="ln">
                <span style={{ transitionDelay: `${(i * 0.12).toFixed(2)}s` }}>
                  {renderLine(line)}
                </span>
              </span>
            ))}
          </h2>

          {subtitle ? (
            <p
              className="body muted rv"
              style={{ margin: '6px 0 0', maxWidth: 300, transitionDelay: '.4s' }}
            >
              {subtitle}
            </p>
          ) : null}

          {href && linkLabel ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="ul rv"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 10,
                fontSize: 14,
                transitionDelay: '.5s',
              }}
            >
              <span className="ul-t">{linkLabel}</span>
              <Arrow />
            </a>
          ) : null}
        </div>

        <div className="revs" style={{ gridColumn: '5 / span 8' }}>
          {items.map((item, i) => (
            <ReviewCard
              key={item._uid ?? i}
              item={item}
              locale={locale}
              delay={`${(0.2 + i * 0.15).toFixed(2)}s`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
