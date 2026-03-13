import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, localeCookieName, localeToPrefix, resolveLocaleFromSegment } from './lib/i18n';

/**
 * Supports optional locale prefixes such as /en and /ja without breaking existing URLs.
 * Prefixed routes are internally rewritten to the existing path and the resolved locale is added to request headers.
 */
export function middleware(request: NextRequest) {
    const { nextUrl } = request;
    const pathname = nextUrl.pathname;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const segments = pathname.split('/').filter(Boolean);
    const detectedLocale = resolveLocaleFromSegment(segments[0]);
    const cookieLocale = resolveLocaleFromSegment(request.cookies.get(localeCookieName)?.value ?? null);
    const effectiveLocale = detectedLocale ?? cookieLocale ?? defaultLocale;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', effectiveLocale);
    requestHeaders.set('x-locale-prefix', detectedLocale ? 'true' : 'false');

    if (!detectedLocale) {
        if (cookieLocale && cookieLocale !== defaultLocale) {
            const redirectUrl = nextUrl.clone();
            const prefix = localeToPrefix[cookieLocale];
            redirectUrl.pathname = `/${prefix}${pathname === '/' ? '' : pathname}`;
            const redirectResponse = NextResponse.redirect(redirectUrl);
            redirectResponse.cookies.set(localeCookieName, cookieLocale, {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
                sameSite: 'lax',
            });
            return redirectResponse;
        }

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

    const rewrittenPath = `/${segments.slice(1).join('/')}` || '/';
    const rewriteUrl = nextUrl.clone();
    rewriteUrl.pathname = rewrittenPath === '//' ? '/' : rewrittenPath;

    const response = NextResponse.rewrite(rewriteUrl, {
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