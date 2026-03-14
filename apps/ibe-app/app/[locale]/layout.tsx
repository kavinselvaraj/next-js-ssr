import { notFound } from 'next/navigation';
import { localePrefixes, resolveLocaleFromSegment } from '../../lib/i18n/index';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(localePrefixes).map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!resolveLocaleFromSegment(params.locale)) {
    notFound();
  }

  return children;
}
