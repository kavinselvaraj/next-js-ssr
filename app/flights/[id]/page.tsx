import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchStaticFlightById } from '../../../features/flights/flightService';
import { Flight } from '../../../types/flight';
import { Locale, defaultLocale } from '../../../lib/i18n';
import { getRequestLocale } from '../../../lib/requestLocale';
import { getClient } from '../../../lib/prismic';

export const dynamic = 'force-dynamic';

type PrismicLikeDocument = {
  uid?: string | null;
  data?: Record<string, unknown>;
};

const readText = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value)) {
    const firstText = value.find(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'text' in item &&
        typeof (item as { text?: unknown }).text === 'string',
    ) as { text: string } | undefined;

    return firstText?.text;
  }

  return undefined;
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

const readStringList = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    const fromStrings = value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
    if (fromStrings.length > 0) {
      return fromStrings;
    }

    const fromTextObjects = value
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'text' in item) {
          const text = (item as { text?: unknown }).text;
          return typeof text === 'string' ? text.trim() : '';
        }
        return '';
      })
      .filter(Boolean);

    if (fromTextObjects.length > 0) {
      return fromTextObjects;
    }
  }

  return undefined;
};

const normalizeStatus = (value: unknown): Flight['status'] => {
  const text = readText(value)?.toLowerCase();
  if (text === 'on time') {
    return 'On Time';
  }
  if (text === 'boarding soon') {
    return 'Boarding Soon';
  }
  if (text === 'limited seats') {
    return 'Limited Seats';
  }
  return 'On Time';
};

const mapPrismicDocumentToFlight = (doc: PrismicLikeDocument, fallback?: Flight): Flight | null => {
  const data = doc.data ?? {};

  const imageField = data.image as { url?: unknown } | undefined;

  const mapped: Flight = {
    id: doc.uid ?? fallback?.id ?? '',
    flightNumber: readText(data.flight_number) ?? readText(data.flightNumber) ?? fallback?.flightNumber ?? '',
    airline: readText(data.airline) ?? fallback?.airline ?? 'SkyBridge Air',
    originCode: readText(data.origin_code) ?? readText(data.originCode) ?? fallback?.originCode ?? '',
    originCity: readText(data.origin_city) ?? readText(data.originCity) ?? fallback?.originCity ?? '',
    destinationCode: readText(data.destination_code) ?? readText(data.destinationCode) ?? fallback?.destinationCode ?? '',
    destinationCity: readText(data.destination_city) ?? readText(data.destinationCity) ?? fallback?.destinationCity ?? '',
    departureTime: readText(data.departure_time) ?? readText(data.departureTime) ?? fallback?.departureTime ?? new Date().toISOString(),
    arrivalTime: readText(data.arrival_time) ?? readText(data.arrivalTime) ?? fallback?.arrivalTime ?? new Date().toISOString(),
    duration: readText(data.duration) ?? fallback?.duration ?? 'N/A',
    price: readNumber(data.price) ?? fallback?.price ?? 0,
    imageUrl:
      (typeof imageField?.url === 'string' ? imageField.url : undefined) ??
      readText(data.image_url) ??
      readText(data.imageUrl) ??
      fallback?.imageUrl ??
      '/images/skybridge-london.svg',
    aircraft: readText(data.aircraft) ?? fallback?.aircraft ?? 'N/A',
    cabinClass: readText(data.cabin_class) ?? readText(data.cabinClass) ?? fallback?.cabinClass ?? 'Economy',
    terminal: readText(data.terminal) ?? fallback?.terminal ?? 'N/A',
    gate: readText(data.gate) ?? fallback?.gate ?? 'N/A',
    status: normalizeStatus(data.status ?? fallback?.status),
    seatsLeft: readNumber(data.seats_left) ?? readNumber(data.seatsLeft) ?? fallback?.seatsLeft ?? 0,
    highlights: readStringList(data.highlights) ?? fallback?.highlights ?? [],
  };

  if (!mapped.id || !mapped.flightNumber || !mapped.originCity || !mapped.destinationCity) {
    return fallback ?? null;
  }

  return mapped;
};

const getPrismicFlightById = async (id: string, locale: Locale): Promise<Flight | null> => {
  const client = getClient(locale);

  try {
    const document = (await client.getByUID('flight_page', id, client.withLocale())) as PrismicLikeDocument;
    const fallback = await fetchStaticFlightById(id).catch(() => null);
    return mapPrismicDocumentToFlight(document, fallback ?? undefined);
  } catch {
    if (locale === defaultLocale) {
      return null;
    }

    try {
      const defaultClient = getClient(defaultLocale);
      const defaultDocument = (await defaultClient.getByUID(
        'flight_page',
        id,
        defaultClient.withLocale(),
      )) as PrismicLikeDocument;
      const fallback = await fetchStaticFlightById(id).catch(() => null);
      return mapPrismicDocumentToFlight(defaultDocument, fallback ?? undefined);
    } catch {
      return null;
    }
  }
};

const fetchFlightDetail = async (id: string, locale: Locale): Promise<Flight> => {
  const fromPrismic = await getPrismicFlightById(id, locale);
  if (fromPrismic) {
    return fromPrismic;
  }

  return fetchStaticFlightById(id);
};

const formatLongDate = (value: string) => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(value));
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = getRequestLocale();

  try {
    const flight = await fetchFlightDetail(id, locale);
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
  const locale = getRequestLocale();

  let flight;
  try {
    flight = await fetchFlightDetail(id, locale);
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">SSR flight detail</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              {flight.flightNumber}: {flight.originCity} → {flight.destinationCity}
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              Rendered fresh on every request so seat availability, pricing, and status always reflect the latest data.
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
