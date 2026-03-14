import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/seats', {
    title: 'Seat Selection | SkyBridge Air',
  });
}

export default function LocalizedSeatsPage() {
  return <section className="p-6">Seat selection flow is being wired to feature modules.</section>;
}
