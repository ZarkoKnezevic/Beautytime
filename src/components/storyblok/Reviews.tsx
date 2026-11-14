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

const SOURCE_LABEL: Record<Locale, string> = {
  de: 'Google-Rezension',
  en: 'Google review',
};

/** The multi-colour Google "G" badge shown on each review avatar. */
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function ReviewCard({ item, delay, locale }: { item: StoryblokBlok; delay: string; locale: Locale }) {
  const quote = asText(item.quote);
  const name = asText(item.name);
  const source = asText(item.source) || SOURCE_LABEL[locale];
  const rating = Number(item.rating) || 5;
  const avatar = asText((item.avatar as { filename?: string } | undefined)?.filename);
  const initial = name.trim().charAt(0).toUpperCase();
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
      <figcaption className="rvw">
        <span className="rav">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" />
          ) : (
            <span className="rav-ph">{initial}</span>
          )}
          <span className="rav-g" title="Google">
            <GoogleG />
          </span>
        </span>
        <span className="rvw-tx">
          {name ? <span className="rvw-n">{name}</span> : null}
          {source ? <span className="rvw-s">{source}</span> : null}
        </span>
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
