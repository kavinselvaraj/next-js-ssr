import { NextRequest, NextResponse } from 'next/server';
import { listFlights } from '../../../features/flight-search/services/flightData';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(request: NextRequest) {
  await sleep(400 + Math.random() * 250);

  const { searchParams } = request.nextUrl;
  const origin = searchParams.get('origin')?.toUpperCase() ?? null;
  const destination = searchParams.get('destination')?.toUpperCase() ?? null;

  console.log('[SSR API DEBUG] /api/flights request payload', {
    origin,
    destination,
  });

  try {
    const flights = await listFlights();

    // When no filter params are provided, return the full list (used by the
    // flights listing page and other consumers that don't pass search criteria).
    if (!origin && !destination) {
      console.log('[SSR API DEBUG] /api/flights API response', {
        resultCount: flights.length,
        flightIds: flights.map((flight) => flight.id),
      });

      return NextResponse.json(flights);
    }

    const results = flights.filter((flight) => {
      const originMatch = !origin || flight.originCode.toUpperCase() === origin;
      const destinationMatch = !destination || flight.destinationCode.toUpperCase() === destination;
      return originMatch && destinationMatch;
    });

    console.log('[SSR API DEBUG] /api/flights API response', {
      resultCount: results.length,
      flightIds: results.map((flight) => flight.id),
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('[SSR API DEBUG] /api/flights error', {
      origin,
      destination,
      error: error instanceof Error ? error.message : error,
    });

    return NextResponse.json({ error: 'Failed to fetch flights' }, { status: 500 });
  }
}
