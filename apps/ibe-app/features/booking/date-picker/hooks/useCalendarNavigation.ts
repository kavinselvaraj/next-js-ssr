'use client';

/**
 * useCalendarNavigation Hook
 * Manages calendar month navigation and visibility
 * Handles constraints (min/max months) and month offset logic
 */

import { useCallback, useMemo, useState } from 'react';
import type { CalendarMonth, CalendarNavigationState } from '../types';
import {
    generateCalendarDays,
    getDaysInMonth,
    getFirstDayOfMonth,
    getDateForMonthOffset,
    getISODateString,
} from '../utils';

interface UseCalendarNavigationOptions {
    monthsToShow?: number;
    initialMonthOffset?: number;
    minMonthOffset?: number;
    maxMonthOffset?: number;
    fareCalendarData?: Record<string, { price?: number; currency?: string; available?: boolean }>;
    constraints?: {
        minDate?: Date;
        maxDate?: Date;
        unavailableDates?: Date[];
        disablePastDates?: boolean;
    };
}

/**
 * Hook for managing calendar month navigation
 * Generates visible months, handles previous/next navigation
 */
export function useCalendarNavigation(
    options: UseCalendarNavigationOptions = {}
): CalendarNavigationState {
    const {
        monthsToShow = 2,
        initialMonthOffset = 0,
        minMonthOffset = 0,
        maxMonthOffset = 11,
        fareCalendarData,
        constraints,
    } = options;

    const [monthOffset, setMonthOffset] = useState(initialMonthOffset);

    /**
     * Generate calendar month data
     */
    const generateMonth = useCallback(
        (offset: number): CalendarMonth => {
            const monthDate = getDateForMonthOffset(offset);
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const daysInMonth = getDaysInMonth(year, month);
            const firstDayOfWeek = getFirstDayOfMonth(year, month);

            // Generate padding for days before month starts
            const paddingDays: CalendarMonth['days'] = [];
            for (let i = 0; i < firstDayOfWeek; i++) {
                // Create padding "empty" days
                const paddingDate = new Date(year, month, -(firstDayOfWeek - i));
                paddingDays.push({
                    date: paddingDate,
                    state: 'disabled',
                    available: false,
                });
            }

            // Generate actual month days
            const actualDays = generateCalendarDays(
                year,
                month,
                fareCalendarData,
                constraints
            );

            const allDays = [...paddingDays, ...actualDays];

            return {
                year,
                month,
                days: allDays,
            };
        },
        [fareCalendarData, constraints]
    );

    /**
     * Generate all visible months based on current offset
     */
    const visibleMonths = useMemo(() => {
        const months: CalendarMonth[] = [];
        for (let i = 0; i < monthsToShow; i++) {
            months.push(generateMonth(monthOffset + i));
        }
        return months;
    }, [monthOffset, monthsToShow, generateMonth]);

    /**
     * Get indices of visible months
     */
    const visibleMonthIndices = useMemo(
        () =>
            Array.from({ length: monthsToShow }, (_, i) => monthOffset + i),
        [monthOffset, monthsToShow]
    );

    /**
     * Check if can navigate to previous month
     */
    const canGoToPrevious = monthOffset > minMonthOffset;

    /**
     * Check if can navigate to next month
     */
    const canGoToNext = monthOffset + monthsToShow - 1 < maxMonthOffset;

    /**
     * Navigate to previous month
     */
    const goToPreviousMonth = useCallback(() => {
        setMonthOffset((prev) => Math.max(prev - 1, minMonthOffset));
    }, [minMonthOffset]);

    /**
     * Navigate to next month
     */
    const goToNextMonth = useCallback(() => {
        setMonthOffset((prev) =>
            Math.min(prev + 1, maxMonthOffset - monthsToShow + 1)
        );
    }, [maxMonthOffset, monthsToShow]);

    /**
     * Jump to specific month offset
     */
    const goToMonth = useCallback(
        (offset: number) => {
            const clamped = Math.max(
                minMonthOffset,
                Math.min(offset, maxMonthOffset - monthsToShow + 1)
            );
            setMonthOffset(clamped);
        },
        [minMonthOffset, maxMonthOffset, monthsToShow]
    );

    return {
        visibleMonths,
        visibleMonthIndices,
        canGoToPrevious,
        canGoToNext,
        goToPreviousMonth,
        goToNextMonth,
        goToMonth,
    };
}
