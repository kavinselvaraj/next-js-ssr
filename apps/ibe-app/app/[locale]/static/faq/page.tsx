import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/static/faq', {
    title: 'FAQ | SkyBridge Air',
  });
}

export default function LocalizedFaqPage() {
  return <section className="p-6">Frequently asked questions page placeholder.</section>;
}
