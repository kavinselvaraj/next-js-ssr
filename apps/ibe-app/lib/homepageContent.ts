import { cache } from 'react';
import { Locale, defaultLocale } from './i18n/index';
import { getClient } from './prismic';

export type HomepageContent = {
  brandName: string;
  navBookFlightsLabel: string;
  navManageBookingLabel: string;
  navTravelInfoLabel: string;
  navSupportLabel: string;
  currencyLabel: string;
  languageLabel: string;
  clubLabel: string;
  loginLabel: string;
  pageTitle: string;
  pageDescription: string;
  heroHeadline: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  oneWayLabel: string;
  roundTripLabel: string;
  originLabel: string;
  destinationLabel: string;
  passengerLabel: string;
  dateLabel: string;
  searchButtonText: string;
  footerSupportText: string;
  footerCopyright: string;
};

type PrismicLikeDocument = {
  data?: Record<string, unknown>;
};

type PrismicTypeQueryResult = {
  results?: PrismicLikeDocument[];
};

export const getHomepageFallback = (locale: Locale): HomepageContent => {
  if (locale === 'ja-jp') {
    return {
      brandName: 'SkyBridge Air',
      navBookFlightsLabel: 'フライト予約',
      navManageBookingLabel: '予約確認・変更',
      navTravelInfoLabel: 'ご搭乗',
      navSupportLabel: 'サポート',
      currencyLabel: 'JPY (¥)',
      languageLabel: '日本語',
      clubLabel: 'SkyBridge Club',
      loginLabel: 'ログイン',
      pageTitle: 'SkyBridge Air',
      pageDescription:
        'SkyBridge Air で路線を検索し、運賃を比較して、次のフライトを予約しましょう。',
      heroHeadline: 'スムーズで安心できる予約体験を。',
      heroDescription:
        '路線検索から予約管理まで、必要な操作をひとつの画面で分かりやすく案内します。',
      primaryButtonText: 'フライト検索',
      primaryButtonLink: '/flights',
      secondaryButtonText: '予約確認',
      secondaryButtonLink: '/contact',
      oneWayLabel: '片道',
      roundTripLabel: '往復',
      originLabel: '出発地',
      destinationLabel: '到着地',
      passengerLabel: '1名',
      dateLabel: '日付',
      searchButtonText: 'フライト検索',
      footerSupportText: 'サポートが必要ですか？ SkyBridge Air が快適な旅をお手伝いします。',
      footerCopyright: 'Copyright © SkyBridge Air.',
    };
  }

  return {
    brandName: 'SkyBridge Air',
    navBookFlightsLabel: 'Book Flights',
    navManageBookingLabel: 'Manage Booking',
    navTravelInfoLabel: 'Travel Info',
    navSupportLabel: 'Support',
    currencyLabel: 'USD ($)',
    languageLabel: 'English',
    clubLabel: 'SkyBridge Club',
    loginLabel: 'Login',
    pageTitle: 'SkyBridge Air',
    pageDescription: 'Search routes, compare fares, and book your next journey with SkyBridge Air.',
    heroHeadline: 'Book your next flight with confidence.',
    heroDescription:
      'Search live routes, review fares, and manage your trip from one streamlined booking experience.',
    primaryButtonText: 'Search flights',
    primaryButtonLink: '/flights',
    secondaryButtonText: 'Manage booking',
    secondaryButtonLink: '/contact',
    oneWayLabel: 'One way',
    roundTripLabel: 'Round trip',
    originLabel: 'Departure',
    destinationLabel: 'Arrival',
    passengerLabel: '1 passenger',
    dateLabel: 'Date',
    searchButtonText: 'Search flights',
    footerSupportText: 'Need help? SkyBridge Air is here to support your journey.',
    footerCopyright: 'Copyright © SkyBridge Air.',
  };
};

const readText = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.trim() ? value : undefined;
};

const readLink = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'url' in value) {
    const url = (value as { url?: unknown }).url;
    return typeof url === 'string' && url.trim() ? url : undefined;
  }

  return undefined;
};

