import { Locale, defaultLocale, localeToPrefix, resolveLocaleFromSegment } from './index';

/**
 * Inserts or replaces the locale prefix while preserving the existing route path.
 */
export function switchLocale(
    pathname: string,
    locale: Locale,
    options?: { preservePrefix?: boolean },
): string {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
    const [pathWithoutQuery, queryString] = normalizedPath.split('?');
    const segments = pathWithoutQuery.split('/').filter(Boolean);
    const maybeLocale = resolveLocaleFromSegment(segments[0]);

    if (maybeLocale) {
        segments.shift();
    }

    const prefix = localeToPrefix[locale];
    const shouldPrefix = options?.preservePrefix || locale !== defaultLocale;
    const nextPath = shouldPrefix ? `/${prefix}/${segments.join('/')}` : `/${segments.join('/')}`;
    const cleanedPath = nextPath === '/' ? '/' : nextPath.replace(/\/$/, '');

    return queryString ? `${cleanedPath}?${queryString}` : cleanedPath;
}
