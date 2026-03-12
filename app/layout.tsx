import type { Metadata } from 'next';
import Link from 'next/link';
import { getRequestLocale, hasLocalePrefix } from '../lib/requestLocale';
import { localeToHtmlLang } from '../lib/i18n';
import { switchLocale } from '../lib/switchLocale';
import '../styles/globals.css';

export const metadata: Metadata = {
    title: 'SkyBridge Air',
    description: 'Airline booking POC powered by mixed Next.js rendering strategies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = getRequestLocale();
    const preservePrefix = hasLocalePrefix();

    return (
        <html lang={localeToHtmlLang(locale)}>
            <body className="bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white shadow-sm">
                    <nav className="mx-auto flex max-w-6xl items-center gap-4 p-4">
                        <Link href={switchLocale('/', locale, { preservePrefix })} className="font-bold">
                            SkyBridge Air
                        </Link>
                        <Link href={switchLocale('/flights', locale, { preservePrefix })}>Flights</Link>
                        <Link href={switchLocale('/contact', locale, { preservePrefix })}>Contact</Link>
                    </nav>
                </header>
                <main className="mx-auto max-w-6xl p-4">{children}</main>
            </body>
        </html>
    );
}