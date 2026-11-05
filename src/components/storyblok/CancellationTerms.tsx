import { storyblokEditable } from '@storyblok/react/rsc';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Cancellation terms (Stornobedingungen) — mirrors design/site/leistungen.html:
 * a two-column section with an eyebrow + heading + intro on the left, and a fee
 * table, a grid of labelled notes and a gold closing line on the right.
 */
export default function CancellationTerms({ blok }: { blok: StoryblokBlok }) {
  const eyebrow = asText(blok.eyebrow);
  const title = asText(blok.title);
  const intro = asText(blok.intro);
  const headLeft = asText(blok.head_left) || 'Absage / Nichterscheinen';
  const headRight = asText(blok.head_right) || 'Stornogebühr';
  const rows = (Array.isArray(blok.rows) ? blok.rows : []) as StoryblokBlok[];
  const notes = (Array.isArray(blok.notes) ? blok.notes : []) as StoryblokBlok[];
  const outro = asText(blok.outro);
  const id = asText(blok.anchor) || 'storno';

  return (
    <section {...storyblokEditable(blok)} className="wrap cat two" data-io id={id}>
      <div style={{ gridColumn: '1 / span 5' }}>
        {eyebrow ? (
          <div className="cap rv" style={{ marginBottom: 0 }}>
            {eyebrow}
          </div>
        ) : null}
        <h2 className="h2" style={{ marginTop: 20 }}>
          <span className="ln" style={{ transitionDelay: '.1s' }}>
            <span>{title}</span>
          </span>
        </h2>
        {intro ? (
          <p className="body muted rv" style={{ maxWidth: 420, margin: '28px 0 0', transitionDelay: '.25s' }}>
            {intro}
          </p>
        ) : null}
      </div>

      <div style={{ gridColumn: '7 / span 6' }}>
        {rows.length ? (
          <div className="rv" style={{ transitionDelay: '.35s' }}>
            <div className="row st-head">
              <span>{headLeft}</span>
              <span>{headRight}</span>
            </div>
            {rows.map((row, i) => (
              <div className="row st" key={row._uid ?? i} {...storyblokEditable(row)}>
                <span>{asText(row.label)}</span>
                <span className="it pr">{asText(row.price)}</span>
              </div>
            ))}
          </div>
        ) : null}

        {notes.length ? (
          <div className="st-notes rv" style={{ transitionDelay: '.5s' }}>
            {notes.map((note, i) => (
              <div key={note._uid ?? i} {...storyblokEditable(note)}>
                <div className="cap">{asText(note.label)}</div>
                <p>{asText(note.text)}</p>
              </div>
            ))}
          </div>
        ) : null}

        {outro ? (
          <p
            className="gb it rv"
            style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 700,
              lineHeight: 1.25,
              color: 'var(--gold)',
              margin: '48px 0 0',
              transitionDelay: '.6s',
            }}
          >
            {outro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
