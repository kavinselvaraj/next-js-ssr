import { headers } from 'next/headers';
import { Locale, defaultLocale, resolveLocaleFromSegment } from './i18n';

/**
 * Reads the locale attached by middleware and falls back to the default locale.
 */
export function getRequestLocale(): Locale {
    const headerValue = headers().get('x-locale');
    return resolveLocaleFromSegment(headerValue) ?? defaultLocale;
}

export function hasLocalePrefix(): boolean {
    return headers().get('x-locale-prefix') === 'true';
}