'use client';

/**
 * EXAMPLE: Round-Trip Booking Form
 * Shows how to integrate the date picker for round-trip flights with date range selection
 * 
 * Key features demonstrated:
 * - Date range selection (departure + return)
 * - Smart date swapping if user selects return before departure
 * - Min/max stay validation
 * - Integrated with form submission
 */

import React, { useState } from 'react';
import { DatePickerModal } from '../date-picker';
import { formatDateLabel, formatDateRange } from '../date-picker/utils';
import type { TripType } from '../date-picker/types';

interface RoundTripBookingFormExampleProps {
    onSubmit?: (data: {
        tripType: TripType;
        departureDate: Date;
        returnDate: Date;
        origin: string;
        destination: string;
        passengers: number;
    }) => void;
}

/**
 * Example round-trip booking form
 * Demonstrates date range selection with min/max stay constraints
 */
export function RoundTripBookingFormExample({
    onSubmit,
}: RoundTripBookingFormExampleProps) {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        tripType: 'roundTrip' as TripType,
        departureDate: null as Date | null,
        returnDate: null as Date | null,
        origin: 'NRT', // Narita
        destination: 'KIX', // Kansai
        passengers: 1,
    });

    /**
     * Handle date picker confirmation
     * Validates departure and return dates
     */
    const handleDateConfirm = (selection: {
        departureDate: Date | null;
        returnDate: Date | null;
    }) => {
        if (selection.departureDate && selection.returnDate) {
            setFormData(prev => ({
                ...prev,
                departureDate: selection.departureDate,
                returnDate: selection.returnDate,
            }));
        }
        setIsDatePickerOpen(false);
    };

    /**
     * Handle form submission
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.departureDate || !formData.returnDate) {
            alert('Please select both departure and return dates');
            return;
        }

        onSubmit?.({
            tripType: formData.tripType,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            origin: formData.origin,
            destination: formData.destination,
            passengers: formData.passengers,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Round-Trip Booking</h2>

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

                {/* Travel Dates Range Picker */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Travel Dates
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsDatePickerOpen(true)}
                        className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-md text-left hover:border-emerald-500 transition-colors"
                    >
                        {formData.departureDate && formData.returnDate ? (
                            <span className="text-slate-900 font-medium">
                                📅 {formatDateRange(
                                    formData.departureDate,
                                    formData.returnDate
                                )}
                            </span>
                        ) : formData.departureDate ? (
                            <span className="text-slate-600">
                                📅 Departure: {formatDateLabel(formData.departureDate)} (select return date)
                            </span>
                        ) : (
                            <span className="text-slate-500">Click to select dates</span>
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
                    disabled={!formData.departureDate || !formData.returnDate}
                    className={`w-full px-4 py-3 font-semibold rounded-md transition-colors ${formData.departureDate && formData.returnDate
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                >
                    Search Round-Trip Flights
                </button>
            </div>

            {/* Date Picker Modal - Round Trip Mode */}
            <DatePickerModal
                isOpen={isDatePickerOpen}
                tripType="roundTrip"
                initialDepartureDate={formData.departureDate}
                initialReturnDate={formData.returnDate}
                onClose={() => setIsDatePickerOpen(false)}
                onConfirm={handleDateConfirm}
                constraints={{
                    disablePastDates: true,
                    minStay: 0, // Minimum days at destination
                    maxStay: 90, // Maximum trip duration
                }}
            />
        </form>
    );
}

export default RoundTripBookingFormExample;
