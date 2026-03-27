'use client';

import { useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SessionTimeoutModal } from '../components/ui';
import { clearSessionAuthData, useSessionTimeout } from '../hooks/useSessionTimeout';

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const router = useRouter();

  const handleExpire = useCallback(() => {
    clearSessionAuthData();
  }, []);

  const handleRedirect = useCallback(() => {
    router.replace('/');
  }, [router]);

  const { isWarningVisible, isExpired, countdownSeconds, continueSession } = useSessionTimeout({
    onExpire: handleExpire,
    onRedirect: handleRedirect,
  });

  return (
    <>
      {children}
      <SessionTimeoutModal
        isWarningVisible={isWarningVisible}
        isExpired={isExpired}
        countdownSeconds={countdownSeconds}
        onContinueSession={continueSession}
      />
    </>
  );
}
