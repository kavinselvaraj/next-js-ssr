import type { AppProps } from 'next/app';
import SiteLayout from '../components/SiteLayout';
import '../styles/globals.css';

/**
 * Injects the shared airline layout around every Pages Router screen.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SiteLayout>
            <Component {...pageProps} />
        </SiteLayout>
    );
}
