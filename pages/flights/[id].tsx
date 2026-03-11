import Head from 'next/head';
import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchFlightIds, fetchStaticFlightById } from '../../features/flights/flightService';
import { Flight } from '../../types/flight';

const formatLongDate = (value: string) => {
    return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'UTC',
    }).format(new Date(value));
};

type FlightDetailPageProps = {
    flight: Flight;
};

/**
 * Incrementally generated flight detail page optimized for fast loads and strong destination SEO.
 */
export default function FlightDetailPage({ flight }: FlightDetailPageProps) {
    return (
        <>
            <Head>
                <title>{`${flight.flightNumber} ${flight.originCode}-${flight.destinationCode} | SkyBridge Air`}</title>
                <meta
                    name="description"
                    content={`Book ${flight.flightNumber} from ${flight.originCity} to ${flight.destinationCity} with ${flight.cabinClass} fares and curated premium service.`}
                />
            </Head>
            <article className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-72 w-full bg-slate-100">
                        <Image
                            src={flight.imageUrl}
                            alt={`${flight.destinationCity} destination artwork`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="space-y-6 p-8">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">ISR flight detail</p>
                            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                                {flight.flightNumber}: {flight.originCity} → {flight.destinationCity}
                            </h1>
                            <p className="mt-3 text-lg text-slate-600">
                                Pre-rendered for speed, then refreshed every 60 seconds in the background. Fast boarding pass energy.
                            </p>
                        </div>

                        <dl className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <dt className="text-sm text-slate-500">Departure</dt>
                                <dd className="mt-2 font-semibold text-slate-900">{formatLongDate(flight.departureTime)} UTC</dd>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <dt className="text-sm text-slate-500">Arrival</dt>
                                <dd className="mt-2 font-semibold text-slate-900">{formatLongDate(flight.arrivalTime)} UTC</dd>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <dt className="text-sm text-slate-500">Aircraft</dt>
                                <dd className="mt-2 font-semibold text-slate-900">{flight.aircraft}</dd>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <dt className="text-sm text-slate-500">Terminal / Gate</dt>
                                <dd className="mt-2 font-semibold text-slate-900">{flight.terminal} / {flight.gate}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Fare details</p>
                        <p className="mt-2 text-4xl font-bold text-slate-900">${flight.price}</p>
                        <p className="mt-2 text-slate-600">{flight.cabinClass} • {flight.duration} • {flight.seatsLeft} seats left</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Why travellers pick this route</h2>
                        <ul className="mt-4 space-y-3 text-slate-600">
                            {flight.highlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-3">
                                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl bg-sky-50 p-4 text-sky-900">
                        <p className="text-sm font-semibold uppercase tracking-wide">Status</p>
                        <p className="mt-2 text-xl font-bold">{flight.status}</p>
                        <p className="mt-2 text-sm">Operated by {flight.airline} on {flight.aircraft}.</p>
                    </div>
                </aside>
            </article>
        </>
    );
}

/**
 * Declares which flight detail routes are prebuilt during the static generation step.
 */
export const getStaticPaths: GetStaticPaths = async () => {
    const ids = await fetchFlightIds();

    return {
        paths: ids.map((id) => ({ params: { id } })),
        fallback: 'blocking',
    };
};

/**
 * Builds and revalidates flight detail content so route pages stay fast while refreshing every minute.
 */
export const getStaticProps: GetStaticProps<FlightDetailPageProps> = async ({ params }) => {
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    if (!id) {
        return { notFound: true };
    }

    try {
        const flight = await fetchStaticFlightById(id);

        return {
            props: {
                flight,
            },
            revalidate: 60,
        };
    } catch {
        return { notFound: true, revalidate: 60 };
    }
};
