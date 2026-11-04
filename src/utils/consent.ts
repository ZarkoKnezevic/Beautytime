/**
 * Minimal cookie-consent store. Two levels: `necessary` (always allowed) and
 * `all` (also permits external embeds that transfer data to third parties —
 * YouTube, Google Maps, etc.). Persisted in localStorage; changes broadcast a
 * `bt-consent-change` event so gated embeds can react without a reload.
 * Storage access is wrapped: private windows or blocked site data must not
 * break the page.
 */
export type Consent = 'all' | 'necessary';

const KEY = 'bt-cookie-consent';
export const CONSENT_EVENT = 'bt-consent-change';

export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'all' || v === 'necessary' ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(c: Consent): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, c);
  } catch {
    // Storage unavailable: the choice applies for this page view only.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}

/** Subscribe to consent changes (for useSyncExternalStore). */
export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

/** Whether data-transferring external embeds (YouTube, Maps, …) may load. */
export function allowsExternal(): boolean {
  return getConsent() === 'all';
}
