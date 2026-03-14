import Image from 'next/image';
import Link from 'next/link';
import { Flight } from '../../../types/flight';

const formatFlightTime = (value: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value));
};

type FlightCardProps = {
  flight: Flight;
  detailBasePath?: string;
};

/**
 * Renders a single airline route card with fare, timing, and quick access to the flight detail page.
 */
export default function FlightCard({ flight, detailBasePath = '/flights' }: FlightCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 w-full bg-slate-100">
        <Image
          src={flight.imageUrl}
          alt={`${flight.destinationCity} skyline for ${flight.flightNumber}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
              {flight.flightNumber}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {flight.originCode} → {flight.destinationCode}
            </h2>
            <p className="text-sm text-slate-500">
              {flight.originCity} to {flight.destinationCity}
            </p>
          </div>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            {flight.status}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-400">Departure</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {formatFlightTime(flight.departureTime)} UTC
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-400">Arrival</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {formatFlightTime(flight.arrivalTime)} UTC
            </dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-400">Cabin</dt>
            <dd className="mt-1 font-semibold text-slate-900">{flight.cabinClass}</dd>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-400">Seats left</dt>
            <dd className="mt-1 font-semibold text-slate-900">{flight.seatsLeft}</dd>
          </div>
        </dl>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Starting fare</p>
            <p className="text-2xl font-bold text-slate-900">${flight.price}</p>
          </div>
          <Link
            href={`${detailBasePath}/${flight.id}`}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            View flight
          </Link>
        </div>
      </div>
    </article>
  );
}
