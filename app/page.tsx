import Link from 'next/link';
import FlightList from '../components/FlightList';
import { fetchFeaturedFlights, fetchFlightSummary } from '../features/flights/flightService';
import { getRequestLocale, hasLocalePrefix } from '../lib/requestLocale';
import { switchLocale } from '../lib/switchLocale';

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

export default async function Page() {
  const locale = getRequestLocale();
  const preservePrefix = hasLocalePrefix();
  const [featuredFlights, summary] = await Promise.all([
    fetchFeaturedFlights(2),
    fetchFlightSummary(),
  ]);

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-sky-800 to-cyan-700 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
          SSR airline homepage
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          Turn this POC into a polished airline booking experience.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-sky-100">
          SkyBridge Air renders fresh route intelligence on every request so travellers and search engines both see
          current fares, availability, and reliability metrics.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={switchLocale('/flights', locale, { preservePrefix })}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
          >
            Explore flights
          </Link>
          <Link
            href={switchLocale('/contact', locale, { preservePrefix })}
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Contact operations
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">Routes live</p>
            <p className="mt-2 text-3xl font-semibold">{summary.totalFlights}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">Average fare</p>
            <p className="mt-2 text-3xl font-semibold">${summary.averageFare}</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">On-time performance</p>
            <p className="mt-2 text-3xl font-semibold">{summary.onTimeRate}%</p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-sky-100">Updated</p>
            <p className="mt-2 text-lg font-semibold">{formatRenderTimestamp(summary.updatedAt)}</p>
          </div>
        </div>
      </div>

      <FlightList flights={featuredFlights} />
    </section>
  );
}
