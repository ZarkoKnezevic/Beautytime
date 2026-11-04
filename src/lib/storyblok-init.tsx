// Server-side Storyblok initialization (runs at module load on the server).
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';
import { COMPONENTS } from '@/constants/storyblok-components';
import { env } from '@/utils/env';
import { logger } from '@/utils/logger';

function FallbackComponent({ blok }: { blok?: { component?: string } }) {
  const componentName = blok?.component || 'unknown';

  if (typeof window === 'undefined') {
    logger.error(`Storyblok component "${componentName}" is not registered.`);
    logger.debug('Registered components:', Object.keys(COMPONENTS));
  }

  return (
    <div className="my-4 rounded-lg border border-line bg-ivory p-4">
      <p className="font-medium text-gold-dark">
        ⚠️ Component &quot;{componentName}&quot; is not registered.
      </p>
    </div>
  );
}

if (typeof window === 'undefined') {
  if (!env.storyblok.accessToken) {
    logger.warn('⚠️ Storyblok access token is missing. Set STORYBLOK_ACCESS_TOKEN in .env.local.');
  } else {
    try {
      storyblokInit({
        accessToken: env.storyblok.accessToken,
        use: [apiPlugin],
        components: COMPONENTS,
        enableFallbackComponent: true,
        customFallbackComponent: FallbackComponent,
      });
    } catch (error) {
      logger.error('Error initializing Storyblok:', error);
    }
  }
}
