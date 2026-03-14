import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/completion', {
    title: 'Booking Completion | SkyBridge Air',
  });
}

export default function LocalizedCompletionPage() {
  return (
    <section className="p-6">Booking completion flow is being wired to feature modules.</section>
  );
}
