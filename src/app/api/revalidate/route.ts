import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { STORYBLOK_CACHE_TAG } from '@/lib/storyblok/utils';
import { LOCALES, localizeHref, storyPath } from '@/utils/i18n';

const GLOBAL_STORIES = new Set(['settings', 'global']);

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * On-demand revalidation endpoint for Storyblok's "story published/unpublished"
 * webhooks. Authenticate either with `?secret=` (the secret configured in
 * SB_WEBHOOK_REVALIDATE_SECRET) or with Storyblok's `webhook-signature`
 * header (HMAC-SHA1 of the raw body with that same secret).
 *
 * Every Storyblok fetch is cached under one tag, so one tag revalidation
 * refreshes stories, global settings and the cache version together; the
 * story's own URLs (both locales) are revalidated explicitly as well.
 */
export async function POST(request: Request) {
  const secret = process.env.SB_WEBHOOK_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: 'Revalidation is not configured' }, { status: 500 });
  }

  const raw = await request.text();
  const signature = request.headers.get('webhook-signature');
  const querySecret = new URL(request.url).searchParams.get('secret') || '';
  const authorized = signature
    ? safeEqual(signature, createHmac('sha1', secret).update(raw).digest('hex'))
    : safeEqual(querySecret, secret);

  if (!authorized) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let payload: { full_slug?: unknown } = {};
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  revalidateTag(STORYBLOK_CACHE_TAG, 'max');

  const fullSlug = typeof payload.full_slug === 'string' ? payload.full_slug : '';
  const paths: string[] = [];

  if (!fullSlug || GLOBAL_STORIES.has(fullSlug)) {
    // Header/footer live in every page: revalidate both locale trees.
    for (const locale of LOCALES) {
      const root = localizeHref('/', locale);
      revalidatePath(root, 'layout');
      paths.push(`${root} (layout)`);
    }
  } else {
    const path = storyPath(fullSlug);
    for (const locale of LOCALES) {
      const href = localizeHref(path, locale);
      revalidatePath(href);
      paths.push(href);
    }
  }

  return Response.json({ revalidated: true, tag: STORYBLOK_CACHE_TAG, paths });
}
