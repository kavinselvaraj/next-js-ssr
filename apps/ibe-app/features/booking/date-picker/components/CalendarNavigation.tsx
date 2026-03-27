'use client';

/**
 * CalendarNavigation Component
 * Navigation controls for moving between months
 * Shows previous/next arrow buttons
 */

import React from 'react';
import type { CalendarNavigationProps } from '../types';

/**
 * Navigation controls for calendar month pagination
 * Renders previous/next buttons with proper disabled states
 */
export const CalendarNavigation = React.memo(
    ({
        canGoToPrevious,
        canGoToNext,
        onPrevious,
        onNext,
        currentMonthLabel,
        className,
        buttonClassName,
    }: CalendarNavigationProps) => {
        return (
            <div className={['flex items-center justify-between', className].filter(Boolean).join(' ')}>
                {/* Previous month button */}
                <button
                    type="button"
                    onClick={onPrevious}
                    disabled={!canGoToPrevious}
                    aria-label="Previous month"
                    className={[
                        'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150',
                        'enabled:hover:bg-slate-100 enabled:cursor-pointer',
                        'disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50',
                        buttonClassName,
                    ].join(' ')}
                >
                    <svg
                        className="w-5 h-5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                {/* Current month indicator (optional) */}
                {currentMonthLabel && (
                    <span className="text-sm font-medium text-slate-600">
                        {currentMonthLabel}
                    </span>
                )}

                {/* Next month button */}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoToNext}
                    aria-label="Next month"
                    className={[
                        'flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150',
                        'enabled:hover:bg-slate-100 enabled:cursor-pointer',
                        'disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-50',
                        buttonClassName,
                    ].join(' ')}
                >
                    <svg
                        className="w-5 h-5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        );
    }
);

CalendarNavigation.displayName = 'CalendarNavigation';
