import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
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

type SearchPayload = Omit<FlightSearchState, 'hasSearched'>;

export const initialFlightSearchState: FlightSearchState = {
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

const flightSearchSlice = createSlice({
  name: 'flightSearch',
  initialState: initialFlightSearchState,
  reducers: {
    setSearch: (state, action: PayloadAction<SearchPayload>) => {
      state.tripType = action.payload.tripType;
      state.originCode = action.payload.originCode;
      state.originLabel = action.payload.originLabel;
      state.destinationCode = action.payload.destinationCode;
      state.destinationLabel = action.payload.destinationLabel;
      state.passengers = action.payload.passengers;
      state.departureDate = action.payload.departureDate;
      state.returnDate = action.payload.returnDate;
      state.hasSearched = true;
    },
    clearSearch: () => initialFlightSearchState,
  },
});

export const { setSearch, clearSearch } = flightSearchSlice.actions;
export default flightSearchSlice.reducer;
