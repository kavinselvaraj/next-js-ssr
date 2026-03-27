'use client';

/**
 * DatePickerModal Component
 * Main container component for the complete date picker modal system
 * Integrates header, calendar, navigation, and footer
 * Handles modal behavior (escape key, backdrop close, scroll lock)
 */

import React, { useCallback, useEffect, useRef } from 'react';
import type { DatePickerProps } from '../types';
import { useDatePicker, useDatePickerModal } from '../hooks';
import { DEFAULT_CALENDAR_CONFIG } from '../constants';
import { DatePickerHeader } from './DatePickerHeader';
import { SelectedDateSummary } from './SelectedDateSummary';
import { CalendarMonth } from './CalendarMonth';
import { CalendarNavigation } from './CalendarNavigation';
import { DatePickerFooter } from './DatePickerFooter';
import { determineDateCellState } from '../utils';

/**
 * Complete date picker modal
 * Production-ready component supporting:
 * - One-way and round-trip selection modes
 * - Two-month side-by-side display
 * - Month navigation
 * - Keyboard accessibility (Escape key)
 * - Proper modal scroll handling
 * - Backdrop click to close
 * - Fare/availability data display
 */
export const DatePickerModal = React.memo(
    ({
        isOpen,
        tripType,
        initialDepartureDate,
        initialReturnDate,
        onClose,
        onConfirm,
        onReset,
        constraints,
        fareCalendarData,
        calendarConfig,
        disableBackdropClose = false,
        showFareLegend = true,
    }: DatePickerProps) => {
        const dialogRef = useRef<HTMLDivElement>(null);
        const backdropRef = useRef<HTMLDivElement>(null);

        // Manage body scroll lock
        useDatePickerModal(isOpen);

        // Orchestrate date selection and calendar navigation
        const datePickerState = useDatePicker({
            tripType,
            initialDepartureDate,
            initialReturnDate,
            constraints,
            fareCalendarData,
            calendarConfig: {
                monthsToShow: 2,
                ...calendarConfig,
            },
            onConfirm,
            onReset,
        });

        const {
            dateSelection,
            calendarNavigation,
        } = datePickerState;

        const config = { ...DEFAULT_CALENDAR_CONFIG, ...calendarConfig };

        /**
         * Handle Escape key to close modal
         */
        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            },
            [onClose]
        );

        /**
         * Handle backdrop click to close (if enabled)
         */
        const handleBackdropClick = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!disableBackdropClose && e.target === backdropRef.current) {
                    onClose();
                }
            },
            [onClose, disableBackdropClose]
        );

        /**
         * Handle confirm button
         */
        const handleConfirm = useCallback(() => {
            if (dateSelection.canConfirm) {
                onConfirm(dateSelection.confirmSelection());
                onClose();
            }
        }, [dateSelection, onConfirm, onClose]);

        /**
         * Handle reset button
         */
        const handleReset = useCallback(() => {
            dateSelection.resetSelection();
            onReset?.();
        }, [dateSelection, onReset]);

        /**
         * Focus close button on open
         */
        useEffect(() => {
            if (isOpen && dialogRef.current) {
                // Find close button and focus it
                const closeButton = dialogRef.current.querySelector(
                    'button[aria-label="Close date picker"]'
                ) as HTMLButtonElement | null;
                closeButton?.focus();
            }
        }, [isOpen]);

        if (!isOpen) {
            return null;
        }

        const {
            departureDate,
            returnDate,
            hoveredDate = null,
        } = dateSelection.selection;

        // Generate calendar days with proper state styling based on selection
        const daysWithState = calendarNavigation.visibleMonths.map(month => ({
            ...month,
            days: month.days.map(day => ({
                ...day,
                state: determineDateCellState(
                    day.date,
                    departureDate,
                    returnDate,
                    hoveredDate,
                    day.state
                ),
            })),
        }));

        return (
            <div
                ref={backdropRef}
                className="fixed inset-0 overflow-y-auto bg-black/50 z-50"
                onClick={handleBackdropClick}
                role="presentation"
            >
                {/* Centering wrapper */}
                <div className="flex min-h-full items-center justify-center p-4">
                    {/* Modal container */}
                    <div
                        ref={dialogRef}
                        className="flex flex-col w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl animate-fade-in"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="date-picker-title"
                        onKeyDown={handleKeyDown}
                    >
                        {/* Header */}
                        <DatePickerHeader tripType={tripType} onClose={onClose} />

                        {/* Scrollable content container */}
                        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
                            <div className="flex flex-col space-y-6 px-6 py-6">
                                {/* Selected date summary */}
                                <SelectedDateSummary
                                    tripType={tripType}
                                    departureDate={departureDate}
                                    returnDate={returnDate}
                                    locale={config.locale}
                                />

                                {/* Calendar navigation + month display */}
                                <div className="relative">
                                    <CalendarNavigation
                                        canGoToPrevious={calendarNavigation.canGoToPrevious}
                                        canGoToNext={calendarNavigation.canGoToNext}
                                        onPrevious={calendarNavigation.goToPreviousMonth}
                                        onNext={calendarNavigation.goToNextMonth}
                                        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-11"
                                        buttonClassName="pointer-events-auto h-11 w-11 rounded-full border border-slate-200 bg-white shadow-sm"
                                    />

                                    <div className="grid grid-cols-1 gap-8 px-14 lg:grid-cols-2">
                                        {daysWithState.map((month, idx) => (
                                            <CalendarMonth
                                                key={`${month.year}-${month.month}-${idx}`}
                                                month={month}
                                                showFares={config.showFares}
                                                onDayClick={dateSelection.handleDateClick}
                                                onDayHover={dateSelection.handleHoverDate}
                                                locale={config.locale}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Fare legend (optional) */}
                                {showFareLegend && config.showFares && (
                                    <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
                                        <p className="text-xs text-blue-900">
                                            💡 <strong>Tip:</strong> Prices shown are per person for the selected date. Availability and fares may vary based on seat type and restrictions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <DatePickerFooter
                            canConfirm={dateSelection.canConfirm}
                            onReset={handleReset}
                            onConfirm={handleConfirm}
                            helperText={
                                tripType === 'roundTrip' && !returnDate
                                    ? 'Click a date twice or select departure then return date'
                                    : undefined
                            }
                            showResetButton={
                                !!(departureDate || returnDate)
                            }
                        />
                    </div>
                </div>
            </div>
        );
    }
);

DatePickerModal.displayName = 'DatePickerModal';
