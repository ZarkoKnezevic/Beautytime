import { storyblokEditable } from '@storyblok/react/rsc';
import { renderRichText, type RichTextField } from '@/lib/renderRichText';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Legal page (Impressum / Datenschutz) — a readable single-column layout with
 * an eyebrow, a display heading and a rich-text body.
 */
export default function LegalPage({ blok }: { blok: StoryblokBlok }) {
  const eyebrow = asText(blok.eyebrow);
  const title = asText(blok.title);
  const body = blok.body as RichTextField | undefined;

  return (
    <section
      {...storyblokEditable(blok)}
      className="wrap"
      data-io
      style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(80px, 14vw, 140px)' }}
    >
      <div style={{ maxWidth: 820 }}>
        {eyebrow ? (
          <div className="cap rv" style={{ marginBottom: 24 }}>
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <h1 className="disp" style={{ fontSize: 'clamp(40px, 6vw, 84px)', marginBottom: 48 }}>
            <span className="ln">
              <span style={{ transitionDelay: '.1s' }}>{title}</span>
            </span>
          </h1>
        ) : null}
        <div className="legal rv" style={{ transitionDelay: '.2s' }}>
          {renderRichText(body)}
        </div>
      </div>
    </section>
  );
}
