'use client';

import ErrorContent from '@/components/site/ErrorContent';

export default function Error(props: { error: Error; reset: () => void }) {
  return <ErrorContent {...props} />;
}
