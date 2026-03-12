import type { Metadata } from 'next';
import Link from 'next/link';
import '../styles/globals.css';

export const metadata: Metadata = {
    title: 'SkyBridge Air',
    description: 'Airline booking POC powered by mixed Next.js rendering strategies',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white shadow-sm">
                    <nav className="mx-auto flex max-w-6xl items-center gap-4 p-4">
                        <Link href="/" className="font-bold">
                            SkyBridge Air
                        </Link>
                        <Link href="/flights">Flights</Link>
                        <Link href="/contact">Contact</Link>
                    </nav>
                </header>
                <main className="mx-auto max-w-6xl p-4">{children}</main>
            </body>
        </html>
    );
}