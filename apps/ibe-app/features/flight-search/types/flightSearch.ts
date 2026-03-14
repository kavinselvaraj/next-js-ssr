export type TripType = 'oneWay' | 'roundTrip';

export interface FlightSearchParams {
  tripType: TripType;
  originCode: string;
  destinationCode: string;
  passengers: number;
  departureDate: string;
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
  value: string;
  label: string;
}
