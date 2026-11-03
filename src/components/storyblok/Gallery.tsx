import Image from 'next/image';
import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

type Img = { filename?: string; alt?: string } | undefined;

function GalImg({ img, delay, sizes }: { img: Img; delay: string; sizes: string }) {
  const src = asText(img?.filename);
  const alt = asText(img?.alt);
  return (
    <div className="imgw clip" style={{ transitionDelay: delay }}>
      {src ? (
        <Image src={src} alt={alt} fill quality={90} sizes={sizes} className="object-cover" />
      ) : null}
    </div>
  );
}

/**
 * Gallery collage — mirrors design/site/index.html: a pinned stage (scroll
 * drives the pin + side-photo parallax + centre-photo scale via Reveal.tsx),
 * ending with the "Follow us" Instagram square. Falls back to a flat layout on
 * short viewports / reduced motion.
 */
export default function Gallery({ blok }: { blok: StoryblokBlok }) {
  const main = blok.image_main as Img;
  const i1 = blok.image_1 as Img;
  const i2 = blok.image_2 as Img;
  const i3 = blok.image_3 as Img;
  const i4 = blok.image_4 as Img;
  const followLabel = asText(blok.follow_label) || 'Follow us';
  const { href: ig } = prepareLinkProps({ link: blok.instagram_link });

  return (
    <section {...storyblokEditable(blok)} className="gal after" data-io>
      <div className="gal-pin">
        <div className="gal-stage">
          <div className="gl gl-2" data-gl="0.55">
            <GalImg img={i2} delay=".35s" sizes="190px" />
          </div>
          <div className="gl gl-main" data-gl="0.2">
            <GalImg img={main} delay=".1s" sizes="(max-width: 760px) 62vw, 440px" />
          </div>
          <div className="gl gl-1" data-gl="0.4">
            <GalImg img={i1} delay=".25s" sizes="320px" />
          </div>
          <div className="gl gl-3" data-gl="0.7">
            <GalImg img={i3} delay=".45s" sizes="(max-width: 760px) 40vw, 250px" />
          </div>
          <div className="gl gl-4" data-gl="0.3">
            <GalImg img={i4} delay=".55s" sizes="170px" />
          </div>

          {ig && ig !== '#' ? (
            <a href={ig} className="gal-ig" target="_blank" rel="noopener noreferrer">
              <span className="it">{followLabel}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
