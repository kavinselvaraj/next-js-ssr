import type { NextApiRequest, NextApiResponse } from 'next';
import { listFlights } from '../../../features/flights/flightData';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await sleep(400 + Math.random() * 250);
    const flights = await listFlights();
    return res.status(200).json(flights);
}
