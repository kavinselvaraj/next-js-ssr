'use client';

/**
 * EXAMPLE: Refactored Date Picker Using Reusable Modal
 * Shows how the date picker from features/booking/date-picker can be simplified
 * by using the new reusable Modal component
 */

import React from 'react';
import { Modal, useModal } from '../../modal';
import type { ModalAction } from '../../modal/types';
import { formatDateLabel, formatDateRange } from '../../../../features/booking/date-picker/utils';

interface RefactoredDatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripType: 'oneWay' | 'roundTrip';
    onConfirm: (dates: {
        departureDate: Date | null;
        returnDate: Date | null;
    }) => void;
}

/**
 * Simplified date picker that reuses the Modal component
 * All the complexity is abstracted away by the Modal
 */
export function RefactoredDatePickerModal({
    isOpen,
    onClose,
    tripType,
    onConfirm,
}: RefactoredDatePickerModalProps) {
    const [departureDate, setDepartureDate] = React.useState<Date | null>(null);
    const [returnDate, setReturnDate] = React.useState<Date | null>(null);

    const handleConfirm = () => {
        onConfirm({ departureDate, returnDate });
        onClose();
    };

    const handleReset = () => {
        setDepartureDate(null);
        setReturnDate(null);
    };

    const actions: ModalAction[] = [
        {
            id: 'reset',
            label: 'Reset',
            variant: 'ghost',
            onClick: handleReset,
            disabled: !departureDate && !returnDate,
        },
        {
            id: 'confirm',
            label: 'Confirm',
            variant: 'primary',
            onClick: handleConfirm,
            disabled: !departureDate || (tripType === 'roundTrip' && !returnDate),
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={tripType === 'oneWay' ? 'Select Departure Date' : 'Select Travel Dates'}
            size="lg"
            showHeader
            showFooter
            actions={actions}
            bodyConfig={{ padding: 'lg', scrollable: true }}
            footerConfig={{ align: 'right', showDivider: true }}
            headerConfig={{
                showCloseButton: true,
            }}
        >
            {/* Placeholder calendar content - in real implementation, include your calendar grid */}
            <div className="space-y-6">
                {/* Selected dates summary */}
                <div className="p-4 bg-slate-50 rounded-md">
                    {tripType === 'oneWay' ? (
                        <p className="text-sm">
                            {departureDate ? (
                                <>
                                    Departure: <span className="font-semibold">{formatDateLabel(departureDate)}</span>
                                </>
                            ) : (
                                <span className="text-slate-600">Select a departure date</span>
                            )}
                        </p>
                    ) : (
                        <p className="text-sm">
                            {departureDate && returnDate ? (
                                <>
                                    Dates: <span className="font-semibold">{formatDateRange(departureDate, returnDate)}</span>
                                </>
                            ) : departureDate ? (
                                <>
                                    Departure: <span className="font-semibold">{formatDateLabel(departureDate)}</span>
                                    {' - Select return date'}
                                </>
                            ) : (
                                <span className="text-slate-600">Select departure and return dates</span>
                            )}
                        </p>
                    )}
                </div>

                {/* Placeholder for calendar grid */}
                <div className="text-center py-12 bg-slate-100 rounded-md text-slate-600">
                    Calendar grid would render here in the real implementation
                </div>

                {/* Info box */}
                <div className="bg-blue-50 rounded-md p-4 border border-blue-200">
                    <p className="text-xs text-blue-900">
                        💡 <strong>Tip:</strong> This date picker is now built using the reusable Modal component, reducing code duplication across the application.
                    </p>
                </div>
            </div>
        </Modal>
    );
}

/**
 * Demo showing the refactored date picker
 */
export function RefactoredDatePickerDemo() {
    const oneWayModal = useModal();
    const roundTripModal = useModal();

    const [selectedDates, setSelectedDates] = React.useState<{
        type: string;
        dates: string;
    } | null>(null);

    const handleConfirm = (type: string, dates: any) => {
        const display = type === 'oneWay'
            ? formatDateLabel(dates.departureDate)
            : formatDateRange(dates.departureDate, dates.returnDate);
        setSelectedDates({ type, dates: display });
    };

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Refactored Date Picker Demo</h2>
            <p className="text-sm text-slate-600 mb-4">
                This shows how the date picker is now simplified using the reusable Modal component.
            </p>

            <div className="space-y-3">
                <button
                    onClick={oneWayModal.open}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                >
                    One-Way Trip
                </button>
                <button
                    onClick={roundTripModal.open}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                >
                    Round-Trip
                </button>
            </div>

            {selectedDates && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm">
                        <strong>{selectedDates.type.toUpperCase()}</strong>: {selectedDates.dates}
                    </p>
                </div>
            )}

            <RefactoredDatePickerModal
                isOpen={oneWayModal.isOpen}
                onClose={oneWayModal.close}
                tripType="oneWay"
                onConfirm={(dates) => {
                    handleConfirm('one-way', dates);
                    oneWayModal.close();
                }}
            />

            <RefactoredDatePickerModal
                isOpen={roundTripModal.isOpen}
                onClose={roundTripModal.close}
                tripType="roundTrip"
                onConfirm={(dates) => {
                    handleConfirm('round-trip', dates);
                    roundTripModal.close();
                }}
            />
        </div>
    );
}
