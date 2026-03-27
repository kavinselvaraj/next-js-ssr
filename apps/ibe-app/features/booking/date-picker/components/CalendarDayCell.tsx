'use client';

/**
 * CalendarDayCell Component
 * Reusable day cell for the date picker calendar
 * Renders individual date with various states (selected, disabled, range, etc.)
 */

import React from 'react';
import type { CalendarDayCellProps } from '../types';
import { getDateCellClasses, formatPrice, getISODateString } from '../utils';
import { FOCUS_OUTLINE_CLASS } from '../constants';

/**
 * Single calendar day cell component
 * Responsive to different states: default, selected, disabled, in-range, etc.
 * Supports keyboard interaction (Enter, Space) and hover effects
 * Shows optional price/fare information
 */
export const CalendarDayCell = React.memo(
    ({
        date,
        state,
        price,
        currency = 'JPY',
        onClick,
        onHover,
        showPrice = true,
    }: CalendarDayCellProps) => {
        const day = date.getDate();
        const isDisabled = state === 'disabled' || state === 'unavailable';
        const baseClasses = getDateCellClasses(state);

        const handleClick = () => {
            if (!isDisabled) {
                onClick(date);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
                e.preventDefault();
                onClick(date);
            }
        };

        const handleMouseEnter = () => {
            onHover(date);
        };

        const handleMouseLeave = () => {
            onHover(null);
        };

        const isoDate = getISODateString(date);

        return (
            <button
                type="button"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={isDisabled}
                aria-pressed={state === 'selected' || state === 'rangeStart' || state === 'rangeEnd'}
                aria-disabled={isDisabled}
                data-date={isoDate}
                className={`
          relative
          h-12 w-full
          flex flex-col items-center justify-center
          text-sm font-medium
          rounded-md
          transition-colors duration-150
          ${baseClasses}
          ${!isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'}
          ${!isDisabled ? FOCUS_OUTLINE_CLASS : ''}
        `}
            >
                {/* Day number */}
                <span className="leading-none">{day}</span>

                {/* Price display (optional) */}
                {showPrice && price && !isDisabled && (
                    <span
                        className="text-xs mt-0.5 opacity-80 leading-none"
                        title={`Price: ${formatPrice(price, currency)}`}
                    >
                        {formatPrice(price, currency)}
                    </span>
                )}

                {/* Availability indicator for unavailable dates */}
                {state === 'unavailable' && (
                    <span className="text-xs opacity-60 leading-none">✕</span>
                )}
            </button>
        );
    }
);

CalendarDayCell.displayName = 'CalendarDayCell';
