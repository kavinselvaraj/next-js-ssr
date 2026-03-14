import { NextResponse } from 'next/server';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  await sleep(300);

  return NextResponse.json({
    email: 'operations@skybridgeair.com',
    phone: '+1 (800) 555-SKYB',
    supportHours: '24/7 global support desk',
    operationsHub: 'Dubai Operations Control Center',
    conciergeDesk: 'Premium Traveller Desk • Terminal 3',
    requestId: `req_${Date.now()}`,
    fetchedAt: new Date().toISOString(),
  });
}
