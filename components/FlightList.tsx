import { Flight } from '../types/flight';
import FlightCard from './FlightCard';

type FlightListProps = {
    flights: Flight[];
    detailBasePath?: string;
};

/**
 * Displays a responsive grid of flight cards for the SSR home and flights listing pages.
 */
export default function FlightList({ flights, detailBasePath = '/flights' }: FlightListProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {flights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} detailBasePath={detailBasePath} />
            ))}
        </div>
    );
}
