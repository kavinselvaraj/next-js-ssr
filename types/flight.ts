export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    originCode: string;
    originCity: string;
    destinationCode: string;
    destinationCity: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    imageUrl: string;
    aircraft: string;
    cabinClass: string;
    terminal: string;
    gate: string;
    status: 'On Time' | 'Boarding Soon' | 'Limited Seats';
    seatsLeft: number;
    highlights: string[];
}
