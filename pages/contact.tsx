import Head from 'next/head';
import { useEffect, useState } from 'react';

type ContactPayload = {
    email: string;
    phone: string;
    supportHours: string;
    operationsHub: string;
    conciergeDesk: string;
    requestId: string;
    fetchedAt: string;
};

/**
 * Client-rendered support page that fetches airline contact data in the browser after hydration.
 */
export default function ContactPage() {
    const [contact, setContact] = useState<ContactPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadContactDetails(signal?: AbortSignal) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'GET',
                cache: 'no-store',
                signal,
                headers: {
                    'x-contact-source': 'csr-page',
                },
            });

            if (!response.ok) {
                throw new Error('Unable to load contact information right now.');
            }

            const payload = (await response.json()) as ContactPayload;
            setContact(payload);
        } catch (loadError) {
            if (!(loadError instanceof DOMException && loadError.name === 'AbortError')) {
                setError(loadError instanceof Error ? loadError.message : 'Unknown error');
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        loadContactDetails(controller.signal);

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <>
            <Head>
                <title>Contact | SkyBridge Air</title>
                <meta
                    name="description"
                    content="Client-rendered airline contact page that fetches support and operations details after the browser loads."
                />
            </Head>
            <section className="space-y-4 rounded-2xl bg-white p-8 shadow-sm">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">CSR page</p>
                    <h1 className="text-3xl font-bold">Contact flight operations</h1>
                    <p className="text-gray-600">
                        The shell renders instantly, then the browser fetches live support details from <code>/api/contact</code> with <code>useEffect</code>.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => void loadContactDetails()}
                        className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading…' : 'Refetch support API'}
                    </button>
                    <p className="text-sm text-gray-500">Open DevTools → Network and click the button to see the CSR airline support request.</p>
                </div>

                {isLoading ? <p className="text-gray-500">Loading contact information...</p> : null}
                {error ? <p className="text-red-600">{error}</p> : null}

                {contact ? (
                    <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
                        <div className="rounded-xl border border-gray-200 p-4">
                            <dt className="text-sm text-gray-500">Concierge desk</dt>
                            <dd className="mt-2 font-semibold">{contact.conciergeDesk}</dd>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4">
                            <dt className="text-sm text-gray-500">Request ID</dt>
                            <dd className="mt-2 font-semibold">{contact.requestId}</dd>
                        </div>
                        <div className="rounded-xl border border-gray-200 p-4 sm:col-span-2 xl:col-span-2">
                            <dt className="text-sm text-gray-500">Fetched at</dt>
                            <dd className="mt-2 font-semibold">{contact.fetchedAt}</dd>
                        </div>
                    </dl>
                ) : null}
            </section>
        </>
    );
}
