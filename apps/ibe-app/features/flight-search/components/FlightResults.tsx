'use client';

import { useEffect, useState } from 'react';
import { useFlightSearchStore } from '../store/flightSearchStore';
import { searchFlightsAction } from '../actions';
import FlightList from './FlightList';
import type { Flight } from '../../../types/flight';

type Status = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export default function FlightResults() {
  const { hasSearched, originCode, destinationCode, originLabel, destinationLabel } =
    useFlightSearchStore();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasSearched) return;

    let cancelled = false;
    setStatus('loading');
    setError(null);

    searchFlightsAction(originCode, destinationCode)
      .then((results) => {
        if (cancelled) return;
        setFlights(results);
        setStatus(results.length === 0 ? 'empty' : 'success');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // Re-run whenever the search criteria change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSearched, originCode, destinationCode]);

  if (!hasSearched) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
        <p className="text-lg font-semibold">Search for flights above</p>
        <p className="mt-1 text-sm">
          Select your origin, destination, and dates to see available flights.
        </p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center py-16">
        <svg
          className="h-8 w-8 animate-spin text-emerald-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-800">
        <p className="font-semibold">Failed to load flights</p>
        {error && <p className="mt-1 text-sm">{error}</p>}
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center text-amber-800">
        <p className="text-lg font-semibold">No flights found</p>
        <p className="mt-1 text-sm">
          No results for{' '}
          <span className="font-semibold">
            {originLabel} → {destinationLabel}
          </span>
          . Try a different route.
        </p>
      </div>
    );
  }

  return <FlightList flights={flights} />;
}
