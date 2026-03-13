export type TripType = 'oneWay' | 'roundTrip';

export interface FlightSearchParams {
    tripType: TripType;
    /** IATA airport code — e.g. "NRT" */
    originCode: string;
    /** IATA airport code — e.g. "ICN" */
    destinationCode: string;
    passengers: number;
    /** ISO date string YYYY-MM-DD */
    departureDate: string;
    /** ISO date string YYYY-MM-DD — only required for roundTrip */
    returnDate?: string;
}

export interface FlightSearchValidationErrors {
    origin?: string;
    destination?: string;
    passengers?: string;
    departureDate?: string;
    returnDate?: string;
    sameRoute?: string;
}

export type FlightSearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export interface DropdownOption {
    /** The value sent to the API (e.g. airport code, numeric count, ISO date) */
    value: string;
    /** Localised display text shown in the UI */
    label: string;
}
