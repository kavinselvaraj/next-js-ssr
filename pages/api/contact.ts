import type { NextApiRequest, NextApiResponse } from 'next';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
    await sleep(300);

    return res.status(200).json({
        email: 'operations@skybridgeair.com',
        phone: '+1 (800) 555-SKYB',
        supportHours: '24/7 global support desk',
        operationsHub: 'Dubai Operations Control Center',
        conciergeDesk: 'Premium Traveller Desk • Terminal 3',
        requestId: `req_${Date.now()}`,
        fetchedAt: new Date().toISOString(),
    });
}
