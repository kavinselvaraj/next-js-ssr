import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import FlightList from '../components/FlightList';
import { fetchFeaturedFlights, fetchFlightSummary } from '../features/flights/flightService';
import { Flight } from '../types/flight';

const formatRenderTimestamp = (value: string) => {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'medium',
        timeStyle: 'medium',
        timeZone: 'UTC',
    }).format(new Date(value));
};

type HomePageProps = {
    featuredFlights: Flight[];
    summary: {
        totalFlights: number;
        averageFare: number;
        onTimeRate: number;
        updatedAt: string;
        updatedAtLabel: string;
    };
};

/**
 * Server-rendered airline homepage that highlights live route metrics and featured journeys.
 */
export default function HomePage({ featuredFlights, summary }: HomePageProps) {
    return (
        <>
            <Head>
                <title>SkyBridge Air | Premium airline journeys</title>
                <meta
                    name="description"
                    content="Server-rendered airline homepage with fresh route availability, fares, and operational metrics for SEO and performance."
                />
            </Head>
            <section className="space-y-10">
                <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-sky-800 to-cyan-700 p-8 text-white shadow-lg">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">SSR airline homepage</p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
                        Turn this POC into a polished airline booking experience.
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-sky-100">
                        SkyBridge Air renders fresh route intelligence on every request so travellers and search engines both see current fares, availability, and reliability metrics.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link
                            href="/flights"
                            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-sky-900 transition hover:bg-sky-50"
                        >
                            Explore flights
                        </Link>
                        <Link
                            href="/contact"
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
                            <p className="text-sm text-sky-100">Last refreshed</p>
                            <time className="mt-2 block text-lg font-semibold" dateTime={summary.updatedAt}>
                                {summary.updatedAtLabel}
                            </time>
                        </div>
                    </div>
                </div>

                <section className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Featured routes</h2>
                        <p className="text-slate-600">Picked on the server for each request so campaigns, fares, and featured destinations stay relevant.</p>
                    </div>
                    <FlightList flights={featuredFlights} detailBasePath="/flights" />
                </section>
            </section>
        </>
    );
}

/**
 * Fetches fresh homepage airline content on every request for SEO and pricing accuracy.
 */
export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
    const [featuredFlights, summary] = await Promise.all([
        fetchFeaturedFlights(2),
        fetchFlightSummary(),
    ]);

    return {
        props: {
            featuredFlights,
            summary: {
                ...summary,
                updatedAtLabel: formatRenderTimestamp(summary.updatedAt),
            },
        },
    };
};
