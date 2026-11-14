import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Heading line with `**word**` → gold italic accent (like the other sections). */
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

/** Klarna wordmark (their pink badge) or the Traun-voucher card icon. */
function PayIcon({ kind }: { kind: string }) {
  if (kind === 'klarna') {
    return (
      <div className="pay-ic">
        <span className="kl" aria-label="Klarna">
          Klarna.
        </span>
      </div>
    );
  }
  return (
    <div className="pay-ic pay-ic-v">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4z" />
        <path d="M14.5 7.5v9" strokeDasharray="1.5 2" />
        <path d="m7 14 4-4" />
        <circle cx="7.5" cy="10.5" r=".6" fill="currentColor" />
        <circle cx="10.5" cy="13.5" r=".6" fill="currentColor" />
      </svg>
    </div>
  );
}

function PayItem({ item }: { item: StoryblokBlok }) {
  const title = asText(item.title);
  const text = asText(item.text);
  const linkLabel = asText(item.link_label);
  const { href } = prepareLinkProps({ link: item.link });
  const external = /^https?:\/\//.test(href);
  return (
    <div className="pay-item rv" {...storyblokEditable(item)}>
      <PayIcon kind={asText(item.icon)} />
      <div>
        <h3>{title}</h3>
        <p>
          {text}
          {href && linkLabel ? (
            <>
              {' '}
              <a
                href={href}
                className="ul"
                style={{ color: 'var(--gold-dark)' }}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {linkLabel}
              </a>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

/**
 * Payment block (Bezahlen & sparen) — mirrors design/site/index.html: a
 * two-column section with editable copy + payment options (Klarna instalments,
 * Traun voucher) on the left, and a decorative phone-checkout mock-up on the
 * right. The mock-up is purely illustrative (aria-hidden).
 */
export default function PaymentBlock({ blok }: { blok: StoryblokBlok }) {
  const eyebrow = asText(blok.eyebrow);
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const body = asText(blok.body);
  const note = asText(blok.note);
  const items = (Array.isArray(blok.items) ? blok.items : []) as StoryblokBlok[];

  return (
    <section
      {...storyblokEditable(blok)}
      className="wrap after pay"
      data-io
      style={{
        paddingTop: 'clamp(80px, 15vw, 130px)',
        paddingBottom: 'clamp(80px, 15vw, 130px)',
        borderTop: '1px solid var(--line)',
      }}
    >
      <div className="two" style={{ alignItems: 'center' }}>
        <div style={{ gridColumn: '1 / span 6' }}>
          {eyebrow ? <div className="cap rv">{eyebrow}</div> : null}
          <h2 className="h2" style={{ marginTop: 20 }}>
            {lines.map((line, i) => (
              <span key={i} className="ln" style={{ transitionDelay: `${(0.1 + i * 0.12).toFixed(2)}s` }}>
                <span>{renderLine(line)}</span>
              </span>
            ))}
          </h2>
          {body ? (
            <p className="body muted rv" style={{ maxWidth: 480, margin: '32px 0 0', transitionDelay: '.35s' }}>
              {body}
            </p>
          ) : null}
          {items.length ? (
            <div className="pay-list">
              {items.map((item, i) => (
                <PayItem key={item._uid ?? i} item={item} />
              ))}
            </div>
          ) : null}
          {note ? (
            <p className="pay-note rv" style={{ transitionDelay: '.7s' }}>
              {note}
            </p>
          ) : null}
        </div>

        <div style={{ gridColumn: '8 / span 5', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div className="pay-glow" aria-hidden="true" />
          <div className="phone rv" style={{ transitionDelay: '.2s' }} aria-hidden="true">
            <span className="phone-btn phone-btn-a" />
            <span className="phone-btn phone-btn-b" />
            <span className="phone-btn phone-btn-c" />
            <div className="phone-screen ps-ui">
              <span className="phone-island" />
              <div className="ps-bar">
                <span>9:41</span>
                <span className="ps-sig">
                  <i />
                  <i />
                  <i />
                  <b />
                </span>
              </div>
              <div className="ps-head ps-in" style={{ '--d': '.35s' } as React.CSSProperties}>
                <span className="ps-logo" />
                <div>
                  <div className="ps-cap">Beautytime Traun</div>
                  <div className="ps-title">Bezahlen</div>
                </div>
              </div>
              <div className="ps-card ps-in" style={{ '--d': '.5s' } as React.CSSProperties}>
                <div className="ps-cap">Deine Behandlung</div>
                <div className="ps-line">
                  <span>Keratinbehandlung</span>
                  <span>€ 179,–</span>
                </div>
                <div className="ps-line ps-total">
                  <span>Gesamt</span>
                  <span>€ 179,–</span>
                </div>
              </div>
              <div className="ps-cap ps-in" style={{ '--d': '.6s', margin: '4px 0 -2px 4px' } as React.CSSProperties}>
                Zahlungsart
              </div>
              <div className="ps-card ps-opt ps-in" style={{ '--d': '.7s' } as React.CSSProperties}>
                <span className="ps-tk">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
                    <path d="M3 8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a2 2 0 0 0 0 4v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a2 2 0 0 0 0-4z" />
                    <path d="M14.5 7.5v9" strokeDasharray="1.5 2" />
                  </svg>
                </span>
                <div>
                  <div className="ps-k1">Traun-Gutschein</div>
                  <div className="ps-k2">10&nbsp;% von der Stadt Traun gefördert</div>
                </div>
                <span className="ps-radio" />
              </div>
              <div className="ps-card ps-klarna ps-in" style={{ '--d': '.85s' } as React.CSSProperties}>
                <div className="ps-row">
                  <span className="kl" aria-label="Klarna">
                    Klarna.
                  </span>
                  <span className="ps-check" />
                </div>
                <div className="ps-k1">In Raten bezahlen</div>
                <div className="ps-k2">Verfügbar ab 100 € Einkaufswert</div>
                <div className="ps-steps">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="ps-btn ps-in" style={{ '--d': '1s' } as React.CSSProperties}>
                Mit Klarna bezahlen
              </div>
              <div className="ps-stamp">
                <span>
                  Traun-
                  <br />
                  Gutschein
                </span>
                <b>10&nbsp;%</b>
                <span>gefördert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
