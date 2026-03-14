import type { Metadata } from 'next';
import Link from 'next/link';
import { getRequestLocale, hasLocalePrefix } from '../lib/i18n/requestLocale';
import { localeToHtmlLang } from '../lib/i18n/index';
import { getHomepageContent } from '../lib/homepageContent';
import { switchLocale } from '../lib/i18n/switchLocale';
import { LanguageSwitcher } from '../components/navigation';
import { getLanguageOption } from '../lib/i18n/languageOptions';
import { MonorepoBadge } from '@skybridge/ui';
import '../styles/globals.css';

export const metadata: Metadata = {
    title: 'SkyBridge Air',
    description: 'Search routes, compare fares, and book flights with SkyBridge Air.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const locale = getRequestLocale();
    const preservePrefix = hasLocalePrefix();
    const homepageContent = await getHomepageContent(locale);
    const activeLanguage = getLanguageOption(locale);

    return (
        <html lang={localeToHtmlLang(locale)}>
            <body className="bg-slate-50 text-slate-900">
                <header className="border-b border-slate-200 bg-white text-slate-900 shadow-sm">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
                        <div className="flex items-center gap-8">
                            <Link
                                href={switchLocale('/', locale, { preservePrefix })}
                                className="font-serif text-[2rem] font-semibold tracking-tight text-slate-900"
                            >
                                {homepageContent.brandName}
                            </Link>

                            <nav className="hidden items-center gap-6 lg:flex">
                                {[
                                    { id: 'book-flights', label: homepageContent.navBookFlightsLabel, href: '/flights' },
                                    { id: 'manage-booking', label: homepageContent.navManageBookingLabel, href: '/contact' },
                                    { id: 'travel-info', label: homepageContent.navTravelInfoLabel, href: '/flights' },
                                    { id: 'support', label: homepageContent.navSupportLabel, href: '/contact' },
                                ].map((item) => (
                                    <Link
                                        key={item.id}
                                        href={switchLocale(item.href, locale, { preservePrefix })}
                                        className="text-sm font-medium text-slate-800 transition hover:text-emerald-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-700">
                            <MonorepoBadge appName="ibe-app" />
                            <span>{homepageContent.currencyLabel}</span>
                            <LanguageSwitcher
                                locale={locale}
                                preservePrefix={preservePrefix}
                                currentLanguageLabel={activeLanguage.nativeLabel}
                            />
                            <span className="text-lg text-emerald-700">⌕</span>
                            <span className="hidden border-l border-slate-300 pl-4 md:inline">{homepageContent.clubLabel}</span>
                            <Link
                                href={switchLocale('/contact', locale, { preservePrefix })}
                                className="rounded-xl border border-emerald-700 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-50"
                            >
                                {homepageContent.loginLabel}
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl">{children}</main>

                <footer className="border-t border-white/10 bg-[#05090c]">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-slate-400 md:px-6">
                        <p>{homepageContent.footerSupportText}</p>
                        <p>{homepageContent.footerCopyright}</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}