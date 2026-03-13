'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
    DropdownOption,
    FlightSearchValidationErrors,
    TripType,
} from '../types/flightSearch';
import { useFlightSearchStore } from '../store/flightSearchStore';

type HomepageSearchFormProps = {
    locale: 'en-us' | 'ja-jp';
    oneWayLabel: string;
    roundTripLabel: string;
    originLabel: string;
    destinationLabel: string;
    passengerLabel: string;
    dateLabel: string;
    searchButtonText: string;
    /** Locale-resolved base href for the results page, e.g. "/flights" or "/ja/flights" */
    searchHref: string;
};

type DropdownField = 'origin' | 'destination' | 'passengers' | 'departureDate' | 'returnDate';

const getISODate = (daysFromNow: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
};

const getNextSaturdayISODate = (): string => {
    const d = new Date();
    const daysToSat = ((6 - d.getDay() + 7) % 7) || 7;
    d.setDate(d.getDate() + daysToSat);
    return d.toISOString().split('T')[0];
};

const dedupeOptionsByValue = (options: DropdownOption[]): DropdownOption[] => {
    const seen = new Set<string>();

    return options.filter((option) => {
        if (seen.has(option.value)) {
            return false;
        }

        seen.add(option.value);
        return true;
    });
};

export default function HomepageSearchForm({
    locale,
    oneWayLabel,
    roundTripLabel,
    originLabel,
    destinationLabel,
    passengerLabel,
    dateLabel,
    searchButtonText,
    searchHref,
}: HomepageSearchFormProps) {
    const router = useRouter();
    const setSearch = useFlightSearchStore((s) => s.setSearch);
    const formRef = useRef<HTMLFormElement | null>(null);
    const isJapanese = locale === 'ja-jp';

    // ── Trip type ──────────────────────────────────────────────────────────────
    const [tripType, setTripType] = useState<TripType>('oneWay');

    // ── Dropdown state ────────────────────────────────────────────────────────
    const [openDropdown, setOpenDropdown] = useState<DropdownField | null>(null);
    const [originOption, setOriginOption] = useState<DropdownOption | null>(null);
    const [destinationOption, setDestinationOption] = useState<DropdownOption | null>(null);
    const [passengersOption, setPassengersOption] = useState<DropdownOption | null>(null);
    const [departureDateOption, setDepartureDateOption] = useState<DropdownOption | null>(null);
    const [returnDateOption, setReturnDateOption] = useState<DropdownOption | null>(null);

    // ── Form feedback state ───────────────────────────────────────────────────
    const [validationErrors, setValidationErrors] = useState<FlightSearchValidationErrors>({});

    // ── Options (memoised to avoid rebuilding on every render) ────────────────
    const dropdownOptions = useMemo<Record<DropdownField, DropdownOption[]>>(() => {
        const departureDateOptions = dedupeOptionsByValue([
            { value: getISODate(0), label: isJapanese ? '本日' : 'Today' },
            { value: getISODate(1), label: isJapanese ? '明日' : 'Tomorrow' },
            { value: getNextSaturdayISODate(), label: isJapanese ? '今週末' : 'This weekend' },
        ]);

        if (isJapanese) {
            return {
                origin: [
                    { value: 'NRT', label: '東京 (NRT)' },
                    { value: 'KIX', label: '大阪 (KIX)' },
                    { value: 'SIN', label: 'シンガポール (SIN)' },
                ],
                destination: [
                    { value: 'ICN', label: 'ソウル (ICN)' },
                    { value: 'BKK', label: 'バンコク (BKK)' },
                    { value: 'HNL', label: 'ホノルル (HNL)' },
                ],
                passengers: [
                    { value: '1', label: '1名' },
                    { value: '2', label: '2名' },
                    { value: '3', label: '3名' },
                    { value: '4', label: '4名' },
                ],
                departureDate: departureDateOptions,
                returnDate: [
                    { value: getISODate(3), label: '3日後' },
                    { value: getISODate(7), label: '1週間後' },
                    { value: getISODate(14), label: '2週間後' },
                ],
            };
        }

        return {
            origin: [
                { value: 'NRT', label: 'Tokyo (NRT)' },
                { value: 'KIX', label: 'Osaka (KIX)' },
                { value: 'SIN', label: 'Singapore (SIN)' },
            ],
            destination: [
                { value: 'ICN', label: 'Seoul (ICN)' },
                { value: 'BKK', label: 'Bangkok (BKK)' },
                { value: 'HNL', label: 'Honolulu (HNL)' },
            ],
            passengers: [
                { value: '1', label: '1 passenger' },
                { value: '2', label: '2 passengers' },
                { value: '3', label: '3 passengers' },
                { value: '4', label: '4 passengers' },
            ],
            departureDate: departureDateOptions,
            returnDate: [
                { value: getISODate(3), label: 'In 3 days' },
                { value: getISODate(7), label: 'In 1 week' },
                { value: getISODate(14), label: 'In 2 weeks' },
            ],
        };
    }, [isJapanese]);

    // ── Close dropdowns on outside click ─────────────────────────────────────
    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (!openDropdown) return;
            const target = event.target as Node | null;
            if (formRef.current && target && !formRef.current.contains(target)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [openDropdown]);

    // ── Clear return date when switching to one-way ───────────────────────────
    useEffect(() => {
        if (tripType === 'oneWay') setReturnDateOption(null);
    }, [tripType]);

    // ── Dropdown helpers ──────────────────────────────────────────────────────
    const toggleDropdown = (field: DropdownField) => {
        setOpenDropdown((prev) => (prev === field ? null : field));
    };

    const selectOption = (field: DropdownField, option: DropdownOption) => {
        switch (field) {
            case 'origin': setOriginOption(option); break;
            case 'destination': setDestinationOption(option); break;
            case 'passengers': setPassengersOption(option); break;
            case 'departureDate': setDepartureDateOption(option); break;
            case 'returnDate': setReturnDateOption(option); break;
        }

        setValidationErrors((prev) => {
            const next = { ...prev };
            delete (next as Record<string, string | undefined>)[field];
            if (field === 'origin' || field === 'destination') delete next.sameRoute;
            return next;
        });

        setOpenDropdown(null);
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = (): FlightSearchValidationErrors => {
        const errors: FlightSearchValidationErrors = {};

        if (!originOption) {
            errors.origin = isJapanese ? '出発地を選択してください' : 'Please select an origin';
        }
        if (!destinationOption) {
            errors.destination = isJapanese ? '到着地を選択してください' : 'Please select a destination';
        }
        if (originOption && destinationOption && originOption.value === destinationOption.value) {
            errors.sameRoute = isJapanese
                ? '出発地と到着地は異なる必要があります'
                : 'Origin and destination must be different';
        }
        if (!passengersOption) {
            errors.passengers = isJapanese ? '搭乗者数を選択してください' : 'Please select the number of passengers';
        }
        if (!departureDateOption) {
            errors.departureDate = isJapanese ? '出発日を選択してください' : 'Please select a departure date';
        }
        if (tripType === 'roundTrip' && !returnDateOption) {
            errors.returnDate = isJapanese ? '帰国日を選択してください' : 'Please select a return date';
        }

        return errors;
    };

    // ── Form submit handler ───────────────────────────────────────────────────
    // Validation runs client-side. On success the search params are written to
    // the Zustand store and the user is navigated to the results page — no
    // query string is ever exposed in the URL.
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});

        setSearch({
            tripType,
            originCode: originOption!.value,
            originLabel: originOption!.label,
            destinationCode: destinationOption!.value,
            destinationLabel: destinationOption!.label,
            passengers: parseInt(passengersOption!.value, 10),
            departureDate: departureDateOption!.value,
            returnDate: tripType === 'roundTrip' ? returnDateOption?.value : undefined,
        });

        router.push(searchHref);
    };

    // ── Shared style helpers ──────────────────────────────────────────────────
    const fieldValueClassName = 'text-2xl font-medium text-slate-700';

    const getFieldClassName = (field: DropdownField, muted = false) => {
        const isOpen = openDropdown === field;
        const hasError = !!(validationErrors as Record<string, string | undefined>)[field];

        return [
            'flex w-full cursor-pointer items-center justify-between rounded-xl border px-5 py-5 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
            muted ? 'bg-slate-50' : 'bg-white',
            hasError
                ? 'border-red-400 ring-1 ring-red-400'
                : isOpen
                    ? 'border-emerald-500 ring-2 ring-emerald-500 ring-offset-2'
                    : 'border-slate-200',
            muted ? 'text-slate-500' : 'text-slate-700',
        ].join(' ');
    };

    const renderDropdown = (field: DropdownField) => {
        if (openDropdown !== field) return null;

        return (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
                <ul role="listbox" aria-label={`${field}-options`} className="space-y-1">
                    {dropdownOptions[field].map((option) => (
                        <li key={`${field}-${option.value}`}>
                            <button
                                type="button"
                                onClick={() => selectOption(field, option)}
                                className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderFieldError = (field: DropdownField) => {
        const error = (validationErrors as Record<string, string | undefined>)[field];
        if (!error) return null;
        return <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>;
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <form
            ref={formRef}
            onSubmit={handleSearch}
            noValidate
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_28px_80px_rgba(0,0,0,0.35)] md:p-8"
        >
            {/* Trip type selector */}
            <div className="grid gap-3 md:max-w-xl md:grid-cols-2">
                <button
                    type="button"
                    onClick={() => setTripType('oneWay')}
                    aria-pressed={tripType === 'oneWay'}
                    className={[
                        'flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 text-left text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                        tripType === 'oneWay'
                            ? 'border-emerald-200 bg-emerald-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700',
                    ].join(' ')}
                >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-600">
                        {tripType === 'oneWay' ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> : null}
                    </span>
                    {oneWayLabel}
                </button>

                <button
                    type="button"
                    onClick={() => setTripType('roundTrip')}
                    aria-pressed={tripType === 'roundTrip'}
                    className={[
                        'flex cursor-pointer items-center gap-3 rounded-xl border px-5 py-4 text-left text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                        tripType === 'roundTrip'
                            ? 'border-emerald-200 bg-emerald-50 text-slate-900'
                            : 'border-slate-200 bg-white text-slate-700',
                    ].join(' ')}
                >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300">
                        {tripType === 'roundTrip' ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" /> : null}
                    </span>
                    {roundTripLabel}
                </button>
            </div>

            {/* Origin / Destination */}
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
                <div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('origin')}
                            aria-label={`${isJapanese ? '出発地を選択' : 'Select departure'}: ${originOption?.label ?? originLabel}`}
                            aria-expanded={openDropdown === 'origin'}
                            aria-haspopup="listbox"
                            className={getFieldClassName('origin')}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-xl text-emerald-600">◉</span>
                                <span className={originOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`}>
                                    {originOption?.label ?? originLabel}
                                </span>
                            </span>
                            <span className="text-emerald-600">⌄</span>
                        </button>
                        {renderDropdown('origin')}
                    </div>
                    {renderFieldError('origin')}
                </div>

                <div className="hidden text-center text-3xl font-light text-emerald-700 md:block md:pt-5" aria-hidden="true">
                    ⇄
                </div>

                <div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('destination')}
                            aria-label={`${isJapanese ? '到着地を選択' : 'Select destination'}: ${destinationOption?.label ?? destinationLabel}`}
                            aria-expanded={openDropdown === 'destination'}
                            aria-haspopup="listbox"
                            className={getFieldClassName('destination', true)}
                        >
                            <span className="flex items-center gap-3">
                                <span className={destinationOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`}>
                                    {destinationOption?.label ?? destinationLabel}
                                </span>
                            </span>
                            <span className="text-slate-400">⌄</span>
                        </button>
                        {renderDropdown('destination')}
                    </div>
                    {renderFieldError('destination')}
                </div>
            </div>

            {/* Cross-field same-route error */}
            {validationErrors.sameRoute && (
                <p role="alert" className="mt-2 text-xs text-red-600">{validationErrors.sameRoute}</p>
            )}

            {/* Passengers / Departure date */}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('passengers')}
                            aria-label={`${isJapanese ? '搭乗者数を選択' : 'Select passengers'}: ${passengersOption?.label ?? passengerLabel}`}
                            aria-expanded={openDropdown === 'passengers'}
                            aria-haspopup="listbox"
                            className={getFieldClassName('passengers')}
                        >
                            <span className="flex items-center gap-3">
                                <span className={passengersOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`}>
                                    {passengersOption?.label ?? passengerLabel}
                                </span>
                            </span>
                            <span className="text-emerald-600">⌄</span>
                        </button>
                        {renderDropdown('passengers')}
                    </div>
                    {renderFieldError('passengers')}
                </div>

                <div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => toggleDropdown('departureDate')}
                            aria-label={`${isJapanese ? '出発日を選択' : 'Select departure date'}: ${departureDateOption?.label ?? dateLabel}`}
                            aria-expanded={openDropdown === 'departureDate'}
                            aria-haspopup="listbox"
                            className={getFieldClassName('departureDate', true)}
                        >
                            <span className="flex items-center gap-3">
                                <span className={departureDateOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`}>
                                    {departureDateOption?.label ?? dateLabel}
                                </span>
                            </span>
                            <span className="text-slate-400">⌄</span>
                        </button>
                        {renderDropdown('departureDate')}
                    </div>
                    {renderFieldError('departureDate')}
                </div>
            </div>

            {/* Return date — visible only for round trips */}
            {tripType === 'roundTrip' && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div aria-hidden="true" /> {/* spacer to align under date column */}
                    <div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => toggleDropdown('returnDate')}
                                aria-label={`${isJapanese ? '帰国日を選択' : 'Select return date'}: ${returnDateOption?.label ?? (isJapanese ? '帰国日' : 'Return date')}`}
                                aria-expanded={openDropdown === 'returnDate'}
                                aria-haspopup="listbox"
                                className={getFieldClassName('returnDate', true)}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={returnDateOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`}>
                                        {returnDateOption?.label ?? (isJapanese ? '帰国日' : 'Return date')}
                                    </span>
                                </span>
                                <span className="text-slate-400">⌄</span>
                            </button>
                            {renderDropdown('returnDate')}
                        </div>
                        {renderFieldError('returnDate')}
                    </div>
                </div>
            )}

            {/* Submit */}
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-end">
                <button
                    type="submit"
                    className="inline-flex min-w-[16rem] cursor-pointer items-center justify-center rounded-xl bg-emerald-700 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                    {searchButtonText}
                </button>
            </div>
        </form>
    );
}
