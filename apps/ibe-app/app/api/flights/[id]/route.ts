import { NextResponse } from 'next/server';
import { getFlightRecord } from '../../../../features/flight-search/services/flightData';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await sleep(350 + Math.random() * 200);

  const { id } = await params;
  const flight = await getFlightRecord(id);

  if (!flight) {
    return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
  }

  return NextResponse.json(flight);
}
