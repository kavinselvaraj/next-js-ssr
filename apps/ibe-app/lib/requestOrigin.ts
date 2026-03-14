import { IncomingMessage } from 'http';

const getFirstHeaderValue = (value: string | string[] | undefined): string | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(',')[0]?.trim();
};

export function getRequestOrigin(req: IncomingMessage): string {
  const protocol =
    getFirstHeaderValue(req.headers['x-forwarded-proto']) ??
    (process.env.VERCEL ? 'https' : 'http');

  const host =
    getFirstHeaderValue(req.headers['x-forwarded-host']) ??
    getFirstHeaderValue(req.headers.host) ??
    `localhost:${process.env.PORT ?? 3000}`;

  return `${protocol}://${host}`;
}
