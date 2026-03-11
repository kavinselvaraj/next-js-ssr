import Head from 'next/head';
import { GetServerSideProps } from 'next';
import FlightList from '../../components/FlightList';
import { fetchAllFlights } from '../../features/flights/flightService';
import { getRequestOrigin } from '../../lib/requestOrigin';
import { Flight } from '../../types/flight';

type FlightsPageProps = {
    flights: Flight[];
};

/**
 * Server-rendered flight search page that always shows fresh route availability and fares.
 */
export default function FlightsPage({ flights }: FlightsPageProps) {
    return (
        <>
            <Head>
                <title>Flights | SkyBridge Air</title>
                <meta
                    name="description"
                    content="Browse SkyBridge Air routes with server-rendered availability and fares for fresh travel search results."
                />
            </Head>
            <section className="space-y-8">
                <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-sky-800 to-cyan-700 p-8 text-white shadow-lg">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">SSR flight search</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight">Live fares for travellers who do not enjoy surprises.</h1>
                    <p className="mt-4 max-w-3xl text-sky-100">
                        This route is rendered on the server for every request so flight availability, pricing, and status stay fresh for search and SEO.
                    </p>
                </div>

                <FlightList flights={flights} />
            </section>
        </>
    );
}

/**
 * Loads flight search results on each request so pricing and operational status remain current.
 */
export const getServerSideProps: GetServerSideProps<FlightsPageProps> = async ({ req }) => {
    const origin = getRequestOrigin(req);
    const flights = await fetchAllFlights(origin);

    return {
        props: {
            flights,
        },
    };
};
