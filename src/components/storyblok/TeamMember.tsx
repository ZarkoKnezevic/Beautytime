import Image from 'next/image';
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

/**
 * Team member (Unser Team) — mirrors design/site/unser-team.html: a two-column
 * article with a framed portrait (hover zoom + gold underline + expanding
 * frame) and the member's name (gold italic, slides on hover), role, bio and an
 * Instagram link. `image_side` alternates left/right.
 */
export default function TeamMember({ blok }: { blok: StoryblokBlok }) {
  const name = asText(blok.name);
  const role = asText(blok.role);
  const bio = asText(blok.bio);
  const image = blok.image as { filename?: string; alt?: string } | undefined;
  const imageLeft = asText(blok.image_side) !== 'right';
  const igLabel = asText(blok.instagram_label) || 'Instagram';
  const { href: igHref } = prepareLinkProps({ link: blok.instagram_link });

  const imageCol = imageLeft ? '1 / span 6' : '7 / span 6';
  const textCol = imageLeft ? '8 / span 5' : '1 / span 5';

  const src = asText(image?.filename);
  const alt = asText(image?.alt) || name;

  const imageBlock = (
    <div style={{ gridColumn: imageCol, position: 'relative' }}>
      <div className="imgw clip" style={{ aspectRatio: '4 / 5', height: 'auto' }}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            quality={90}
            sizes="(max-width: 760px) 100vw, (max-width: 1440px) 48vw, 640px"
            className="object-cover"
            style={{ objectPosition: 'center top' }}
          />
        ) : null}
        <div className="frame" />
        <div className="gold" />
      </div>
    </div>
  );

  const textBlock = (
    <div style={{ gridColumn: textCol }}>
      <h2 className="h2 nm" style={{ marginTop: 0 }} aria-label={name}>
        <span className="ln" aria-hidden="true">
          <span style={{ transitionDelay: '.1s' }}>
            <span className="gw">{name}</span>
          </span>
        </span>
      </h2>
      {role ? (
        <div className="cap rv" style={{ marginTop: 20, transitionDelay: '.25s' }}>
          {role}
        </div>
      ) : null}
      {bio ? (
        <p className="body rv" style={{ maxWidth: 440, margin: '32px 0 0', transitionDelay: '.35s' }}>
          {bio}
        </p>
      ) : null}
      {igHref && igHref !== '#' ? (
        <a
          href={igHref}
          className="ul rv"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 36, fontSize: 15, transitionDelay: '.5s' }}
        >
          <span className="ul-t">{igLabel}</span>
          <Arrow />
        </a>
      ) : null}
    </div>
  );

  return (
    <article {...storyblokEditable(blok)} className="wrap member two" data-io style={{ alignItems: 'center' }}>
      {imageLeft ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </article>
  );
}
