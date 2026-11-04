/**
 * Minimal cookie-consent store. Two levels: `necessary` (always allowed) and
 * `all` (also permits external embeds that transfer data to third parties —
 * YouTube, Google Maps, etc.). Persisted in localStorage; changes broadcast a
 * `bt-consent-change` event so gated embeds can react without a reload.
 */
export type Consent = 'all' | 'necessary';

const KEY = 'bt-cookie-consent';
export const CONSENT_EVENT = 'bt-consent-change';

export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(KEY);
  return v === 'all' || v === 'necessary' ? v : null;
}

export function setConsent(c: Consent): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, c);
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}

/** Whether data-transferring external embeds (YouTube, Maps, …) may load. */
export function allowsExternal(): boolean {
  return getConsent() === 'all';
}
