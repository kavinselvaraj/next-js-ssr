'use server';

import { searchFlights as dataSearchFlights } from './services/flightData';
import type { Flight } from '../../types/flight';

export async function searchFlightsAction(
  originCode: string,
  destinationCode: string,
): Promise<Flight[]> {
  const payload = {
    originCode: originCode || undefined,
    destinationCode: destinationCode || undefined,
  };

  console.log('[SSR API DEBUG] searchFlightsAction request payload', payload);

  try {
    const flights = await dataSearchFlights(payload);

    console.log('[SSR API DEBUG] searchFlightsAction API response', {
      resultCount: flights.length,
      flightIds: flights.map((flight) => flight.id),
    });

    return flights;
  } catch (error) {
    console.error('[SSR API DEBUG] searchFlightsAction error', {
      payload,
      error: error instanceof Error ? error.message : error,
    });

    throw error;
  }
}
