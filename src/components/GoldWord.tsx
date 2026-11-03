/**
 * Gold emphasis word as crisp SVG text (Cormorant Garamond italic). The
 * left→right reveal is a CSS `clip-path` wipe on `.gold-word`, triggered by the
 * hero's on-load `.in` (see globals.css). The SVG itself never moves or scales,
 * so its baseline stays aligned with the surrounding text. The word's accessible
 * text lives in the H1's aria-label, so this SVG is aria-hidden.
 */
export default function GoldWord({ word }: { word: string }) {
  return (
    <svg
      className="gold-word"
      viewBox="0 0 360 100"
      preserveAspectRatio="xMinYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <text
        x={4}
        y={82}
        style={{
          fontSize: 94,
          fontStyle: 'italic',
          fontFamily: 'var(--font-serif), Georgia, serif',
          fill: 'var(--gold)',
        }}
      >
        {word}
      </text>
    </svg>
  );
}
