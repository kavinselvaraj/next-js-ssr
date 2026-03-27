/**
 * Utility functions for date operations and calendar calculations
 */

import type { CalendarDay, DateCellState, FareCalendarData } from './types';
import { DATE_CELL_STATE_CLASSES } from './constants';

/**
 * Get ISO date string (YYYY-MM-DD) from Date object
 */
export function getISODateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Clone a date to avoid mutation issues
 */
export function cloneDate(date: Date): Date {
    return new Date(date.getTime());
}

/**
 * Set date to start of day (00:00:00.000)
 */
export function setDateToStartOfDay(date: Date): Date {
    const d = cloneDate(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Check if two dates are the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Check if date1 is before date2 (ignoring time)
 */
export function isDateBefore(date1: Date, date2: Date): boolean {
    const d1 = setDateToStartOfDay(date1);
    const d2 = setDateToStartOfDay(date2);
    return d1.getTime() < d2.getTime();
}

/**
 * Check if date1 is after date2 (ignoring time)
 */
export function isDateAfter(date1: Date, date2: Date): boolean {
    return isDateBefore(date2, date1);
}

/**
 * Check if a date is between two dates (inclusive)
 */
export function isDateBetween(
    date: Date,
    startDate: Date,
    endDate: Date,
    inclusive = true
): boolean {
    const d = setDateToStartOfDay(date);
    const s = setDateToStartOfDay(startDate);
    const e = setDateToStartOfDay(endDate);

    if (inclusive) {
        return d.getTime() >= s.getTime() && d.getTime() <= e.getTime();
    }
    return d.getTime() > s.getTime() && d.getTime() < e.getTime();
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

/**
 * Get number of days between two dates
 */
export function getDaysBetween(date1: Date, date2: Date): number {
    const d1 = setDateToStartOfDay(date1);
    const d2 = setDateToStartOfDay(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Add days to a date
 */
export function addDaysToDate(date: Date, days: number): Date {
    const d = cloneDate(date);
    d.setDate(d.getDate() + days);
    return d;
}

/**
 * Get first day of month (0 = Sunday, ..., 6 = Saturday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

/**
 * Get number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Generate calendar days for a given month
 */
export function generateCalendarDays(
    year: number,
    month: number,
    fareCalendarData?: FareCalendarData,
    constraints?: {
        minDate?: Date;
        maxDate?: Date;
        unavailableDates?: Date[];
        disablePastDates?: boolean;
        selectedDates?: { departure?: Date; return?: Date };
    }
): CalendarDay[] {
    const days: CalendarDay[] = [];
    const daysInMonth = getDaysInMonth(year, month);
    const today = new Date();

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const date = new Date(year, month, dayNum);
        const isoDate = getISODateString(date);
        const fareData = fareCalendarData?.[isoDate];

        // Determine cell state
        let state: DateCellState = 'default';

        // Check if past date
        if (
            constraints?.disablePastDates &&
            isDateBefore(date, today) &&
            !isToday(date)
        ) {
            state = 'disabled';
        }

        // Check if outside min/max date range
        if (constraints?.minDate && isDateBefore(date, constraints.minDate)) {
            state = 'disabled';
        }
        if (constraints?.maxDate && isDateAfter(date, constraints.maxDate)) {
            state = 'disabled';
        }

        // Check if unavailable
        if (
            state !== 'disabled' &&
            constraints?.unavailableDates?.some((d) => isSameDay(d, date))
        ) {
            state = 'unavailable';
        }

        // Check if unavailable per fare data
        if (state !== 'disabled' && fareData?.available === false) {
            state = 'unavailable';
        }

        // Check if today (only if not already disabled/unavailable)
        if (state === 'default' && isToday(date)) {
            state = 'today';
        }

        days.push({
            date: cloneDate(date),
            state,
            availabilityId: fareData?.restrictionCode,
            price: fareData?.price,
            currency: fareData?.currency,
            available: fareData?.available ?? (state !== 'disabled' && state !== 'unavailable'),
        });
    }

    return days;
}

/**
 * Determine date cell state based on selection and hover state
 */
export function determineDateCellState(
    date: Date,
    departureDate: Date | null,
    returnDate: Date | null,
    hoveredDate: Date | null,
    baseState: DateCellState
): DateCellState {
    // If base state is disabled/unavailable, never change it
    if (baseState === 'disabled' || baseState === 'unavailable') {
        return baseState;
    }

    // One-way mode: only one date can be selected
    if (!returnDate) {
        if (departureDate && isSameDay(date, departureDate)) {
            return 'selected';
        }
        return baseState;
    }

    // Round-trip mode: highlight range
    if (!departureDate || !returnDate) {
        return baseState;
    }

    const earlier = isDateBefore(departureDate, returnDate) ? departureDate : returnDate;
    const later = isDateAfter(departureDate, returnDate) ? departureDate : returnDate;

    // Range start
    if (isSameDay(date, earlier)) {
        return 'rangeStart';
    }

    // Range end
    if (isSameDay(date, later)) {
        return 'rangeEnd';
    }

    // Range middle
    if (isDateBetween(date, earlier, later, false)) {
        return 'rangeMiddle';
    }

    // Hovered date preview (for better UX during selection)
    if (hoveredDate && !isSameDay(date, hoveredDate)) {
        // Could implement preview styling here
    }

    return baseState;
}

/**
 * Format date as localized string
 * Supports i18n in future
 */
export function formatDateLabel(
    date: Date,
    locale = 'en-US'
): string {
    if (locale.startsWith('ja')) {
        // Japanese format: 7月16日
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }

    // Default English: Jul 16, 2025
    return date.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Format date for display in range (e.g., "Jul 16 - Jul 20")
 */
export function formatDateRange(
    departureDate: Date,
    returnDate: Date,
    locale = 'en-US'
): string {
    const departure = formatDateLabel(departureDate, locale);
    const returnLabel = formatDateLabel(returnDate, locale);
    return `${departure} - ${returnLabel}`;
}

/**
 * Get Tailwind classes for a date cell state
 */
export function getDateCellClasses(state: DateCellState): string {
    return DATE_CELL_STATE_CLASSES[state] || DATE_CELL_STATE_CLASSES.default;
}

/**
 * Check if round-trip dates are valid (return >= departure)
 */
export function isValidRoundTripSelection(
    departureDate: Date | null,
    returnDate: Date | null,
    minStay = 0,
    maxStay = 365
): boolean {
    if (!departureDate || !returnDate) {
        return false;
    }

    if (isDateAfter(departureDate, returnDate)) {
        return false; // return can't be before departure
    }

    const stayLength = getDaysBetween(departureDate, returnDate);
    if (stayLength < minStay || stayLength > maxStay) {
        return false;
    }

    return true;
}

/**
 * Check if one-way selection is valid
 */
export function isValidOneWaySelection(departureDate: Date | null): boolean {
    return departureDate !== null;
}

/**
 * Get month offset from today
 * Returns 0 for current month, 1 for next month, etc.
 */
export function getMonthOffset(date: Date): number {
    const today = new Date();
    const months =
        (date.getFullYear() - today.getFullYear()) * 12 +
        (date.getMonth() - today.getMonth());
    return months;
}

/**
 * Get date for a given month offset from today
 */
export function getDateForMonthOffset(offset: number): Date {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    d.setDate(1);
    return d;
}

/**
 * Swap dates if needed (ensures departure <= return)
 * Useful for intelligently handling user selection in round-trip
 */
export function smartSwapDatesIfNeeded(
    date1: Date | null,
    date2: Date | null
): [Date | null, Date | null] {
    if (!date1 || !date2) {
        return [date1, date2];
    }

    if (isDateBefore(date2, date1)) {
        return [date2, date1];
    }

    return [date1, date2];
}

/**
 * Format price for display
 */
export function formatPrice(
    price: number | undefined,
    currency = 'JPY'
): string {
    if (!price) return '';

    const currencySymbols: Record<string, string> = {
        JPY: '¥',
        USD: '$',
        EUR: '€',
        GBP: '£',
    };

    const symbol = currencySymbols[currency] || currency;

    if (currency === 'JPY') {
        return `${symbol}${Math.round(price).toLocaleString('ja-JP')}`;
    }

    return `${symbol}${price.toFixed(2)}`;
}

/**
 * Clamp a date between min and max
 */
export function clampDate(
    date: Date,
    minDate?: Date,
    maxDate?: Date
): Date {
    let result = cloneDate(date);

    if (minDate && isDateBefore(result, minDate)) {
        result = cloneDate(minDate);
    }

    if (maxDate && isDateAfter(result, maxDate)) {
        result = cloneDate(maxDate);
    }

    return result;
}
