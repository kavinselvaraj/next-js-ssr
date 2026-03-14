import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
    return createLocaleMetadata(params.locale, '/post-booking', {
        title: 'Post Booking | SkyBridge Air',
    });
}

export default function LocalizedPostBookingPage() {
    return <section className="p-6">Post-booking dashboard entry route.</section>;
}
