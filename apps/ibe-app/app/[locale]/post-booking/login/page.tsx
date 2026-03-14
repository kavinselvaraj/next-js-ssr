import type { Metadata } from 'next';
import { createLocaleMetadata } from '../../../../lib/i18n/metadata';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
    return createLocaleMetadata(params.locale, '/post-booking/login', {
        title: 'Post Booking Login | SkyBridge Air',
    });
}

export default function LocalizedPostBookingLoginPage() {
    return <section className="p-6">Post-booking login flow placeholder.</section>;
}
