import Image from 'next/image';

interface BrandSealProps {
  /** Text that runs around the ring. */
  ringText: string;
  logoSrc?: string;
  logoAlt?: string;
  /** Outer size in px; the logo scales with it. */
  size?: number;
  /** Unique id for the ring path — needed when two seals share a document. */
  pathId?: string;
  /** Class(es) that drive the rotation; `.spin` is the footer's slow turn. */
  spinClass?: string;
  /** Hide the seal from assistive tech (the parent carries the label). */
  decorative?: boolean;
}

/**
 * The spinning logo ring from the prototype footer (design/site/index.html):
 * serif ring text on a circular path with the round logo in the centre.
 * Shared by the footer and the route loading screen.
 */
export default function BrandSeal({
  ringText,
  logoSrc,
  logoAlt = '',
  size = 168,
  pathId = 'ringpath',
  spinClass = 'spin',
  decorative = false,
}: BrandSealProps) {
  const logoSize = Math.round((size * 96) / 168);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        className={spinClass}
        viewBox="0 0 200 200"
        width={size}
        height={size}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : ringText}
        aria-hidden={decorative || undefined}
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <path id={pathId} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text
          fontSize={26}
          fill="var(--gold-dark)"
          style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontStyle: 'italic' }}
        >
          <textPath href={`#${pathId}`} startOffset="0" textLength={480} lengthAdjust="spacing">
            {ringText}
          </textPath>
        </text>
      </svg>
      {logoSrc ? (
        <Image
          src={logoSrc}
          alt={decorative ? '' : logoAlt}
          width={logoSize}
          height={logoSize}
          className="rounded-full object-cover"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : null}
    </div>
  );
}
