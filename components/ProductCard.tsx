import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types/product';

type ProductCardProps = {
    product: Product;
    detailBasePath?: string;
};

/**
 * Legacy storefront card kept for reference while the app transitions from products to flights.
 */
export default function ProductCard({ product, detailBasePath = '/product' }: ProductCardProps) {
    return (
        <div className="border rounded p-4 shadow hover:shadow-lg transition">
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={160}
                className="h-40 w-full object-cover"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <span className="font-semibold">${product.price}</span>
            <Link href={`${detailBasePath}/${product.id}`} className="block mt-2 text-blue-600 underline">
                View Details
            </Link>
        </div>
    );
}
