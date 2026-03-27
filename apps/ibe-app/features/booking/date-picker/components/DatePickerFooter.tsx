'use client';

/**
 * DatePickerFooter Component
 * Modal footer with action buttons (Reset, Confirm)
 */

import React from 'react';
import type { DatePickerFooterProps } from '../types';

/**
 * Footer section for the date picker modal
 * Contains reset and confirm action buttons
 */
export const DatePickerFooter = React.memo(
    ({
        canConfirm,
        onReset,
        onConfirm,
        helperText,
        showResetButton = true,
    }: DatePickerFooterProps) => {
        return (
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-4 space-y-3">
                {/* Helper text (optional) */}
                {helperText && (
                    <p className="text-xs text-slate-600">{helperText}</p>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 justify-end">
                    {/* Reset button */}
                    {showResetButton && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="px-4 py-2 rounded-md text-sm font-medium text-slate-700 bg-white
                border border-slate-300 hover:bg-slate-50
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            Reset
                        </button>
                    )}

                    {/* Confirm button */}
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={!canConfirm}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
              ${canConfirm
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        );
    }
);

DatePickerFooter.displayName = 'DatePickerFooter';
