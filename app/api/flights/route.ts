import { NextResponse } from 'next/server';
import { listFlights } from '../../../features/flights/flightData';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  await sleep(400 + Math.random() * 250);
  const flights = await listFlights();
  return NextResponse.json(flights);
}
