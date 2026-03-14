import { headers } from 'next/headers';

const getFirstHeaderValue = (value: string | null): string | undefined => {
  return value?.split(',')[0]?.trim();
};

export function getRequestOriginFromHeaders(): string {
  const h = headers();

  const protocol =
    getFirstHeaderValue(h.get('x-forwarded-proto')) ?? (process.env.VERCEL ? 'https' : 'http');

  const host =
    getFirstHeaderValue(h.get('x-forwarded-host')) ??
    getFirstHeaderValue(h.get('host')) ??
    `localhost:${process.env.PORT ?? 3000}`;

  return `${protocol}://${host}`;
}
