import { redirectToLocalizedPath } from '../../../lib/i18n/legacyRedirect';

type LegacyFlightDetailParams = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: LegacyFlightDetailParams) {
  const { id } = await params;

  return {
    title: `Flight ${id} | SkyBridge Air`,
    description: 'Legacy flight detail route. Redirecting to locale-prefixed path.',
  };
}

export default async function Page({ params }: LegacyFlightDetailParams) {
  const { id } = await params;
  redirectToLocalizedPath(`/flights/${encodeURIComponent(id)}`);
}
