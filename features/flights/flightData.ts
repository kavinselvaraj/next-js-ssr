import { mockFlights } from '../../mocks/flights';
import { Flight } from '../../types/flight';

const cloneFlight = (flight: Flight): Flight => ({
    ...flight,
    highlights: [...flight.highlights],
});

const withLatency = async <T,>(value: T, delay = 180): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return value;
};

export async function listFlights(): Promise<Flight[]> {
    return withLatency(mockFlights.map(cloneFlight));
}

export async function getFlightRecord(id: string): Promise<Flight | null> {
    const flight = mockFlights.find((item) => item.id === id);
    return withLatency(flight ? cloneFlight(flight) : null);
}

export async function getFeaturedFlights(limit = 2): Promise<Flight[]> {
    return withLatency(mockFlights.slice(0, limit).map(cloneFlight));
}

export async function getFlightIds(): Promise<string[]> {
    return mockFlights.map(({ id }) => id);
}

export async function getFlightSummary(): Promise<{
    totalFlights: number;
    averageFare: number;
    onTimeRate: number;
    updatedAt: string;
}> {
    const totalFlights = mockFlights.length;
    const averageFare = totalFlights
        ? Number((mockFlights.reduce((sum, flight) => sum + flight.price, 0) / totalFlights).toFixed(2))
        : 0;

    return withLatency({
        totalFlights,
        averageFare,
        onTimeRate: 96,
        updatedAt: new Date().toISOString(),
    });
}
