import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
    return createLocaleMetadata(params.locale, '/payment', {
        title: 'Payment | SkyBridge Air',
    });
}

export default function LocalizedPaymentPage() {
    return <section className="p-6">Payment flow is being wired to feature modules.</section>;
}
