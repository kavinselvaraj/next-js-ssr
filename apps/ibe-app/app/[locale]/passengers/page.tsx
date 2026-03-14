import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/passengers', {
    title: 'Passengers | SkyBridge Air',
  });
}

export default function LocalizedPassengersPage() {
  return <section className="p-6">Passenger input flow is being wired to feature modules.</section>;
}
