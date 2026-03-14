import { redirectToLocalizedPath } from '../lib/i18n/legacyRedirect';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'SkyBridge Air | Book flights online',
  description: 'Search routes, compare fares, and book your next journey with SkyBridge Air.',
};

export default async function Page() {
  redirectToLocalizedPath('/');
}
