import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AppPageHeader, AppSection } from '@repo/ui';
import { HomepageSearchForm } from '../../features/flight-search/components';
import { getHomepageContent } from '../../lib/homepageContent';
import { Locale, resolveLocaleFromSegment } from '../../lib/i18n/index';
import { createLocaleMetadata } from '../../lib/i18n/metadata';
import { switchLocale } from '../../lib/i18n/switchLocale';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return createLocaleMetadata(params.locale, '/', {
    title: 'SkyBridge Air | Book flights online',
    description: 'Search routes, compare fares, and book your next journey with SkyBridge Air.',
  });
}

export default async function LocalizedHomePage({ params }: { params: { locale: string } }) {
  const locale = resolveLocaleFromSegment(params.locale);

  if (!locale) {
    notFound();
  }

  const resolvedHomepage = await getHomepageContent(locale as Locale);
  const preservePrefix = true;
  const primaryHref = switchLocale(resolvedHomepage.primaryButtonLink, locale, { preservePrefix });

  return (
    <div className="w-full bg-white text-slate-900">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <section className="py-4 md:py-8 lg:py-10">
          <div className="mx-auto w-full max-w-5xl">
            <AppSection className="mb-6">
              <AppPageHeader
                title={resolvedHomepage.heroHeadline}
                subtitle={resolvedHomepage.heroDescription}
              />
            </AppSection>
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
    </div>
  );
}
