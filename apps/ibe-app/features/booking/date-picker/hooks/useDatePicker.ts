'use client';

/**
 * useDatePicker Hook
 * Top-level orchestration hook for the complete date picker system
 * Combines date selection and calendar navigation logic
 */

import { useCallback, useEffect, useRef } from 'react';
import type {
    DatePickerState,
    DatePickerProps,
    DatePickerConstraints,
    FareCalendarData,
    TripType,
} from '../types';
import { useDateSelection } from './useDateSelection';
import { useCalendarNavigation } from './useCalendarNavigation';
import { DEFAULT_ROUND_TRIP_MIN_STAY, DEFAULT_ROUND_TRIP_MAX_STAY } from '../constants';

interface UseDatePickerOptions extends Omit<DatePickerProps, 'isOpen' | 'onClose' | 'onConfirm'> {
    onConfirm: (selection: {
        departureDate: Date | null;
        returnDate: Date | null;
    }) => void;
    onReset?: () => void;
}

/**
 * Top-level date picker hook
 * Manages both date selection and calendar navigation
 * Provides a unified interface for modal integration
 */
export function useDatePicker(
    options: UseDatePickerOptions
): DatePickerState {
    const {
        tripType,
        initialDepartureDate,
        initialReturnDate,
        constraints = {},
        fareCalendarData,
        calendarConfig = {},
        onConfirm,
        onReset,
    } = options;

    // Extract constraint values
    const {
        minDate,
        maxDate,
        unavailableDates,
        minStay = DEFAULT_ROUND_TRIP_MIN_STAY,
        maxStay = DEFAULT_ROUND_TRIP_MAX_STAY,
        disablePastDates = true,
    } = constraints;

    // Calendar config
    const monthsToShow = calendarConfig.monthsToShow ?? 2;
    const weekStartsOn = calendarConfig.weekStartsOn ?? 0;

    // Date selection logic
    const dateSelection = useDateSelection({
        tripType,
        initialDepartureDate,
        initialReturnDate,
        minStay,
        maxStay,
    });

    // Calendar navigation logic
    const calendarNavigation = useCalendarNavigation({
        monthsToShow,
        initialMonthOffset: 0,
        minMonthOffset: 0,
        maxMonthOffset: 11,
        fareCalendarData,
        constraints: {
            minDate,
            maxDate,
            unavailableDates,
            disablePastDates,
        },
    });

    // Lock body scroll when modal is open (managed by parent)
    const scrollLockRef = useRef(false);

    /**
     * Lock body scroll
     */
    const lockBodyScroll = useCallback(() => {
        if (typeof document !== 'undefined' && !scrollLockRef.current) {
            document.body.style.overflow = 'hidden';
            scrollLockRef.current = true;
        }
    }, []);

    /**
     * Unlock body scroll
     */
    const unlockBodyScroll = useCallback(() => {
        if (typeof document !== 'undefined' && scrollLockRef.current) {
            document.body.style.overflow = '';
            scrollLockRef.current = false;
        }
    }, []);

    /**
     * Get confirmed selection
     */
    const getConfirmedSelection = () => ({
        departureDate: dateSelection.selection.departureDate,
        returnDate: dateSelection.selection.returnDate,
    });

    /**
     * Handle confirm selection
     */
    const handleConfirmSelection = useCallback(() => {
        if (dateSelection.canConfirm) {
            onConfirm({
                departureDate: dateSelection.selection.departureDate,
                returnDate: dateSelection.selection.returnDate,
            });
        }
    }, [dateSelection, onConfirm]);

    /**
     * Handle reset
     */
    const handleReset = useCallback(() => {
        dateSelection.resetSelection();
        onReset?.();
    }, [dateSelection, onReset]);

    /**
     * Clean up on unmount
     */
    useEffect(() => {
        return () => {
            unlockBodyScroll();
        };
    }, [unlockBodyScroll]);

    return {
        dateSelection,
        calendarNavigation,
        isInitialized: true,
    };
}

/**
 * Hook to manage modal open/close state
 * Handles body scroll lock and focus management
 */
export function useDatePickerModal(isOpen: boolean) {
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            previousFocusRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);
}
