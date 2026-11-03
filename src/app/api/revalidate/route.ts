import { revalidatePath } from 'next/cache';

/**
 * On-demand revalidation endpoint for Storyblok webhooks.
 * POST /api/revalidate?secret=... with the webhook JSON body.
 */
export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (!data || !secret) {
    return Response.json({ error: 'No body or secret provided' }, { status: 400 });
  }

  if (secret !== process.env.SB_WEBHOOK_REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const correctSlug = data.full_slug === 'home' ? '/' : `/${data.full_slug}`;

  revalidatePath(correctSlug, 'page');

  return Response.json({ revalidated: true, path: correctSlug });
}
