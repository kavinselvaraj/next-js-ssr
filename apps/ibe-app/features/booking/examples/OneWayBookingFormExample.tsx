'use client';

/**
 * EXAMPLE: One-Way Booking Form
 * Shows how to integrate the date picker for simple one-way flights
 * 
 * Usage:
 * - Import DatePickerModal and useDatePickerModal hook
 * - Manage the modal open state
 * - Handle confirmation with the selected date
 */

import React, { useState } from 'react';
import { DatePickerModal } from '../date-picker';
import { formatDateLabel } from '../date-picker/utils';
import type { TripType } from '../date-picker/types';

interface OneWayBookingFormExampleProps {
    onSubmit?: (data: {
        tripType: TripType;
        departureDate: Date;
        origin: string;
        destination: string;
        passengers: number;
    }) => void;
}

/**
 * Example one-way booking form
 * Demonstrates integration of DatePickerModal with form submission
 */
export function OneWayBookingFormExample({
    onSubmit,
}: OneWayBookingFormExampleProps) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        tripType: 'oneWay' as TripType,
        departureDate: null as Date | null,
        origin: 'NRT', // Narita
        destination: 'KIX', // Kansai
        passengers: 1,
    });

    /**
     * Handle date picker confirmation
     */
    const handleDateConfirm = (selection: {
        departureDate: Date | null;
        returnDate: Date | null;
    }) => {
        if (selection.departureDate) {
            setFormData(prev => ({
                ...prev,
                departureDate: selection.departureDate,
            }));
        }
        setIsDatePickerOpen(false);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.departureDate) {
            alert('Please select a departure date');
            return;
        }

        onSubmit?.({
            tripType: formData.tripType,
            departureDate: formData.departureDate,
            origin: formData.origin,
            destination: formData.destination,
            passengers: formData.passengers,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">One-Way Booking</h2>

            <div className="space-y-6">
                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            From
                        </label>
                        <input
                            type="text"
                            value={formData.origin}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    origin: e.target.value,
                                }))
                            }
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Departure city"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            To
                        </label>
                        <input
                            type="text"
                            value={formData.destination}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    destination: e.target.value,
                                }))
                            }
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="Destination city"
                        />
                    </div>
                </div>

                {/* Departure Date Picker */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Departure Date
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(true)}
                        className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-md text-left hover:border-emerald-500 transition-colors"
                    >
                        {formData.departureDate ? (
                            <span className="text-slate-900 font-medium">
                                📅 {formatDateLabel(formData.departureDate)}
                            </span>
                        ) : (
                            <span className="text-slate-500">Click to select date</span>
                        )}
                    </button>
                </div>

                {/* Passengers */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Passengers
                    </label>
                    <select
                        value={formData.passengers}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                passengers: parseInt(e.target.value, 10),
                            }))
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <option key={n} value={n}>
                                {n} {n === 1 ? 'Passenger' : 'Passengers'}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full px-4 py-3 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-600 transition-colors"
                >
                    Search Flights
                </button>
            </div>

            {/* Date Picker Modal */}
            <DatePickerModal
                isOpen={isDatePickerOpen}
                tripType="oneWay"
                initialDepartureDate={formData.departureDate}
                onClose={() => setIsDatePickerOpen(false)}
                onConfirm={handleDateConfirm}
                constraints={{
                    disablePastDates: true,
                }}
            />
        </form>
    );
}

export default OneWayBookingFormExample;
