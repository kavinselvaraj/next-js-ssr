import type { Metadata } from 'next';
import { getRequestOriginFromHeaders } from '../../../lib/requestOrigin.server';
import { createLocaleMetadata } from '../../../lib/i18n/metadata';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
    return createLocaleMetadata(params.locale, '/contact', {
        title: 'Contact | SkyBridge Air',
        description: 'Server-rendered airline contact page with live support and operations details.',
    });
}

type ContactPayload = {
    email: string;
    phone: string;
    supportHours: string;
    operationsHub: string;
    conciergeDesk: string;
    requestId: string;
    fetchedAt: string;
};

async function getContact(origin: string): Promise<ContactPayload> {
    const response = await fetch(`${origin}/api/contact`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'x-contact-source': 'ssr-app-router',
        },
    });

    if (!response.ok) {
        throw new Error('Unable to load contact information right now.');
    }

    return (await response.json()) as ContactPayload;
}

export default async function LocalizedContactPage() {
    const origin = getRequestOriginFromHeaders();
    const contact = await getContact(origin);

    return (
        <section className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">SSR page</p>
                <h1 className="text-3xl font-bold">Contact flight operations</h1>
                <p className="text-gray-600">This page renders on the server with fresh support details.</p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-gray-200 p-4">
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="mt-2 font-semibold">{contact.email}</dd>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                    <dt className="text-sm text-gray-500">Phone</dt>
                    <dd className="mt-2 font-semibold">{contact.phone}</dd>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                    <dt className="text-sm text-gray-500">Support hours</dt>
                    <dd className="mt-2 font-semibold">{contact.supportHours}</dd>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                    <dt className="text-sm text-gray-500">Operations hub</dt>
                    <dd className="mt-2 font-semibold">{contact.operationsHub}</dd>
                </div>
            </dl>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Concierge desk</p>
                    <p className="mt-2 font-semibold">{contact.conciergeDesk}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Request details</p>
                    <p className="mt-2 text-sm font-semibold">{contact.requestId}</p>
                    <p className="mt-1 text-xs text-gray-500">Fetched at: {contact.fetchedAt}</p>
                </div>
            </div>
        </section>
    );
}
