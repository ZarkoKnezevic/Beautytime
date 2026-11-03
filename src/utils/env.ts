/**
 * Type-safe access to environment variables with graceful fallbacks.
 */

interface EnvConfig {
  NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN: string;
  NEXT_PUBLIC_STORYBLOK_API_GATE: string;
  STORYBLOK_VERSION: 'draft' | 'published';
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_DOMAIN: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

function getEnvVar(key: keyof EnvConfig, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value && key === 'NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN') {
    if (typeof window === 'undefined') {
      console.warn(
        `⚠️ ${key} is not set. Create a .env.local file with your Storyblok access token.`
      );
    }
  }

  return value || '';
}

export const env = {
  storyblok: {
    accessToken: getEnvVar('NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN'),
    apiGate: getEnvVar('NEXT_PUBLIC_STORYBLOK_API_GATE', 'https://api.storyblok.com/v2/cdn'),
    version: (getEnvVar('STORYBLOK_VERSION', 'draft') || 'draft') as 'draft' | 'published',
  },
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
    domain: getEnvVar('NEXT_PUBLIC_DOMAIN', 'http://localhost:3000'),
  },
  nodeEnv: (process.env.NODE_ENV || 'development') as EnvConfig['NODE_ENV'],
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;
