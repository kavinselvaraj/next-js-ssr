/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['@skybridge/ui'],
    async redirects() {
        return [
            {
                source: '/product',
                destination: '/flights',
                permanent: false,
            },
            {
                source: '/product/:id',
                destination: '/flights/:id',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
