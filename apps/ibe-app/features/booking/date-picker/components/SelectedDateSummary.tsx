'use client';

/**
 * SelectedDateSummary Component
 * Displays the currently selected date(s)
 * Supports both one-way (single date) and round-trip (date range) display
 */

import React, { useMemo } from 'react';
import type { SelectedDateSummaryProps } from '../types';
import {
    formatDateLabel,
    formatDateRange,
} from '../utils';

/**
 * Summary display of selected dates
 * Shows departure date for one-way
 * Shows departure and return dates for round-trip
 */
export const SelectedDateSummary = React.memo(
    ({
        tripType,
        departureDate,
        returnDate,
        locale = 'en-US',
    }: SelectedDateSummaryProps) => {
        const displayText = useMemo(() => {
            if (tripType === 'oneWay') {
                if (!departureDate) {
                    return 'Select departure date';
                }
                return `Departure: ${formatDateLabel(departureDate, locale)}`;
            }

            // Round-trip
            if (!departureDate || !returnDate) {
                if (!departureDate) {
                    return 'Select dates';
                }
                return `Departure: ${formatDateLabel(departureDate, locale)}`;
            }

            return formatDateRange(departureDate, returnDate, locale);
        }, [tripType, departureDate, returnDate, locale]);

        const textStyle =
            tripType === 'oneWay' || departureDate && returnDate
                ? 'text-slate-900 font-medium'
                : 'text-slate-600';

        return (
            <div className={`px-4 py-3 bg-slate-50 rounded-md text-sm ${textStyle}`}>
                {displayText}
            </div>
        );
    }
);

SelectedDateSummary.displayName = 'SelectedDateSummary';
