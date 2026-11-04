import SiteShell, { siteMetadata } from '@/components/site/SiteShell';

export const metadata = siteMetadata('de');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="de">{children}</SiteShell>;
}
