'use client';

import { createContext, use } from 'react';
import type { StoryblokLink } from '@/types';

interface IDataContextValues {
  allResolvedLinks: StoryblokLink[];
}

interface IDataContextProviderProps {
  children: React.ReactNode;
  allResolvedLinks?: StoryblokLink[];
}

export const DataContext = createContext<IDataContextValues>({
  allResolvedLinks: [],
});

/**
 * Provides the resolved Storyblok link tree so internal story links can be
 * turned into hrefs (see prepareLinkProps).
 */
export function DataContextProvider({
  children,
  allResolvedLinks = [],
}: IDataContextProviderProps) {
  return (
    <DataContext.Provider value={{ allResolvedLinks }}>{children}</DataContext.Provider>
  );
}

export const useDataContext = () => use(DataContext);
