'use client';

import type { ReactNode } from 'react';

type StoreProviderProps = {
  children: ReactNode;
};

export function StoreProvider({ children }: StoreProviderProps) {
  return <>{children}</>;
}
