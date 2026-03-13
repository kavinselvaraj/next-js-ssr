import HomepageSearchForm from '../components/HomepageSearchForm';
import { getRequestLocale, hasLocalePrefix } from '../lib/requestLocale';
import { getHomepageContent } from '../lib/homepageContent';
import { switchLocale } from '../lib/switchLocale';
import { Locale } from '../lib/i18n';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SkyBridge Air | Book flights online',
  description: 'Search routes, compare fares, and book your next journey with SkyBridge Air.',
};

export default async function Page() {
  const locale = getRequestLocale();
  const preservePrefix = hasLocalePrefix();
  const resolvedHomepage = await getHomepageContent(locale as Locale);

  const primaryHref = switchLocale(resolvedHomepage.primaryButtonLink, locale, { preservePrefix });

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-hidden bg-white text-slate-900">
      <section className="mx-auto max-w-7xl space-y-10 px-4 py-6 pb-10 md:px-6 md:py-8">
        <section className="px-4 py-8 md:px-8 md:py-12">
          <div className="mx-auto max-w-5xl">
            <h1 className="sr-only">{resolvedHomepage.heroHeadline}</h1>
            <p className="sr-only">{resolvedHomepage.heroDescription}</p>

            <HomepageSearchForm
              locale={locale}
              oneWayLabel={resolvedHomepage.oneWayLabel}
              roundTripLabel={resolvedHomepage.roundTripLabel}
              originLabel={resolvedHomepage.originLabel}
              destinationLabel={resolvedHomepage.destinationLabel}
              passengerLabel={resolvedHomepage.passengerLabel}
              dateLabel={resolvedHomepage.dateLabel}
              searchButtonText={resolvedHomepage.searchButtonText}
              searchHref={primaryHref}
            />
          </div>
        </section>
      </section>

      <footer className="border-t border-white/10 bg-[#05090c]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-slate-400 md:px-6">
          <p>{resolvedHomepage.footerSupportText}</p>
          <p>{resolvedHomepage.footerCopyright}</p>
        </div>
      </footer>
    </div>
  );
}
