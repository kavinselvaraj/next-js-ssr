import { Product } from '../types/product';
import ProductCard from './ProductCard';

type ProductListProps = {
    products: Product[];
    detailBasePath?: string;
};

/**
 * Legacy storefront list component retained to support backward-compatible examples and redirects.
 */
export default function ProductList({ products, detailBasePath = '/product' }: ProductListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} detailBasePath={detailBasePath} />
            ))}
        </div>
    );
}
