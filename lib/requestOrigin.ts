import { IncomingMessage } from 'http';

export function getRequestOrigin(req: IncomingMessage): string {
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto ?? 'http';
    const host = req.headers.host ?? `localhost:${process.env.PORT ?? 3000}`;

    return `${protocol}://${host}`;
}
