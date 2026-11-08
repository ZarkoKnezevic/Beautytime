'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { storyblokEditable } from '@storyblok/js';
import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import {
  cn,
  localizeHref,
  switchLocaleHref,
  otherLocale,
  DEFAULT_LOCALE,
  type Locale,
} from '@/utils';
import { SITE_META } from '@/constants';
import type { StoryblokBlok, StoryblokLink } from '@/types';

interface HeaderProps {
  blok: StoryblokBlok;
  footer?: StoryblokBlok | null;
  allResolvedLinks?: StoryblokLink[];
  locale?: Locale;
}

function Arrow() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconInstagram({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconWhatsapp({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z" />
      <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .4.6 1 1.5 1.8 2.6 2.4.2.1.3.1.4 0l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.3.5-.1.8-.7 1.5-1.5 1.6-1.3.2-2.9-.5-4.3-1.9-1.4-1.4-2.1-3-1.9-4.3z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path
        d="M8 13h.01M12 13h.01M16 13h.01M8 16.5h.01M12 16.5h.01"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function norm(p: string) {
  return p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p;
}

/** Only render string values as text — never a raw CMS object. */
const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Accessible-name strings per locale (visible labels come from the CMS). */
const UI = {
  de: {
    nav: 'Hauptnavigation',
    menu: 'Menü',
    open: 'Menü öffnen',
    close: 'Menü schließen',
    home: 'Startseite',
    switchTo: 'English',
  },
  en: {
    nav: 'Main navigation',
    menu: 'Menu',
    open: 'Open menu',
    close: 'Close menu',
    home: 'Home',
    switchTo: 'Deutsch',
  },
} as const;

const FOCUSABLE = 'a[href], button:not([disabled])';

/** Stagger helper: sets the `--d` custom property used by the menu reveal. */
const dStyle = (d: number) => ({ '--d': `${d.toFixed(2)}s` }) as CSSProperties;

/**
 * Global site header. Desktop (> 600px): logo + inline nav + EN switch.
 * Phone (<= 600px): logo + social icons + burger → dark slide-in menu,
 * mirroring design/site/index.html.
 */
export default function Header({
  blok,
  footer,
  allResolvedLinks = [],
  locale = DEFAULT_LOCALE,
}: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const t = UI[locale];

  const isActive = (href: string) => !!href && norm(pathname) === norm(href);
  const loc = (href: string) => localizeHref(href, locale);

  const home = loc(
    prepareLinkProps(blok.home_link ? { link: blok.home_link } : undefined, allResolvedLinks)
      .href || '/'
  );
  const logoSrc = asText(blok.logo?.filename);
  const homeLabel = asText(blok.logo_label) || t.home;
  // The link carries the accessible name; the logo inside it is decorative.
  const homeName = `${SITE_META[locale].siteName} – ${homeLabel}`;
  const ctaLabel = asText(blok.cta_label);
  const cta = prepareLinkProps(
    blok.cta_link ? { link: blok.cta_link, text: ctaLabel } : { text: ctaLabel },
    allResolvedLinks
  );
  // Locale-prefix internal CTA targets (e.g. /leistungen#termin -> /en/leistungen#termin).
  const ctaHref = loc(cta.href || '#');
  // Hide the booking CTA on legal pages (Impressum/Datenschutz): they have no
  // booking block for the #termin anchor to scroll to.
  const isLegalPage = /\/(impressum|datenschutz)\/?$/.test(pathname);
  const showCta = !!cta.text && !isLegalPage;

  const items = (Array.isArray(blok.nav_links) ? (blok.nav_links as StoryblokBlok[]) : []).map(
    (item) => {
      const resolved = prepareLinkProps({ link: item.link, text: item.label }, allResolvedLinks);
      return { uid: item._uid, href: loc(resolved.href || '#'), text: resolved.text };
    }
  );

  // Language switch (current page in the other locale).
  const otherL = otherLocale(locale);
  const langHref = switchLocaleHref(pathname, locale);
  const langLabel = otherL.toUpperCase();
  // WCAG 2.5.3: the accessible name must contain the visible label ("EN").
  const langName = `${langLabel} – ${t.switchTo}`;

  // Menu nav: Home + links + language switch.
  const navEntries = [
    { uid: '__home', href: home || '/', text: homeLabel },
    ...items,
    { uid: '__lang', href: langHref, text: langLabel, lang: otherL },
  ];
  const n = navEntries.length;

  // Contact details for the menu come from the footer blok.
  const fb = (footer || {}) as StoryblokBlok;
  const instagram = prepareLinkProps({ link: fb.instagram_link }, allResolvedLinks);
  const whatsapp = prepareLinkProps({ link: fb.whatsapp_link }, allResolvedLinks);
  const hasIg = !!instagram.href && instagram.href !== '#';
  const hasWa = !!whatsapp.href && whatsapp.href !== '#';
  const hoursTitle = asText(fb.hours_title);
  const hours = asText(fb.hours);
  const addressTitle = asText(fb.address_title);
  const address = asText(fb.address);

  // While the menu is open: lock body scroll, move focus into the dialog,
  // keep Tab inside it, close on Escape, and return focus to the burger.
  useEffect(() => {
    document.body.classList.toggle('mm-lock', open);
    if (!open) return;
    const dialog = dialogRef.current;
    const burger = burgerRef.current;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('mm-lock');
      window.removeEventListener('keydown', onKey);
      burger?.focus();
    };
  }, [open]);

  return (
    <>
      {/* Full-screen dark slide-in menu */}
      <div
        id="mobile-menu"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        aria-hidden={!open}
        className={cn('mm', open && 'open')}
      >
        <div className="mm-top">
          <Link href={home || '/'} onClick={close} className="mr-auto flex" aria-label={homeName}>
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt=""
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            ) : null}
          </Link>
          {hasIg ? (
            <a
              href={instagram.href}
              className="mm-ic"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconInstagram />
            </a>
          ) : null}
          {hasWa ? (
            <a
              href={whatsapp.href}
              className="mm-ic"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconWhatsapp />
            </a>
          ) : null}
          <button
            type="button"
            ref={closeButtonRef}
            className="mm-x"
            aria-label={t.close}
            onClick={close}
          />
        </div>

        <nav className="mm-nav" aria-label={t.menu}>
          {navEntries.map((e, i) =>
            e.uid === '__lang' ? (
              // Full navigation so the root layout re-renders in the new locale
              <a
                key={e.uid}
                href={e.href}
                onClick={close}
                hrefLang={'lang' in e ? e.lang : undefined}
                lang={'lang' in e ? e.lang : undefined}
                aria-label={langName}
                style={dStyle(i * 0.08)}
                className="mi mw"
              >
                {e.text}
              </a>
            ) : (
              <Link
                key={e.uid}
                href={e.href}
                onClick={close}
                style={dStyle(i * 0.08)}
                className={cn('mi mw', isActive(e.href) && 'cur')}
              >
                {e.text}
              </Link>
            )
          )}
        </nav>

        <div className="mm-cta">
          {showCta ? (
            <a
              href={ctaHref}
              onClick={close}
              className="btn solid mi"
              style={dStyle(n * 0.08 + 0.04)}
            >
              <IconCalendar />
              <span>{cta.text}</span>
            </a>
          ) : null}
          {hasIg || hasWa ? (
            <div className="half mi" style={dStyle(n * 0.08 + 0.12)}>
              {hasIg ? (
                <a href={instagram.href} className="btn" target="_blank" rel="noopener noreferrer">
                  <IconInstagram size={17} />
                  <span>Instagram</span>
                </a>
              ) : null}
              {hasWa ? (
                <a href={whatsapp.href} className="btn" target="_blank" rel="noopener noreferrer">
                  <IconWhatsapp size={17} />
                  <span>WhatsApp</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {hours || address ? (
          <div className="mm-info mi" style={dStyle(n * 0.08 + 0.2)}>
            {hoursTitle ? <div className="cap">{hoursTitle}</div> : null}
            {hours ? <div className="whitespace-pre-line">{hours}</div> : null}
            {addressTitle ? (
              <div className="cap" style={{ marginTop: 16 }}>
                {addressTitle}
              </div>
            ) : null}
            {address ? <div className="whitespace-pre-line">{address}</div> : null}
          </div>
        ) : null}
      </div>

      {/* Header bar */}
      <nav
        {...storyblokEditable(blok)}
        className="wrap site-nav"
        data-load
        suppressHydrationWarning
        aria-label={t.nav}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          paddingTop: 28,
          paddingBottom: 28,
        }}
      >
        <Link
          href={home || '/'}
          className="rv flex"
          style={{ transitionDelay: '.1s' }}
          aria-label={homeName}
        >
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt=""
              width={88}
              height={88}
              priority
              className="nav-logo rounded-full object-cover"
            />
          ) : null}
        </Link>

        <div className="nav-right nav-cta rv" style={{ transitionDelay: '.2s' }}>
          <Link href={home || '/'} className={cn('ul text-sm', isActive(home) && 'text-gold-dark')}>
            <span className="ul-t">{homeLabel}</span>
          </Link>
          {items.map((it) => (
            <Link
              key={it.uid}
              href={it.href}
              className={cn('ul text-sm', isActive(it.href) && 'text-gold-dark')}
            >
              <span className="ul-t">{it.text}</span>
            </Link>
          ))}
          {showCta ? (
            <a href={ctaHref} className="ul inline-flex items-center gap-2.5 text-sm">
              <span className="ul-t">{cta.text}</span>
              <Arrow />
            </a>
          ) : null}
          {/* Full navigation so the root layout re-renders in the new locale */}
          <a
            href={langHref}
            className="ul nav-lang"
            hrefLang={otherL}
            lang={otherL}
            aria-label={langName}
          >
            <span className="ul-t">{langLabel}</span>
          </a>
        </div>

        {hasIg ? (
          <a
            href={instagram.href}
            className="mm-ic nav-soc"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconInstagram />
          </a>
        ) : null}
        {hasWa ? (
          <a
            href={whatsapp.href}
            className="mm-ic nav-soc"
            aria-label="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconWhatsapp />
          </a>
        ) : null}
        <button
          type="button"
          ref={burgerRef}
          className="burger rv"
          aria-label={t.open}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
          style={{ transitionDelay: '.3s' }}
        >
          <span />
        </button>
      </nav>
    </>
  );
}
