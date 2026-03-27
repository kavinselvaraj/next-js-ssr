'use client';

/**
 * DatePickerHeader Component
 * Modal header with title and close button
 */

import React from 'react';
import type { DatePickerHeaderProps } from '../types';

/**
 * Header section for the date picker modal
 * Shows title based on trip type and close button
 */
export const DatePickerHeader = React.memo(
    ({ tripType, onClose }: DatePickerHeaderProps) => {
        const title =
            tripType === 'oneWay'
                ? 'Select Departure Date'
                : 'Select Travel Dates';

        return (
            <div className="flex items-center justify-between shrink-0 border-b border-slate-200">
                <div className="px-4 py-4">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                </div>

                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close date picker"
                    className="mr-4 p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        );
    }
);

DatePickerHeader.displayName = 'DatePickerHeader';
