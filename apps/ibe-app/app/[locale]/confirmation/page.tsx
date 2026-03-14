import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/confirmation', {
    title: 'Confirmation | SkyBridge Air',
  });
}

export default function LocalizedConfirmationPage() {
  return <section className="p-6">Confirmation flow is being wired to feature modules.</section>;
}
