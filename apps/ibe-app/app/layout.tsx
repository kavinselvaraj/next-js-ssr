import type { Metadata } from 'next';
import Link from 'next/link';
import { getRequestLocale, hasLocalePrefix } from '../lib/i18n/requestLocale';
import { localeToHtmlLang } from '../lib/i18n/index';
import { getHomepageContent } from '../lib/homepageContent';
import { switchLocale } from '../lib/i18n/switchLocale';
import { LanguageSwitcher } from '../components/navigation';
import { getLanguageOption } from '../lib/i18n/languageOptions';
import Providers from '../providers';
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
      <body className="overflow-x-hidden bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white text-slate-900 shadow-sm">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:gap-4 md:px-6">
            <div className="flex min-w-0 items-center gap-4 md:gap-8">
              <Link
                href={switchLocale('/', locale, { preservePrefix })}
                className="truncate font-serif text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-[2rem]"
              >
                {homepageContent.brandName}
              </Link>

              <nav className="hidden items-center gap-6 lg:flex">
                {[
                  {
                    id: 'book-flights',
                    label: homepageContent.navBookFlightsLabel,
                    href: '/flights',
                  },
                  {
                    id: 'manage-booking',
                    label: homepageContent.navManageBookingLabel,
                    href: '/contact',
                  },
                  {
                    id: 'travel-info',
                    label: homepageContent.navTravelInfoLabel,
                    href: '/flights',
                  },
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

            <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-slate-700 sm:gap-3 sm:text-sm md:gap-4">
              <span>{homepageContent.currencyLabel}</span>
              <LanguageSwitcher
                locale={locale}
                preservePrefix={preservePrefix}
                currentLanguageLabel={activeLanguage.nativeLabel}
              />
              <span className="text-lg text-emerald-700">⌕</span>
              <span className="hidden border-l border-slate-300 pl-4 md:inline">
                {homepageContent.clubLabel}
              </span>
              <Link
                href={switchLocale('/contact', locale, { preservePrefix })}
                className="rounded-xl border border-emerald-700 px-3 py-1.5 font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:px-4 sm:py-2"
              >
                {homepageContent.loginLabel}
              </Link>
            </div>
          </div>
        </header>

        <Providers locale={locale}>
          <main className="mx-auto w-full max-w-7xl">{children}</main>
        </Providers>

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
