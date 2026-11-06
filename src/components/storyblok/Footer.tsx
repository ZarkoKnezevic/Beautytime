import Link from 'next/link';
import { storyblokEditable } from '@storyblok/react/rsc';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { localizeHref, DEFAULT_LOCALE, type Locale } from '@/utils';
import { SITE_META } from '@/constants';
import CookieSettingsLink from '@/components/CookieSettingsLink';
import BrandSeal from '@/components/site/BrandSeal';
import type { StoryblokBlok, StoryblokLink } from '@/types';

interface FooterProps {
  blok: StoryblokBlok;
  allResolvedLinks?: StoryblokLink[];
  locale?: Locale;
}

/** Only render string values as text — never a raw CMS object. */
const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Global site footer. Mirrors the prototype's footer
 * (design/site/index.html): spinning logo ring, navigation, contact,
 * opening hours, and the legal bar.
 */
export default function Footer({
  blok,
  allResolvedLinks = [],
  locale = DEFAULT_LOCALE,
}: FooterProps) {
  const loc = (href: string) => localizeHref(href, locale);
  const logoSrc = asText(blok.logo?.filename);
  const logoAlt = SITE_META[locale].siteName;
  const ringText = asText(blok.ring_text) || 'Die beste Zeit ist BeautyTime.';
  const navLinks = (Array.isArray(blok.nav_links) ? blok.nav_links : []) as StoryblokBlok[];
  const legalLinks = (Array.isArray(blok.legal_links) ? blok.legal_links : []) as StoryblokBlok[];

  const phone = prepareLinkProps(
    { link: blok.phone_link, text: asText(blok.phone_label) },
    allResolvedLinks
  );
  const instagram = prepareLinkProps(
    { link: blok.instagram_link, text: asText(blok.instagram_label) },
    allResolvedLinks
  );
  const email = asText(blok.email);
  const address = asText(blok.address);
  const hours = asText(blok.hours);
  const navTitle = asText(blok.nav_title);
  const contactTitle = asText(blok.contact_title);
  const hoursTitle = asText(blok.hours_title);
  const copyright = asText(blok.copyright);

  return (
    <footer
      {...storyblokEditable(blok)}
      className="after"
      data-io
      style={{ background: '#EDE1D2', paddingTop: 'clamp(56px, 12vw, 96px)', paddingBottom: 32 }}
    >
      <div className="wrap">
        <div className="two" style={{ rowGap: 40 }}>
          {/* Logo ring */}
          <div
            className="rv flex flex-col gap-4"
            style={{ gridColumn: '1 / span 4' }}
          >
            <BrandSeal ringText={ringText} logoSrc={logoSrc} logoAlt={logoAlt} />
          </div>

          {/* Navigation */}
          {navLinks.length > 0 ? (
            <div
              className="rv flex flex-col gap-3"
              style={{ gridColumn: '5 / span 2', transitionDelay: '.1s' }}
            >
              {navTitle ? <h2 className="cap">{navTitle}</h2> : null}
              {navLinks.map((item) => {
                const resolved = prepareLinkProps(
                  { link: item.link, text: item.label },
                  allResolvedLinks
                );
                return (
                  <Link key={item._uid} href={loc(resolved.href || '#')} className="ul text-[15px]">
                    <span className="ul-t">{resolved.text}</span>
                  </Link>
                );
              })}
            </div>
          ) : null}

          {/* Contact */}
          <div
            className="rv flex flex-col gap-3"
            style={{ gridColumn: '7 / span 3', transitionDelay: '.2s' }}
          >
            {contactTitle ? <h2 className="cap">{contactTitle}</h2> : null}
            {phone.text ? (
              <a href={phone.href || '#'} className="ul text-[15px]">
                <span className="ul-t">{phone.text}</span>
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="ul text-[15px]">
                <span className="ul-t">{email}</span>
              </a>
            ) : null}
            {instagram.text ? (
              <a
                href={instagram.href || '#'}
                className="ul text-[15px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="ul-t">{instagram.text}</span>
              </a>
            ) : null}
            {address ? (
              <div className="mt-2 whitespace-pre-line text-[15px] leading-normal">{address}</div>
            ) : null}
          </div>

          {/* Opening hours */}
          <div
            className="rv flex flex-col gap-3"
            style={{ gridColumn: '10 / span 3', transitionDelay: '.3s' }}
          >
            {hoursTitle ? <h2 className="cap">{hoursTitle}</h2> : null}
            {hours ? (
              <div className="whitespace-pre-line text-[15px] leading-relaxed">{hours}</div>
            ) : null}
          </div>
        </div>

        {/* Legal bar */}
        <div
          className="rv flex flex-wrap justify-between gap-4 border-t border-line pt-5"
          style={{ marginTop: 72, transitionDelay: '.4s' }}
        >
          {copyright ? <div className="cap">{copyright}</div> : null}
          <div className="legal-links flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((item) => {
              const resolved = prepareLinkProps(
                { link: item.link, text: item.label },
                allResolvedLinks
              );
              return (
                <Link key={item._uid} href={loc(resolved.href || '#')} className="cap ul">
                  {resolved.text}
                </Link>
              );
            })}
            <CookieSettingsLink locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}
