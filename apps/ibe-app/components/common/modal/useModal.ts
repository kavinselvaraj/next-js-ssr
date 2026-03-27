'use client';

/**
 * useModal Hook
 * Simplifies modal state management across the application
 */

import { useCallback, useState } from 'react';
import type { UseModalReturn } from './types';

/**
 * Hook for managing modal open/close state
 * Returns isOpen, open, close, and toggle functions
 */
export function useModal(initialOpen = false): UseModalReturn {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}
