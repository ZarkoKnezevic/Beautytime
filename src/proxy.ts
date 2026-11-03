import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Expose the current pathname + locale to Server Components via forwarded
 * request headers (readable with `headers()` in the root layout) and a cookie.
 * (Next.js 16 "proxy" convention — replaces the deprecated "middleware" file.)
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('x-locale', locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.cookies.set('x-pathname', pathname, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  });
  response.headers.set('x-pathname', pathname);
  response.headers.set('x-locale', locale);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
