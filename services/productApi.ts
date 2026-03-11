import { Product } from '../types/product';
import { fetcher } from '../lib/fetcher';

const getRuntimeBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_BASE ||
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : `http://localhost:${process.env.PORT ?? 3000}`);
};

const getApiUrl = (path: string, baseUrl = getRuntimeBaseUrl()): string => {
    return `${baseUrl}${path}`;
};

export const getProducts = async (baseUrl?: string): Promise<Product[]> => {
    return fetcher<Product[]>(getApiUrl('/api/products', baseUrl));
};

export const getProduct = async (id: string, baseUrl?: string): Promise<Product> => {
    return fetcher<Product>(getApiUrl(`/api/products/${id}`, baseUrl));
};
