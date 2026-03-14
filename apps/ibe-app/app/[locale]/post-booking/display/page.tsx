import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/post-booking/display', {
    title: 'Post Booking Display | SkyBridge Air',
  });
}

export default function LocalizedPostBookingDisplayPage() {
  return <section className="p-6">Post-booking display flow placeholder.</section>;
}
