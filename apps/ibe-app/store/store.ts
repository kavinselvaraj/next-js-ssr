import { configureStore } from '@reduxjs/toolkit';
import flightSearchReducer from '../features/flight-search/store/flightSearchSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      flightSearch: flightSearchReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
