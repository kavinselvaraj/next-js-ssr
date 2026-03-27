'use client';

/**
 * EXAMPLE: Airport/Destination Selection Modal
 * Shows how to use Modal for selecting airports or destinations
 */

import React from 'react';
import { Modal, useModal } from '../../modal';
import type { ModalAction } from '../../modal/types';

interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

interface AirportSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSelect: (airport: Airport) => void;
    selected?: string;
}

const MAJOR_AIRPORTS: Airport[] = [
    { code: 'NRT', name: 'Narita', city: 'Tokyo', country: 'Japan' },
    { code: 'HND', name: 'Haneda', city: 'Tokyo', country: 'Japan' },
    { code: 'KIX', name: 'Kansai', city: 'Osaka', country: 'Japan' },
    { code: 'ITM', name: 'Osaka', city: 'Osaka', country: 'Japan' },
    { code: 'FUK', name: 'Fukuoka', city: 'Fukuoka', country: 'Japan' },
    { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA' },
    { code: 'SFO', name: 'San Francisco', city: 'San Francisco', country: 'USA' },
    { code: 'LHR', name: 'Heathrow', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
];

/**
 * Airport selection modal with search
 * Demonstrates: search functionality, list selection, scrolling
 */
export function AirportSelectorModal({
    isOpen,
    onClose,
    title,
    onSelect,
    selected,
}: AirportSelectorModalProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedAirport, setSelectedAirport] = React.useState<Airport | null>(
        null
    );

    React.useEffect(() => {
        if (selected) {
            const airport = MAJOR_AIRPORTS.find((a) => a.code === selected);
            setSelectedAirport(airport || null);
        }
    }, [selected]);

    const filteredAirports = MAJOR_AIRPORTS.filter((airport) =>
        `${airport.code} ${airport.name} ${airport.city}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleConfirm = () => {
        if (selectedAirport) {
            onSelect(selectedAirport);
            onClose();
        }
    };

    const actions: ModalAction[] = [
        {
            id: 'cancel',
            label: 'Cancel',
            variant: 'secondary',
            onClick: onClose,
        },
        {
            id: 'confirm',
            label: 'Select',
            variant: 'primary',
            onClick: handleConfirm,
            disabled: !selectedAirport,
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="md"
            showHeader
            showFooter
            actions={actions}
            bodyConfig={{ padding: 'lg' }}
            footerConfig={{ align: 'right', showDivider: true }}
        >
            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by code, airport, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
            </div>

            {/* Airport list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAirports.length > 0 ? (
                    filteredAirports.map((airport) => (
                        <button
                            key={airport.code}
                            onClick={() => setSelectedAirport(airport)}
                            className={`w-full text-left p-3 border rounded-md transition-colors ${selectedAirport?.code === airport.code
                                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500'
                                    : 'border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-slate-900">
                                        {airport.code} · {airport.name}
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {airport.city}, {airport.country}
                                    </div>
                                </div>
                                {selectedAirport?.code === airport.code && (
                                    <span className="text-emerald-600">✓</span>
                                )}
                            </div>
                        </button>
                    ))
                ) : (
                    <p className="text-center text-slate-500 py-8">
                        No airports found matching your search.
                    </p>
                )}
            </div>
        </Modal>
    );
}

/**
 * Demo showing airport selection
 */
export function AirportSelectorDemo() {
    const departureModal = useModal();
    const destinationModal = useModal();

    const [departure, setDeparture] = React.useState<Airport | null>(null);
    const [destination, setDestination] = React.useState<Airport | null>(null);

    return (
        <div className="p-6 max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Airport Selection Demo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Departure selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Departure
                    </label>
                    <button
                        onClick={departureModal.open}
                        className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-md text-left hover:border-emerald-500"
                    >
                        {departure ? (
                            <span className="font-medium text-slate-900">
                                {departure.code} · {departure.name}
                            </span>
                        ) : (
                            <span className="text-slate-500">Select departure airport</span>
                        )}
                    </button>
                </div>

                {/* Destination selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Destination
                    </label>
                    <button
                        onClick={destinationModal.open}
                        className="w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-md text-left hover:border-emerald-500"
                    >
                        {destination ? (
                            <span className="font-medium text-slate-900">
                                {destination.code} · {destination.name}
                            </span>
                        ) : (
                            <span className="text-slate-500">Select destination airport</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Modals */}
            <AirportSelectorModal
                isOpen={departureModal.isOpen}
                onClose={departureModal.close}
                title="Select Departure Airport"
                onSelect={setDeparture}
                selected={departure?.code}
            />

            <AirportSelectorModal
                isOpen={destinationModal.isOpen}
                onClose={destinationModal.close}
                title="Select Destination Airport"
                onSelect={setDestination}
                selected={destination?.code}
            />
        </div>
    );
}
