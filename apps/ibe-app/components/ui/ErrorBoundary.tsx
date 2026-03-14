'use client';
import { ReactNode } from 'react';

/**
 * Shows a simple client-side fallback when an unexpected rendering error occurs.
 */
export default function ErrorBoundary({
  error,
}: {
  error: Error;
  reset?: () => void;
  children?: ReactNode;
}) {
  return (
    <div role="alert" className="text-red-600">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}
