import { getFlight, getFlights } from '../../../services/api/flightApi';
import {
  getFeaturedFlights,
  getFlightIds,
  getFlightRecord,
  getFlightSummary,
  listFlights,
} from './flightData';

export const fetchAllFlights = async (baseUrl?: string) => getFlights(baseUrl);
export const fetchFlightById = async (id: string, baseUrl?: string) => getFlight(id, baseUrl);
export const fetchStaticFlights = async () => listFlights();
export const fetchFlightIds = async () => getFlightIds();
export const fetchFeaturedFlights = async (limit = 2) => getFeaturedFlights(limit);
export const fetchFlightSummary = async () => getFlightSummary();

export const fetchStaticFlightById = async (id: string) => {
  const flight = await getFlightRecord(id);

  if (!flight) {
    throw new Error('Flight not found');
  }

  return flight;
};
