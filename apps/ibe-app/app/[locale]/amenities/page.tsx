import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/amenities', {
    title: 'Amenities | SkyBridge Air',
  });
}

export default function LocalizedAmenitiesPage() {
  return <section className="p-6">Amenities flow is being wired to feature modules.</section>;
}
