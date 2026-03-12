import Link from 'next/link';
import FlightList from '../components/FlightList';
import { fetchFeaturedFlights, fetchFlightSummary } from '../features/flights/flightService';
import { getRequestLocale, hasLocalePrefix } from '../lib/requestLocale';
import { switchLocale } from '../lib/switchLocale';
import { getClient } from '../lib/prismic';
import { Locale, defaultLocale } from '../lib/i18n';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SkyBridge Air | Premium airline journeys',
  description:
    'Server-rendered airline homepage with fresh route availability, fares, and operational metrics for SEO and performance.',
};

const formatRenderTimestamp = (value: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
};

type HomepageData = {
  pageTitle: string;
  pageDescription: string;
  heroHeadline: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  routesLive?: number;
  averageFare?: number;
  onTimePerformance?: number;
  updatedAt?: string;
};

type PrismicLikeDocument = {
  data?: Record<string, unknown>;
};

const homepageMock: HomepageData = {
  pageTitle: 'SkyBridge Air | Premium airline journeys',
  pageDescription: 'Server-rendered airline homepage with fresh route availability, fares, and operational metrics for SEO and performance.',
  heroHeadline: 'Turn this POC into a polished airline booking experience.',
  heroDescription:
    'SkyBridge Air renders fresh route intelligence on every request so travellers and search engines both see current fares, availability, and reliability metrics.',
  primaryButtonText: 'Explore flights',
  primaryButtonLink: '/flights',
  secondaryButtonText: 'Contact operations',
  secondaryButtonLink: '/contact',
};

const readText = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.trim() ? value : undefined;
};

const readNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
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

const mapHomepageData = (doc: PrismicLikeDocument): HomepageData => {
  const data = doc.data ?? {};

  return {
    pageTitle: readText(data.page_title) ?? homepageMock.pageTitle,
    pageDescription: readText(data.page_description) ?? homepageMock.pageDescription,
    heroHeadline: readText(data.hero_headline) ?? homepageMock.heroHeadline,
    heroDescription: readText(data.hero_description) ?? homepageMock.heroDescription,
    primaryButtonText: readText(data.primary_button_text) ?? homepageMock.primaryButtonText,
    primaryButtonLink: readLink(data.primary_button_link) ?? homepageMock.primaryButtonLink,
    secondaryButtonText: readText(data.secondary_button_text) ?? homepageMock.secondaryButtonText,
    secondaryButtonLink: readLink(data.secondary_button_link) ?? homepageMock.secondaryButtonLink,
    routesLive: readNumber(data.routes_live),
    averageFare: readNumber(data.average_fare),
    onTimePerformance: readNumber(data.on_time_performance),
    updatedAt: readText(data.updated_at),
  };
};

const fetchHomepageData = async (locale: Locale): Promise<HomepageData | null> => {
  try {
    const client = getClient(locale);
    const homepage = (await client.getByUID('homepage', 'home', client.withLocale())) as PrismicLikeDocument;
    return mapHomepageData(homepage);
  } catch {
    // Fallback is handled below.
  }

  if (locale !== defaultLocale) {
    try {
      const defaultClient = getClient(defaultLocale);
      const homepage = (await defaultClient.getByUID(
        'homepage',
        'home',
        defaultClient.withLocale(),
      )) as PrismicLikeDocument;
      return mapHomepageData(homepage);
    } catch {
      // Ignore and fallback to existing homepage rendering.
    }
  }

  return null;
};

export default async function Page() {
  const locale = getRequestLocale();
  const preservePrefix = hasLocalePrefix();

  const [featuredFlights, summary, homepage] = await Promise.all([
    fetchFeaturedFlights(2),
    fetchFlightSummary(),
    fetchHomepageData(locale),
  ]);

  const resolvedHomepage = homepage ?? homepageMock;
  const routesLive = resolvedHomepage.routesLive ?? summary.totalFlights;
  const averageFare = resolvedHomepage.averageFare ?? summary.averageFare;
  const onTimePerformance = resolvedHomepage.onTimePerformance ?? summary.onTimeRate;
  const updatedAt = resolvedHomepage.updatedAt ?? summary.updatedAt;

  const primaryHref = switchLocale(resolvedHomepage.primaryButtonLink, locale, { preservePrefix });
  const secondaryHref = switchLocale(resolvedHomepage.secondaryButtonLink, locale, { preservePrefix });

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-sky-800 to-cyan-700 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
          {resolvedHomepage.pageDescription}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          {resolvedHomepage.heroHeadline}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-sky-100">
          {resolvedHomepage.heroDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={primaryHref}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
          >
            {resolvedHomepage.primaryButtonText}
          </Link>
          <Link
            href={secondaryHref}
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {resolvedHomepage.secondaryButtonText}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">Routes live</p>
            <p className="mt-2 text-3xl font-semibold">{routesLive}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">Average fare</p>
            <p className="mt-2 text-3xl font-semibold">${averageFare}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">On-time performance</p>
            <p className="mt-2 text-3xl font-semibold">{onTimePerformance}%</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">Updated</p>
            <p className="mt-2 text-lg font-semibold">{formatRenderTimestamp(updatedAt)}</p>
          </div>
        </div>
      </div>

      <FlightList flights={featuredFlights} />
    </section>
  );
}
