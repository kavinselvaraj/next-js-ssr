import { Locale, locales } from './index';

export type LanguageOption = {
  locale: Locale;
  label: string;
  nativeLabel: string;
};

const languageMetadata: Record<Locale, Omit<LanguageOption, 'locale'>> = {
  'en-us': {
    label: 'English',
    nativeLabel: 'English',
  },
  'ja-jp': {
    label: 'Japanese',
    nativeLabel: '日本語',
  },
};

export const languageOptions: LanguageOption[] = locales.map((locale) => ({
  locale,
  ...languageMetadata[locale],
}));

export function getLanguageOption(locale: Locale): LanguageOption {
  return languageOptions.find((option) => option.locale === locale) ?? languageOptions[0];
}
