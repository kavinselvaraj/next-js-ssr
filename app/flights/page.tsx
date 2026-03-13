import FlightResults from '../../components/FlightResults';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Flights | SkyBridge Air',
  description:
    'Browse SkyBridge Air routes with server-rendered availability and fares for fresh travel search results.',
};

export default function Page() {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-sky-950 via-sky-800 to-cyan-700 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">SSR flight search</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Live fares for travellers who do not enjoy surprises.</h1>
        <p className="mt-4 max-w-3xl text-sky-100">
          Search results are fetched via a Server Action — your search criteria stay in the client
          store, never in the URL.
        </p>
      </div>

      <FlightResults />
    </section>
  );
}
