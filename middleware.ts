import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, resolveLocaleFromSegment } from './lib/i18n';

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
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', detectedLocale ?? defaultLocale);
    requestHeaders.set('x-locale-prefix', detectedLocale ? 'true' : 'false');

    if (!detectedLocale) {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    const rewrittenPath = `/${segments.slice(1).join('/')}` || '/';
    const rewriteUrl = nextUrl.clone();
    rewriteUrl.pathname = rewrittenPath === '//' ? '/' : rewrittenPath;

    return NextResponse.rewrite(rewriteUrl, {
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};