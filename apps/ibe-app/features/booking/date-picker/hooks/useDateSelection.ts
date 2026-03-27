'use client';

/**
 * useDateSelection Hook
 * Manages date selection state for both one-way and round-trip booking modes
 * Handles single date selection, date range logic, validation, and state
 */

import { useCallback, useRef, useState } from 'react';
import type { DateSelection, DateSelectionState, TripType } from '../types';
import {
    isValidOneWaySelection,
    isValidRoundTripSelection,
    isSameDay,
    isDateBefore,
    cloneDate,
    smartSwapDatesIfNeeded,
} from '../utils';
import {
    DEFAULT_ROUND_TRIP_MIN_STAY,
    DEFAULT_ROUND_TRIP_MAX_STAY,
} from '../constants';

interface UseDateSelectionOptions {
    tripType: TripType;
    initialDepartureDate?: Date | null;
    initialReturnDate?: Date | null;
    minStay?: number;
    maxStay?: number;
    onSelectionChange?: (selection: DateSelection) => void;
}

/**
 * Hook for managing date selection state
 * Handles both one-way (single date) and round-trip (date range) modes
 * Provides smart UX logic: first click sets departure, second sets return (with optional swap)
 */
export function useDateSelection(
    options: UseDateSelectionOptions
): DateSelectionState {
    const {
        tripType,
        initialDepartureDate,
        initialReturnDate,
        minStay = DEFAULT_ROUND_TRIP_MIN_STAY,
        maxStay = DEFAULT_ROUND_TRIP_MAX_STAY,
        onSelectionChange,
    } = options;

    // Main selection state
    const [selection, setSelection] = useState<DateSelection>({
        tripType,
        departureDate: initialDepartureDate || null,
        returnDate: initialReturnDate || null,
        hoveredDate: null,
        focusedInput: 'departure',
    });

    // Track which input is being edited (for better UX in round-trip)
    const focusedInputRef = useRef<'departure' | 'return'>('departure');

    /**
     * Update selection state and notify parent
     */
    const updateSelection = useCallback(
        (updates: Partial<DateSelection>) => {
            setSelection((prev) => {
                const updated = { ...prev, ...updates };
                onSelectionChange?.(updated);
                return updated;
            });
        },
        [onSelectionChange]
    );

    /**
     * Handle date cell click
     * Behavior depends on trip type and current state
     */
    const handleDateClick = useCallback(
        (date: Date) => {
            const clonedDate = cloneDate(date);

            if (tripType === 'oneWay') {
                // One-way: single date selection
                updateSelection({
                    departureDate: clonedDate,
                    returnDate: null,
                });
            } else {
                // Round-trip: date range logic
                if (!selection.departureDate) {
                    // First click sets departure date
                    updateSelection({
                        departureDate: clonedDate,
                        returnDate: null,
                        focusedInput: 'return', // Move focus to return date input
                    });
                } else if (!selection.returnDate) {
                    // Second click sets return date
                    // Smart logic: if user clicks earlier date, swap intelligently
                    const [departure, returnDate] = smartSwapDatesIfNeeded(
                        selection.departureDate,
                        clonedDate
                    );

                    // Validate stay length
                    if (
                        isValidRoundTripSelection(departure, returnDate, minStay, maxStay)
                    ) {
                        updateSelection({
                            departureDate: departure,
                            returnDate,
                            focusedInput: undefined,
                        });
                    } else {
                        // If validation fails (e.g., too short stay), reset and set as new departure
                        updateSelection({
                            departureDate: clonedDate,
                            returnDate: null,
                            focusedInput: 'return',
                        });
                    }
                } else {
                    // Both dates already selected
                    // Determine intent: did user click departure or return area?
                    const clickedDeparture = isSameDay(date, selection.departureDate);
                    const clickedReturn = isSameDay(date, selection.returnDate);

                    if (clickedDeparture) {
                        // Clicked on departure: allow changing departure date
                        updateSelection({
                            departureDate: clonedDate,
                            returnDate: null,
                            focusedInput: 'return',
                        });
                    } else if (clickedReturn) {
                        // Clicked on return: allow changing return date
                        updateSelection({
                            departureDate: selection.departureDate,
                            returnDate: clonedDate,
                            focusedInput: undefined,
                        });
                    } else {
                        // Clicked elsewhere: start new selection
                        updateSelection({
                            departureDate: clonedDate,
                            returnDate: null,
                            focusedInput: 'return',
                        });
                    }
                }
            }
        },
        [selection, tripType, updateSelection, minStay, maxStay]
    );

    /**
     * Handle hovering over a date (for range preview in round-trip)
     */
    const handleHoverDate = useCallback(
        (date: Date | null) => {
            updateSelection({
                hoveredDate: date,
            });
        },
        [updateSelection]
    );

    /**
     * Handle focus on departure/return input
     */
    const handleFocusInput = useCallback(
        (input: 'departure' | 'return') => {
            focusedInputRef.current = input;
            updateSelection({
                focusedInput: input,
            });
        },
        [updateSelection]
    );

    /**
     * Reset selection to initial state
     */
    const resetSelection = useCallback(() => {
        updateSelection({
            departureDate: initialDepartureDate || null,
            returnDate: initialReturnDate || null,
            hoveredDate: null,
            focusedInput: 'departure',
        });
    }, [updateSelection, initialDepartureDate, initialReturnDate]);

    /**
     * Get confirmed selection (used when confirm button is clicked)
     */
    const confirmSelection = useCallback(() => {
        return {
            departureDate: selection.departureDate,
            returnDate: selection.returnDate,
        };
    }, [selection]);

    /**
     * Validate current selection
     */
    const isValid =
        tripType === 'oneWay'
            ? isValidOneWaySelection(selection.departureDate)
            : isValidRoundTripSelection(
                selection.departureDate,
                selection.returnDate,
                minStay,
                maxStay
            );

    return {
        selection,
        isValid,
        canConfirm: isValid,
        handleDateClick,
        handleHoverDate,
        handleFocusInput,
        resetSelection,
        confirmSelection,
    };
}
