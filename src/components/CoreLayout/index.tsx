import { DataContextProvider } from '@/components/DataContext';
import type { StoryblokLink } from '@/types';

interface ICoreLayoutProps {
  children: React.ReactNode;
  allResolvedLinks?: StoryblokLink[];
}

/**
 * Per-page wrapper that exposes the story's resolved link tree to client
 * components via DataContext.
 */
export default function CoreLayout({ children, allResolvedLinks = [] }: ICoreLayoutProps) {
  return <DataContextProvider allResolvedLinks={allResolvedLinks}>{children}</DataContextProvider>;
}
