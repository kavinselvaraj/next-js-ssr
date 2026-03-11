import { getProduct, getProducts } from '../../services/productApi';
import {
    getCatalogSummary,
    getFeaturedProducts,
    getProductIds,
    getProductRecord,
    listProducts,
} from './productData';

export const fetchAllProducts = async (baseUrl?: string) => getProducts(baseUrl);
export const fetchProductById = async (id: string, baseUrl?: string) => getProduct(id, baseUrl);
export const fetchStaticProducts = async () => listProducts();
export const fetchProductIds = async () => getProductIds();
export const fetchFeaturedProducts = async (limit = 2) => getFeaturedProducts(limit);
export const fetchCatalogSummary = async () => getCatalogSummary();

export const fetchStaticProductById = async (id: string) => {
    const product = await getProductRecord(id);

    if (!product) {
        throw new Error('Product not found');
    }

    return product;
};
