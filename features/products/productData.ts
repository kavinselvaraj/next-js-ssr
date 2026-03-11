import { mockProducts } from '../../mocks/products';
import { Product } from '../../types/product';

const cloneProduct = (product: Product): Product => ({ ...product });

const withLatency = async <T,>(value: T, delay = 150): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return value;
};

export async function listProducts(): Promise<Product[]> {
    return withLatency(mockProducts.map(cloneProduct));
}

export async function getProductRecord(id: string): Promise<Product | null> {
    const product = mockProducts.find((item) => item.id === id);
    return withLatency(product ? cloneProduct(product) : null);
}

export async function getFeaturedProducts(limit = 2): Promise<Product[]> {
    return withLatency(mockProducts.slice(0, limit).map(cloneProduct));
}

export async function getProductIds(): Promise<string[]> {
    return mockProducts.map(({ id }) => id);
}

export async function getCatalogSummary(): Promise<{
    totalProducts: number;
    averagePrice: number;
    updatedAt: string;
}> {
    const totalProducts = mockProducts.length;
    const averagePrice = totalProducts
        ? Number((mockProducts.reduce((sum, product) => sum + product.price, 0) / totalProducts).toFixed(2))
        : 0;

    return withLatency({
        totalProducts,
        averagePrice,
        updatedAt: new Date().toISOString(),
    });
}
