'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SessionState = 'active' | 'warning' | 'expired';

type UseSessionTimeoutOptions = {
    warningAfterMs?: number;
    timeoutAfterMs?: number;
    redirectDelayMs?: number;
    onExpire?: () => void;
    onRedirect?: () => void;
};

const DEFAULT_WARNING_AFTER_MS = 14 * 60 * 1000;
const DEFAULT_TIMEOUT_AFTER_MS = 15 * 60 * 1000;
const DEFAULT_REDIRECT_DELAY_MS = 2000;

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
    'mousemove',
    'click',
    'keydown',
    'scroll',
    'touchstart',
    'touchmove',
];

function clearSessionStorageByPattern(storage: Storage, pattern: RegExp) {
    const keys = Object.keys(storage);

    for (const key of keys) {
        if (pattern.test(key)) {
            storage.removeItem(key);
        }
    }
}

export function clearSessionAuthData() {
    clearSessionStorageByPattern(window.localStorage, /(auth|session|token)/i);
    clearSessionStorageByPattern(window.sessionStorage, /(auth|session|token)/i);
}

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}) {
    const {
        warningAfterMs = DEFAULT_WARNING_AFTER_MS,
        timeoutAfterMs = DEFAULT_TIMEOUT_AFTER_MS,
        redirectDelayMs = DEFAULT_REDIRECT_DELAY_MS,
        onExpire,
        onRedirect,
    } = options;

    const [state, setState] = useState<SessionState>('active');
    const [countdownSeconds, setCountdownSeconds] = useState(0);

    const stateRef = useRef<SessionState>('active');
    const warningStartedAtRef = useRef<number | null>(null);

    const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const expireTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const expiredRef = useRef(false);

    const warningDurationMs = Math.max(timeoutAfterMs - warningAfterMs, 0);

    const setSessionState = useCallback((nextState: SessionState) => {
        stateRef.current = nextState;
        setState(nextState);
    }, []);

    const clearCountdownInterval = useCallback(() => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    }, []);

    const updateCountdown = useCallback(() => {
        if (!warningStartedAtRef.current) {
            setCountdownSeconds(0);
            return;
        }

        const elapsedMs = Date.now() - warningStartedAtRef.current;
        const remainingMs = Math.max(warningDurationMs - elapsedMs, 0);
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        setCountdownSeconds(remainingSeconds);
    }, [warningDurationMs]);

    const startWarningCountdown = useCallback(() => {
        warningStartedAtRef.current = Date.now();
        updateCountdown();
        clearCountdownInterval();

        countdownIntervalRef.current = setInterval(() => {
            updateCountdown();
        }, 1000);
    }, [clearCountdownInterval, updateCountdown]);

    const clearTimers = useCallback(() => {
        if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
            warningTimeoutRef.current = null;
        }

        if (expireTimeoutRef.current) {
            clearTimeout(expireTimeoutRef.current);
            expireTimeoutRef.current = null;
        }

        if (redirectTimeoutRef.current) {
            clearTimeout(redirectTimeoutRef.current);
            redirectTimeoutRef.current = null;
        }

        clearCountdownInterval();
    }, [clearCountdownInterval]);

    const triggerExpiryFlow = useCallback(() => {
        if (expiredRef.current) {
            return;
        }

        expiredRef.current = true;
        setSessionState('expired');
        clearCountdownInterval();
        setCountdownSeconds(0);
        onExpire?.();

        redirectTimeoutRef.current = setTimeout(() => {
            onRedirect?.();
        }, redirectDelayMs);
    }, [clearCountdownInterval, onExpire, onRedirect, redirectDelayMs, setSessionState]);

    const scheduleTimers = useCallback(() => {
        clearTimers();
        warningStartedAtRef.current = null;
        setCountdownSeconds(0);

        warningTimeoutRef.current = setTimeout(() => {
            setSessionState('warning');
            startWarningCountdown();
        }, warningAfterMs);

        expireTimeoutRef.current = setTimeout(() => {
            triggerExpiryFlow();
        }, timeoutAfterMs);
    }, [
        clearTimers,
        warningAfterMs,
        timeoutAfterMs,
        setSessionState,
        startWarningCountdown,
        triggerExpiryFlow,
    ]);

    const resetSession = useCallback(() => {
        if (expiredRef.current) {
            return;
        }

        setSessionState('active');
        scheduleTimers();
    }, [scheduleTimers, setSessionState]);

    useEffect(() => {
        scheduleTimers();

        const handleActivity = () => {
            if (stateRef.current !== 'active') {
                return;
            }

            resetSession();
        };

        for (const eventName of ACTIVITY_EVENTS) {
            window.addEventListener(eventName, handleActivity, { passive: true });
        }

        return () => {
            for (const eventName of ACTIVITY_EVENTS) {
                window.removeEventListener(eventName, handleActivity);
            }

            clearTimers();
        };
    }, [clearTimers, resetSession, scheduleTimers]);

    return useMemo(
        () => ({
            state,
            isWarningVisible: state === 'warning',
            isExpired: state === 'expired',
            countdownSeconds,
            continueSession: resetSession,
        }),
        [countdownSeconds, resetSession, state],
    );
}
