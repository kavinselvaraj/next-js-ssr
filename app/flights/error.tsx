'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-red-600">
        Something went wrong loading flights.
      </p>
      <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
