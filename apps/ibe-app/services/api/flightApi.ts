import { Flight } from '../../types/flight';
import { fetcher } from '../../lib/fetcher';

const getRuntimeBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_BASE ||
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : `http://localhost:${process.env.PORT ?? 3000}`);
};

const getApiUrl = (path: string, baseUrl = getRuntimeBaseUrl()): string => {
    return `${baseUrl}${path}`;
};

export const getFlights = async (baseUrl?: string): Promise<Flight[]> => {
    return fetcher<Flight[]>(getApiUrl('/api/flights', baseUrl));
};

export const getFlight = async (id: string, baseUrl?: string): Promise<Flight> => {
    return fetcher<Flight>(getApiUrl(`/api/flights/${id}`, baseUrl));
};
