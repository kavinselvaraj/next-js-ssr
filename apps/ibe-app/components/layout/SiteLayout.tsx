import Link from 'next/link';
import { PropsWithChildren } from 'react';

/**
 * Wraps all Pages Router routes with shared airline navigation and page spacing.
 */
export default function SiteLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link href="/" className="text-lg font-bold text-slate-900">
                            SkyBridge Air
                        </Link>
                        <p className="text-sm text-slate-500">Modern airline commerce POC with SSR, ISR, and CSR.</p>
                    </div>
                    <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
                        <Link href="/">Home</Link>
                        <Link href="/flights">Flights</Link>
                        <Link href="/contact">Contact</Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        </div>
    );
}
