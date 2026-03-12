import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchFlightIds, fetchStaticFlightById } from '../../../features/flights/flightService';

export const revalidate = 60;

const formatLongDate = (value: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(value));
};

export async function generateStaticParams() {
  const ids = await fetchFlightIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const flight = await fetchStaticFlightById(id);
    return {
      title: `${flight.flightNumber} ${flight.originCode}-${flight.destinationCode} | SkyBridge Air`,
      description: `Book ${flight.flightNumber} from ${flight.originCity} to ${flight.destinationCity} with ${flight.cabinClass} fares and curated premium service.`,
    };
  } catch {
    return { title: 'Flight not found | SkyBridge Air' };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let flight;
  try {
    flight = await fetchStaticFlightById(id);
  } catch {
    notFound();
  }

  return (
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
              <dd className="mt-2 font-semibold text-slate-900">
                {flight.terminal} / {flight.gate}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
