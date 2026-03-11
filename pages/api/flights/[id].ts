import type { NextApiRequest, NextApiResponse } from 'next';
import { getFlightRecord } from '../../../features/flights/flightData';

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await sleep(350 + Math.random() * 200);

    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const flight = id ? await getFlightRecord(id) : null;

    if (!flight) {
        return res.status(404).json({ error: 'Flight not found' });
    }

    return res.status(200).json(flight);
}
