import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SkyBridge Admin',
    description: 'Admin console for SkyBridge applications'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'Inter, system-ui, sans-serif', background: '#f8fafc' }}>
                {children}
            </body>
        </html>
    );
}
