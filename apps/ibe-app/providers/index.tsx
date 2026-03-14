'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from './session-provider';
import { LanguageProvider } from './language-provider';
import { StoreProvider } from './store-provider';
import { QueryProvider } from './query-provider';

type ProvidersProps = {
  children: ReactNode;
  locale: string;
};

export function Providers({ children, locale }: ProvidersProps) {
  return (
    <SessionProvider>
      <LanguageProvider locale={locale}>
        <StoreProvider>
          <QueryProvider>{children}</QueryProvider>
        </StoreProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}

export default Providers;
