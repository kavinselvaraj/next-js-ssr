'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

type LanguageContextValue = {
  locale: string;
};

const LanguageContext = createContext<LanguageContextValue>({ locale: 'en-us' });

type LanguageProviderProps = {
  children: ReactNode;
  locale: string;
};

export function LanguageProvider({ children, locale }: LanguageProviderProps) {
  const value = useMemo<LanguageContextValue>(() => ({ locale }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
