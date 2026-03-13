import type { Flight } from '../types/flight';
import type { FlightSearchParams } from '../types/flightSearch';

/**
 * Calls the flight availability API with the given search parameters.
 * Always uses a relative URL so it works in any deployment environment.
 * Intended to be called from client components only.
 */
export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    const query = new URLSearchParams({
        tripType: params.tripType,
        origin: params.originCode,
        destination: params.destinationCode,
        passengers: String(params.passengers),
        departureDate: params.departureDate,
    });

    if (params.returnDate) {
        query.set('returnDate', params.returnDate);
    }

    const res = await fetch(`/api/flights?${query.toString()}`, { cache: 'no-store' });

    if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error ?? 'Flight search failed. Please try again.');
    }

    return res.json() as Promise<Flight[]>;
}
