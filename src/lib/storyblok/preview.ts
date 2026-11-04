import { createHash } from 'node:crypto';
import { env } from '@/utils/env';

/** Storyblok visual-editor requests are valid for one hour after they were signed. */
const MAX_AGE_SECONDS = 60 * 60;

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || '';

/**
 * Validate the `_storyblok_tk[...]` signature the Storyblok visual editor
 * appends to every preview URL: `sha1("<space_id>:<preview_token>:<timestamp>")`.
 * Without the Preview token nobody can forge it, so this gates draft content
 * to the editor. See https://www.storyblok.com/docs/guide/essentials/visual-editor#preview-urls
 */
export function isValidPreviewRequest(params: SearchParams | URLSearchParams): boolean {
  const get = (key: string) =>
    params instanceof URLSearchParams ? params.get(key) || '' : first(params[key]);

  const spaceId = get('_storyblok_tk[space_id]');
  const timestamp = get('_storyblok_tk[timestamp]');
  const token = get('_storyblok_tk[token]');
  const secret = env.storyblok.previewToken;

  if (!spaceId || !timestamp || !token || !secret) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || ts < Math.floor(Date.now() / 1000) - MAX_AGE_SECONDS) return false;

  const expected = createHash('sha1').update(`${spaceId}:${secret}:${ts}`).digest('hex');
  return expected.length === token.length && expected === token;
}
