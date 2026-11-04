import { prepareLinkProps } from '@/lib/adapters/prepareLinkProps';
import { SITE_META } from '@/constants';
import { env, absoluteUrl, type Locale } from '@/utils';
import type { StoryblokBlok } from '@/types';

const asText = (v: unknown): string => (typeof v === 'string' ? v : '');

/**
 * Parse the footer's free-text address ("Street 1\n1234 City, Country") into
 * schema.org PostalAddress parts. Anything that does not match is left out
 * rather than guessed.
 */
function parseAddress(text: string) {
  const [street = '', cityLine = ''] = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const m = cityLine.match(/^(\d{4,5})\s+([^,]+)/);
  if (!street || !m) return null;
  return {
    '@type': 'PostalAddress',
    streetAddress: street,
    postalCode: m[1],
    addressLocality: m[2].trim(),
    addressCountry: 'AT',
  };
}

/**
 * Structured data for the salon (BeautySalon) and the site (WebSite), built
 * solely from the CMS footer: name, address, phone, e-mail, Instagram, logo.
 * Opening hours, prices and ratings are deliberately not emitted.
 */
export default function JsonLd({
  footer,
  locale,
}: {
  footer: StoryblokBlok | null;
  locale: Locale;
}) {
  const site = SITE_META[locale];
  const url = absoluteUrl(env.app.domain, '/', locale);
  const phone = prepareLinkProps({ link: footer?.phone_link }).href.replace(/^tel:/, '');
  const instagram = prepareLinkProps({ link: footer?.instagram_link }).href;
  const email = asText(footer?.email);
  const logo = asText(footer?.logo?.filename);
  const address = parseAddress(asText(footer?.address));

  const salon = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': `${url}#salon`,
    name: site.siteName,
    description: site.description,
    url,
    ...(logo ? { image: logo, logo } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(address ? { address } : {}),
    ...(instagram && instagram !== '#' ? { sameAs: [instagram] } : {}),
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name: site.siteName,
    url,
    inLanguage: locale === 'de' ? 'de-AT' : 'en',
    publisher: { '@id': salon['@id'] },
  };

  // `<` is escaped so CMS text can never close the script tag.
  const json = JSON.stringify([salon, website]).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
