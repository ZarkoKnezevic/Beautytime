import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import LocaleLink from '@/components/LocaleLink';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Heading line with `**word**` → gold italic accent (like the hero). */
function renderLine(line: string) {
  return line.split('**').map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="it text-gold-dark gw">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function Icon({ name }: { name: string }) {
  if (name === 'instagram') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === 'whatsapp') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z" />
        <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .4.6 1 1.5 1.8 2.6 2.4.2.1.3.1.4 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.3.5-.1.8-.7 1.5-1.5 1.6-1.3.2-2.9-.5-4.3-1.9-1.4-1.4-2.1-3-1.9-4.3z" />
      </svg>
    );
  }
  if (name === 'arrow') {
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
        <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return null;
}

function CtaButton({ blok }: { blok: StoryblokBlok }) {
  const label = asText(blok.label);
  const icon = asText(blok.icon);
  const variant = asText(blok.variant);
  const { href } = prepareLinkProps({ link: blok.link });
  const external = /^https?:\/\//.test(href);
  const className = `btn${variant === 'solid' ? ' solid' : ''}`;
  const inner = (
    <>
      <Icon name={icon} />
      <span>{label}</span>
    </>
  );
  if (href.startsWith('/')) {
    return (
      <LocaleLink {...storyblokEditable(blok)} href={href} className={className}>
        {inner}
      </LocaleLink>
    );
  }
  return (
    <a
      {...storyblokEditable(blok)}
      href={href || '#'}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  );
}

/**
 * Appointment CTA — mirrors design/site/index.html: a centered, top-ruled
 * block with an ornament, a two-line display headline (gold italic accent),
 * muted body copy and a row of contact buttons (Instagram / WhatsApp).
 */
export default function AppointmentCta({ blok }: { blok: StoryblokBlok }) {
  const lines = asText(blok.heading)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const body = asText(blok.body);
  const buttons = (Array.isArray(blok.buttons) ? blok.buttons : []) as StoryblokBlok[];

  return (
    <section
      {...storyblokEditable(blok)}
      id={asText(blok.anchor) || 'termin'}
      className="wrap after"
      data-io
      style={{
        paddingTop: 'clamp(72px, 14vw, 120px)',
        paddingBottom: 'clamp(84px, 17vw, 160px)',
        borderTop: '1px solid var(--line)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="orn rv" style={{ marginBottom: 40 }} />

      <h2 className="disp">
        {lines.map((line, i) => (
          <span key={i} className="ln">
            <span style={{ transitionDelay: `${(i * 0.14).toFixed(2)}s` }}>{renderLine(line)}</span>
          </span>
        ))}
      </h2>

      {body ? (
        <p className="body muted rv" style={{ maxWidth: 460, margin: '36px 0 0', transitionDelay: '.35s' }}>
          {body}
        </p>
      ) : null}

      {buttons.length ? (
        <div
          className="rv"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40, transitionDelay: '.5s' }}
        >
          {buttons.map((b, i) => (
            <CtaButton key={b._uid ?? i} blok={b} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
