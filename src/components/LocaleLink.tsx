'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

/**
 * Locale-aware link for Storyblok-rendered blocks (which don't receive the
 * `locale` prop). Reads the current pathname and prefixes internal hrefs with
 * `/en` when browsing the English site. External links (http, tel, mailto, #)
 * and already-prefixed hrefs are left untouched.
 */
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const isEn = pathname === '/en' || pathname.startsWith('/en/');

  let h = href;
  if (
    isEn &&
    typeof href === 'string' &&
    href.startsWith('/') &&
    href !== '/en' &&
    !href.startsWith('/en/')
  ) {
    h = href === '/' ? '/en' : `/en${href}`;
  }

  return <Link href={h} {...rest} />;
}
