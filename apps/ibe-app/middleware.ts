import { NextRequest, NextResponse } from 'next/server';
import {
  defaultLocale,
  localeCookieName,
  localeToPrefix,
  resolveLocaleFromSegment,
} from './lib/i18n/index';

/**
 * Canonicalizes routes to locale-prefixed URLs such as /en and /ja.
 * Non-prefixed routes are redirected to the resolved locale prefix.
 */
export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const nonLocalizedPaths = new Set(['/slice-simulator']);

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const detectedLocale = resolveLocaleFromSegment(segments[0]);
  const cookieLocale = resolveLocaleFromSegment(
    request.cookies.get(localeCookieName)?.value ?? null,
  );
  const effectiveLocale = detectedLocale ?? cookieLocale ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', effectiveLocale);
  requestHeaders.set('x-locale-prefix', detectedLocale ? 'true' : 'false');

  if (nonLocalizedPaths.has(pathname)) {
    const passthrough = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    passthrough.cookies.set(localeCookieName, effectiveLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return passthrough;
  }

  if (!detectedLocale) {
    const redirectUrl = nextUrl.clone();
    const prefix = localeToPrefix[effectiveLocale];
    redirectUrl.pathname = pathname === '/' ? `/${prefix}` : `/${prefix}${pathname}`;

    const redirectResponse = NextResponse.redirect(redirectUrl);
    redirectResponse.cookies.set(localeCookieName, effectiveLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });

    return redirectResponse;
  }

  // Locale-prefixed URLs map to native app/[locale] routes.
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set(localeCookieName, effectiveLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
