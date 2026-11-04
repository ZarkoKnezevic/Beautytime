import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { isValidPreviewRequest } from '@/lib/storyblok/preview';
import { parseLocaleFromSlug, localizeHref } from '@/utils/i18n';

type Context = { params: Promise<{ slug?: string[] }> };

/**
 * Entry point for the Storyblok visual editor. Set the editor's preview
 * location to `https://<domain>/api/preview/`; Storyblok appends the story
 * slug and its signature. A valid signature starts a draft-mode session (so
 * links clicked inside the preview keep working) and redirects to /live-preview.
 */
export async function GET(request: NextRequest, context: Context) {
  const { searchParams } = request.nextUrl;

  if (!isValidPreviewRequest(searchParams)) {
    return NextResponse.json({ error: 'Invalid or expired preview signature' }, { status: 401 });
  }

  (await draftMode()).enable();

  // Storyblok prefixes translated previews with the language code (`en/...`);
  // each locale has its own preview route under its root layout.
  const { slug = [] } = await context.params;
  const { locale, rest } = parseLocaleFromSlug(slug);
  const target = request.nextUrl.clone();
  target.pathname = localizeHref(['/live-preview', ...rest].join('/'), locale);

  return NextResponse.redirect(target);
}
