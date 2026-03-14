import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import { Locale, defaultLocale } from './i18n/index';

const repositoryName = process.env.PRISMIC_REPOSITORY_NAME;

if (!repositoryName) {
    console.warn('Missing PRISMIC_REPOSITORY_NAME. Update your .env file before querying Prismic content.');
}

export function createClient(config: prismic.ClientConfig = {}) {
    const client = prismic.createClient(repositoryName ?? '', {
        accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        ...config,
    });

    enableAutoPreviews({ client });

    return client;
}

export type LocaleAwarePrismicClient = ReturnType<typeof createClient> & {
    locale: Locale;
    withLocale: (params?: Record<string, unknown>) => Record<string, unknown>;
};

/**
 * Returns the Prismic client plus a helper that applies the resolved locale to query params.
 */
export function getClient(locale?: Locale): LocaleAwarePrismicClient {
    const resolvedLocale = locale ?? defaultLocale;
    const client = createClient() as LocaleAwarePrismicClient;

    client.locale = resolvedLocale;
    client.withLocale = (params = {}) => ({
        ...params,
        lang: resolvedLocale,
    });

    return client;
}