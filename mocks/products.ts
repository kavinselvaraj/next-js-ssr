import { Product } from '../types/product';

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Next.js T-Shirt',
        description: 'High-quality cotton t-shirt with Next.js logo.',
        price: 25,
        imageUrl: '/images/nextjs-tshirt.svg',
    },
    {
        id: '2',
        name: 'React Mug',
        description: 'Ceramic mug for React developers.',
        price: 15,
        imageUrl: '/images/react-mug.svg',
    },
    {
        id: '3',
        name: 'TypeScript Sticker',
        description: 'Decorate your laptop with TS pride.',
        price: 5,
        imageUrl: '/images/ts-sticker.svg',
    },
];
