import { create } from 'zustand';
import type { TripType } from '../types/flightSearch';

export interface FlightSearchState {
  tripType: TripType;
  originCode: string;
  originLabel: string;
  destinationCode: string;
  destinationLabel: string;
  passengers: number;
  departureDate: string;
  returnDate?: string;
  hasSearched: boolean;
}

interface FlightSearchStore extends FlightSearchState {
  setSearch: (params: Omit<FlightSearchState, 'hasSearched'>) => void;
  clear: () => void;
}

const initialState: FlightSearchState = {
  tripType: 'oneWay',
  originCode: '',
  originLabel: '',
  destinationCode: '',
  destinationLabel: '',
  passengers: 1,
  departureDate: '',
  returnDate: undefined,
  hasSearched: false,
};

export const useFlightSearchStore = create<FlightSearchStore>((set) => ({
  ...initialState,
  setSearch: (params) =>
    set({
      ...params,
      hasSearched: true,
    }),
  clear: () => set(initialState),
}));
