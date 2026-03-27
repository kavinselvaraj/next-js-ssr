'use client';

/**
 * CalendarGrid Component
 * Renders a grid of calendar days (typically 7 columns for a week)
 * Handles weekday labels and day cell layout
 */

import React from 'react';
import type { CalendarGridProps } from '../types';
import { CalendarDayCell } from './CalendarDayCell';
import { WEEKDAY_LABELS_EN } from '../constants';

/**
 * Grid layout for calendar days
 * Renders 7 columns (one for each weekday)
 * Includes weekday labels and day cells
 */
export const CalendarGrid = React.memo(
    ({
        days,
        onDayClick,
        onDayHover,
        showFares = true,
        weekStartsOn = 0,
    }: CalendarGridProps) => {
        // Get weekday labels based on starting day
        const getWeekdayLabels = () => {
            if (weekStartsOn === 0) {
                return WEEKDAY_LABELS_EN; // Sun-Sat
            }
            // For other week start days, rotate the labels
            return [
                ...WEEKDAY_LABELS_EN.slice(weekStartsOn),
                ...WEEKDAY_LABELS_EN.slice(0, weekStartsOn),
            ];
        };

        const weekdayLabels = getWeekdayLabels();

        return (
            <div className="w-full">
                {/* Weekday header labels */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekdayLabels.map((label) => (
                        <div
                            key={label}
                            className="text-center text-xs font-semibold text-slate-600 h-8 flex items-center justify-center"
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Calendar day grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => (
                        <CalendarDayCell
                            key={`${day.date.getTime()}-${index}`}
                            date={day.date}
                            state={day.state}
                            price={day.price}
                            currency={day.currency}
                            onClick={onDayClick}
                            onHover={onDayHover}
                            showPrice={showFares}
                        />
                    ))}
                </div>
            </div>
        );
    }
);

CalendarGrid.displayName = 'CalendarGrid';
