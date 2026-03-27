'use client';

/**
 * CalendarMonth Component
 * Renders a complete month calendar with month label and day grid
 */

import React, { useMemo } from 'react';
import type { CalendarMonthProps } from '../types';
import { CalendarGrid } from './CalendarGrid';
import { MONTH_LABELS_EN } from '../constants';
import {
    determineDateCellState,
    formatDateLabel,
} from '../utils';

/**
 * Single month calendar view
 * Shows month label and full calendar grid
 * Integrates with parent selection state for proper cell styling
 */
export const CalendarMonth = React.memo(
    ({
        month,
        showFares = true,
        onDayClick,
        onDayHover,
        monthLabel,
        locale = 'en-US',
    }: CalendarMonthProps) => {
        // Format month label
        const displayLabel = useMemo(() => {
            if (monthLabel) return monthLabel;

            const monthName = locale.startsWith('ja')
                ? `${month.month + 1}月`
                : MONTH_LABELS_EN[month.month];

            return `${monthName} ${month.year}`;
        }, [month, monthLabel, locale]);

        return (
            <div className="space-y-4">
                {/* Month label */}
                <div className="flex h-11 items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {displayLabel}
                    </h3>
                </div>

                {/* Calendar grid */}
                <CalendarGrid
                    days={month.days}
                    onDayClick={onDayClick}
                    onDayHover={onDayHover}
                    showFares={showFares}
                    weekStartsOn={0}
                />
            </div>
        );
    }
);

CalendarMonth.displayName = 'CalendarMonth';
