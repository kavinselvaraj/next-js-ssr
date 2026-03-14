import type { Metadata } from 'next';
import { Locale, defaultLocale, localeToPrefix, locales, resolveLocaleFromSegment } from './index';

type LocaleMetadataInput = Pick<Metadata, 'title' | 'description'>;

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const trimmed = pathname.trim();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

function withLocalePrefix(locale: Locale, pathname: string): string {
  const prefix = localeToPrefix[locale];
  const normalizedPath = normalizePath(pathname);
  const suffix = normalizedPath === '/' ? '' : normalizedPath;
  return `/${prefix}${suffix}`;
}

export function createLocaleMetadata(
  localeSegment: string,
  pathname: string,
  metadata: LocaleMetadataInput,
): Metadata {
  const locale = resolveLocaleFromSegment(localeSegment) ?? defaultLocale;
  const canonical = withLocalePrefix(locale, pathname);

  const languages = Object.fromEntries(
    locales.map((currentLocale) => [currentLocale, withLocalePrefix(currentLocale, pathname)]),
  );

  return {
    ...metadata,
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': withLocalePrefix(defaultLocale, pathname),
      },
    },
  };
}