const mapHomepageContent = (
  doc: PrismicLikeDocument,
  fallback: HomepageContent,
): HomepageContent => {
  const data = doc.data ?? {};

  return {
    brandName: readText(data.brand_name) ?? fallback.brandName,
    navBookFlightsLabel: readText(data.nav_book_flights_label) ?? fallback.navBookFlightsLabel,
    navManageBookingLabel:
      readText(data.nav_manage_booking_label) ?? fallback.navManageBookingLabel,
    navTravelInfoLabel: readText(data.nav_travel_info_label) ?? fallback.navTravelInfoLabel,
    navSupportLabel: readText(data.nav_support_label) ?? fallback.navSupportLabel,
    currencyLabel: readText(data.currency_label) ?? fallback.currencyLabel,
    languageLabel: readText(data.language_label) ?? fallback.languageLabel,
    clubLabel: readText(data.club_label) ?? fallback.clubLabel,
    loginLabel: readText(data.login_label) ?? fallback.loginLabel,
    pageTitle: readText(data.page_title) ?? fallback.pageTitle,
    pageDescription: readText(data.page_description) ?? fallback.pageDescription,
    heroHeadline: readText(data.hero_headline) ?? fallback.heroHeadline,
    heroDescription: readText(data.hero_description) ?? fallback.heroDescription,
    primaryButtonText: readText(data.primary_button_text) ?? fallback.primaryButtonText,
    primaryButtonLink: readLink(data.primary_button_link) ?? fallback.primaryButtonLink,
    secondaryButtonText: readText(data.secondary_button_text) ?? fallback.secondaryButtonText,
    secondaryButtonLink: readLink(data.secondary_button_link) ?? fallback.secondaryButtonLink,
    oneWayLabel: readText(data.one_way_label) ?? fallback.oneWayLabel,
    roundTripLabel: readText(data.round_trip_label) ?? fallback.roundTripLabel,
    originLabel: readText(data.origin_label) ?? fallback.originLabel,
    destinationLabel: readText(data.destination_label) ?? fallback.destinationLabel,
    passengerLabel: readText(data.passenger_label) ?? fallback.passengerLabel,
    dateLabel: readText(data.date_label) ?? fallback.dateLabel,
    searchButtonText: readText(data.search_button_text) ?? fallback.searchButtonText,
    footerSupportText: readText(data.footer_support_text) ?? fallback.footerSupportText,
    footerCopyright: readText(data.footer_copyright) ?? fallback.footerCopyright,
  };
};

const getHomepageDocumentForLocale = async (
  locale: Locale,
): Promise<PrismicLikeDocument | null> => {
  const client = getClient(locale);

  try {
    const byUid = (await client.getByUID(
      'homepage',
      'home',
      client.withLocale(),
    )) as PrismicLikeDocument;
    return byUid;
  } catch {
    // Try a locale-scoped type query if UID differs across locales.
  }

  try {
    const byType = (await client.getByType(
      'homepage',
      client.withLocale({ pageSize: 1 }),
    )) as PrismicTypeQueryResult;
    return byType.results?.[0] ?? null;
  } catch {
    return null;
  }
};

export const getHomepageContent = cache(async (locale: Locale): Promise<HomepageContent> => {
  const localeFallback = getHomepageFallback(locale);

  const localizedHomepage = await getHomepageDocumentForLocale(locale);
  if (localizedHomepage) {
    return mapHomepageContent(localizedHomepage, localeFallback);
  }

  if (locale !== defaultLocale) {
    const defaultFallback = getHomepageFallback(defaultLocale);
    const defaultHomepage = await getHomepageDocumentForLocale(defaultLocale);

    if (defaultHomepage) {
      return mapHomepageContent(defaultHomepage, defaultFallback);
    }
  }

  try {
    const client = getClient(locale);
    const homepage = (await client.getByUID(
      'homepage',
      'home',
      client.withLocale(),
    )) as PrismicLikeDocument;
    return mapHomepageContent(homepage, localeFallback);
  } catch {
    // Fall back to local dictionary below.
  }

  return localeFallback;
});
