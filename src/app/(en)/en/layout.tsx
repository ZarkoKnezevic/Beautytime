import SiteShell, { siteMetadata } from '@/components/site/SiteShell';

export const metadata = siteMetadata('en');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
