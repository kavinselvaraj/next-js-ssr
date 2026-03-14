export const locales = ['en-us', 'ja-jp'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'en-us';
export const localeCookieName = 'sb-locale';

export const localePrefixes: Record<string, Locale> = {
    en: 'en-us',
    ja: 'ja-jp',
};

export const localeToPrefix: Record<Locale, string> = {
    'en-us': 'en',
    'ja-jp': 'ja',
};

export function resolveLocaleFromSegment(segment?: string | null): Locale | null {
    if (!segment) {
        return null;
    }

    const normalizedSegment = segment.toLowerCase();

    if (normalizedSegment in localePrefixes) {
        return localePrefixes[normalizedSegment];
    }

    if (locales.includes(normalizedSegment as Locale)) {
        return normalizedSegment as Locale;
    }

    return null;
}

export function localeToHtmlLang(locale: Locale): string {
    return locale;
}
