'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'components/common/modal';
import { useAppDispatch } from 'store/hooks';
import { CalendarModal, MOCK_CALENDAR_MONTHS } from '../../booking';
import { setSearch } from '../store';
import type { DropdownOption, FlightSearchValidationErrors, TripType } from '../types/flightSearch';

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
type AirportSelectionField = 'origin' | 'destination';

type AirportOption = {
  city: string;
  code: string;
  airport: string;
  country: string;
  selected?: boolean;
};

const AIRPORT_OPTIONS: AirportOption[] = [
  {
    city: 'Tokyo (Narita)',
    code: 'NRT',
    airport: 'Narita International Airport',
    country: 'Japan',
  },
  {
    city: 'Seoul',
    code: 'ICN',
    airport: 'Incheon International Airport',
    country: 'South Korea',
  },
  {
    city: 'Manila',
    code: 'MNL',
    airport: 'Ninoy Aquino International Airport',
    country: 'Philippines',
  },
  {
    city: 'Bangkok',
    code: 'BKK',
    airport: 'Suvarnabhumi Airport',
    country: 'Thailand',
  },
  {
    city: 'Singapore',
    code: 'SIN',
    airport: 'Singapore Changi Airport',
    country: 'Singapore',
  },
  {
    city: 'Honolulu',
    code: 'HNL',
    airport: 'Daniel K. Inouye International Airport',
    country: 'United States',
  },
  {
    city: 'Vancouver',
    code: 'YVR',
    airport: 'Vancouver International Airport',
    country: 'Canada',
  },
  {
    city: 'San Francisco',
    code: 'SFO',
    airport: 'San Francisco International Airport',
    country: 'United States',
  },
  {
    city: 'San Jose',
    code: 'SJC',
    airport: 'Norman Y. Mineta San Jose International Airport',
    country: 'United States',
  },
  {
    city: 'Los Angeles',
    code: 'LAX',
    airport: 'Los Angeles International Airport',
    country: 'United States',
  },
  {
    city: 'Houston',
    code: 'IAH',
    airport: 'George Bush Intercontinental Airport',
    country: 'United States',
    selected: true,
  },
];

const toAirportDropdownOption = (airport: AirportOption): DropdownOption => ({
  value: airport.code,
  label: `${airport.city} (${airport.code})`,
});

const AIRPORT_OPTIONS_MAP = new Map<string, AirportOption>(
  AIRPORT_OPTIONS.map((airport) => [airport.code, airport]),
);

const DEFAULT_SELECTED_AIRPORT_OPTION = AIRPORT_OPTIONS.find((airport) => airport.selected);

const getISODate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};

const getNextSaturdayISODate = (): string => {
  const d = new Date();
  const daysToSat = (6 - d.getDay() + 7) % 7 || 7;
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
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);
  const isJapanese = locale === 'ja-jp';

  const [tripType, setTripType] = useState<TripType>('oneWay');
  const [openDropdown, setOpenDropdown] = useState<DropdownField | null>(null);
  const [originOption, setOriginOption] = useState<DropdownOption | null>(null);
  const [destinationOption, setDestinationOption] = useState<DropdownOption | null>(
    DEFAULT_SELECTED_AIRPORT_OPTION ? toAirportDropdownOption(DEFAULT_SELECTED_AIRPORT_OPTION) : null,
  );
  const [passengersOption, setPassengersOption] = useState<DropdownOption | null>(null);
  const [departureDateOption, setDepartureDateOption] = useState<DropdownOption | null>(null);
  const [returnDateOption, setReturnDateOption] = useState<DropdownOption | null>(null);
  const [validationErrors, setValidationErrors] = useState<FlightSearchValidationErrors>({});
  const [isDepartureDateCalendarOpen, setIsDepartureDateCalendarOpen] = useState(false);
  const [isReturnDateCalendarOpen, setIsReturnDateCalendarOpen] = useState(false);
  const [airportSelectionField, setAirportSelectionField] = useState<AirportSelectionField | null>(
    null,
  );

  const dropdownOptions = useMemo<Record<DropdownField, DropdownOption[]>>(() => {
    const departureDateOptions = dedupeOptionsByValue([
      { value: getISODate(0), label: isJapanese ? '本日' : 'Today' },
      { value: getISODate(1), label: isJapanese ? '明日' : 'Tomorrow' },
      { value: getNextSaturdayISODate(), label: isJapanese ? '今週末' : 'This weekend' },
    ]);

    const airportDropdownOptions = AIRPORT_OPTIONS.map(toAirportDropdownOption);

    if (isJapanese) {
      return {
        origin: airportDropdownOptions,
        destination: airportDropdownOptions,
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
      origin: airportDropdownOptions,
      destination: airportDropdownOptions,
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

  useEffect(() => {
    if (tripType === 'oneWay') setReturnDateOption(null);
  }, [tripType]);

  const toggleDropdown = (field: DropdownField) => {
    setOpenDropdown((prev) => (prev === field ? null : field));
  };

  const openAirportSelectionModal = (field: AirportSelectionField) => {
    setOpenDropdown(null);
    setAirportSelectionField(field);
  };

  const closeAirportSelectionModal = () => {
    setAirportSelectionField(null);
  };

  const selectOption = (field: DropdownField, option: DropdownOption) => {
    switch (field) {
      case 'origin':
        setOriginOption(option);
        break;
      case 'destination':
        setDestinationOption(option);
        break;
      case 'passengers':
        setPassengersOption(option);
        break;
      case 'departureDate':
        setDepartureDateOption(option);
        break;
      case 'returnDate':
        setReturnDateOption(option);
        break;
    }

    setValidationErrors((prev) => {
      const next: FlightSearchValidationErrors = { ...prev };
      delete next[field as keyof FlightSearchValidationErrors];
      if (field === 'origin' || field === 'destination') {
        delete next.sameRoute;
      }
      return next;
    });

    setOpenDropdown(null);
  };

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
      errors.passengers = isJapanese
        ? '搭乗者数を選択してください'
        : 'Please select the number of passengers';
    }
    if (!departureDateOption) {
      errors.departureDate = isJapanese
        ? '出発日を選択してください'
        : 'Please select a departure date';
    }
    if (tripType === 'roundTrip' && !returnDateOption) {
      errors.returnDate = isJapanese ? '帰国日を選択してください' : 'Please select a return date';
    }

    return errors;
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (
      !originOption ||
      !destinationOption ||
      !passengersOption ||
      !departureDateOption ||
      (tripType === 'roundTrip' && !returnDateOption)
    ) {
      return;
    }

    setValidationErrors({});

    dispatch(
      setSearch({
        tripType,
        originCode: originOption.value,
        originLabel: originOption.label,
        destinationCode: destinationOption.value,
        destinationLabel: destinationOption.label,
        passengers: Number.parseInt(passengersOption.value, 10),
        departureDate: departureDateOption.value,
        returnDate: tripType === 'roundTrip' ? returnDateOption?.value : undefined,
      }),
    );

    router.push(searchHref);
  };

  const fieldValueClassName =
    'min-w-0 break-words text-lg font-medium leading-snug text-slate-700 sm:text-xl md:text-2xl';

  const formatDateLabel = useCallback(
    (isoDate: string): string => {
      const d = new Date(`${isoDate}T00:00:00`);
      if (isJapanese) {
        return `${d.getMonth() + 1}月${d.getDate()}日`;
      }
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    [isJapanese],
  );

  const getFieldClassName = (field: DropdownField, muted = false, forceOpen = false) => {
    const isOpen = forceOpen || openDropdown === field;
    const hasError = !!(validationErrors as Record<string, string | undefined>)[field];

    return [
      'flex w-full min-w-0 cursor-pointer items-center justify-between rounded-xl border px-4 py-4 text-left shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:px-5 sm:py-5',
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
    if (field === 'origin' || field === 'destination') return null;
    if (openDropdown !== field) return null;

    return (
      <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl">
        <ul aria-label={`${field}-options`} className="space-y-1">
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
    return (
      <p role="alert" className="mt-1 text-xs text-red-600">
        {error}
      </p>
    );
  };

  const airportSelectionModalTitle =
    airportSelectionField === 'origin'
      ? isJapanese
        ? '出発地選択'
        : 'Select departure airport'
      : airportSelectionField === 'destination'
        ? isJapanese
          ? '到着地選択'
          : 'Select destination airport'
        : undefined;

  const selectedAirportOption =
    airportSelectionField === 'origin'
      ? originOption
      : airportSelectionField === 'destination'
        ? destinationOption
        : null;

  const getAirportDetails = (code: string) => AIRPORT_OPTIONS_MAP.get(code);

  return (
    <form
      ref={formRef}
      onSubmit={handleSearch}
      noValidate
      className="w-full overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-[0_18px_48px_rgba(0,0,0,0.2)] sm:rounded-[1.75rem] sm:p-6 md:p-8"
    >
      <div className="grid w-full gap-3 md:max-w-xl md:grid-cols-2">
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
            {tripType === 'oneWay' ? (
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            ) : null}
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
            {tripType === 'roundTrip' ? (
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            ) : null}
          </span>
          {roundTripLabel}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div>
          <div className="relative">
            <button
              type="button"
              onClick={() => openAirportSelectionModal('origin')}
              aria-label={`${isJapanese ? '出発地を選択' : 'Select departure'}: ${originOption?.label ?? originLabel}`}
              aria-expanded={airportSelectionField === 'origin'}
              aria-haspopup="dialog"
              className={getFieldClassName('origin', false, airportSelectionField === 'origin')}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="text-xl text-emerald-600">◉</span>
                <span
                  className={
                    originOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`
                  }
                >
                  {originOption?.label ?? originLabel}
                </span>
              </span>
              <span className="text-emerald-600">⌄</span>
            </button>
          </div>
          {renderFieldError('origin')}
        </div>

        <div
          className="hidden text-center text-3xl font-light text-emerald-700 md:block md:pt-5"
          aria-hidden="true"
        >
          ⇄
        </div>

        <div>
          <div className="relative">
            <button
              type="button"
              onClick={() => openAirportSelectionModal('destination')}
              aria-label={`${isJapanese ? '到着地を選択' : 'Select destination'}: ${destinationOption?.label ?? destinationLabel}`}
              aria-expanded={airportSelectionField === 'destination'}
              aria-haspopup="dialog"
              className={getFieldClassName('destination', true, airportSelectionField === 'destination')}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={
                    destinationOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`
                  }
                >
                  {destinationOption?.label ?? destinationLabel}
                </span>
              </span>
              <span className="text-slate-400">⌄</span>
            </button>
          </div>
          {renderFieldError('destination')}
        </div>
      </div>

      {validationErrors.sameRoute && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {validationErrors.sameRoute}
        </p>
      )}

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
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={
                    passengersOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`
                  }
                >
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
              onClick={() => setIsDepartureDateCalendarOpen(true)}
              aria-label={`${isJapanese ? '出発日を選択' : 'Select departure date'}: ${departureDateOption?.label ?? dateLabel}`}
              aria-expanded={isDepartureDateCalendarOpen}
              aria-haspopup="dialog"
              className={getFieldClassName('departureDate', true, isDepartureDateCalendarOpen)}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={
                    departureDateOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`
                  }
                >
                  {departureDateOption?.label ?? dateLabel}
                </span>
              </span>
              <span className="text-slate-400">📅</span>
            </button>
          </div>
          {renderFieldError('departureDate')}
        </div>
      </div>

      {tripType === 'roundTrip' && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div aria-hidden="true" />
          <div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsReturnDateCalendarOpen(true)}
                aria-label={`${isJapanese ? '帰国日を選択' : 'Select return date'}: ${returnDateOption?.label ?? (isJapanese ? '帰国日' : 'Return date')}`}
                aria-expanded={isReturnDateCalendarOpen}
                aria-haspopup="dialog"
                className={getFieldClassName('returnDate', true, isReturnDateCalendarOpen)}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={
                      returnDateOption ? fieldValueClassName : `${fieldValueClassName} opacity-40`
                    }
                  >
                    {returnDateOption?.label ?? (isJapanese ? '帰国日' : 'Return date')}
                  </span>
                </span>
                <span className="text-slate-400">📅</span>
              </button>
            </div>
            {renderFieldError('returnDate')}
          </div>
        </div>
      )}

      <CalendarModal
        isOpen={isDepartureDateCalendarOpen}
        onClose={() => setIsDepartureDateCalendarOpen(false)}
        onConfirm={(date) => {
          if (date) {
            selectOption('departureDate', { value: date, label: formatDateLabel(date) });
          }
          setIsDepartureDateCalendarOpen(false);
        }}
        initialDate={departureDateOption?.value ?? null}
        months={MOCK_CALENDAR_MONTHS}
      />

      <CalendarModal
        isOpen={isReturnDateCalendarOpen}
        onClose={() => setIsReturnDateCalendarOpen(false)}
        onConfirm={(date) => {
          if (date) {
            selectOption('returnDate', { value: date, label: formatDateLabel(date) });
          }
          setIsReturnDateCalendarOpen(false);
        }}
        initialDate={returnDateOption?.value ?? null}
        months={MOCK_CALENDAR_MONTHS}
      />

      <Modal
        isOpen={airportSelectionField !== null}
        onClose={closeAirportSelectionModal}
        title={airportSelectionModalTitle}
        ariaLabel={airportSelectionModalTitle}
        size="full"
        zIndex={200}
        className="mx-2 my-2 sm:mx-4 sm:my-4 md:mx-6 md:my-6 lg:mx-auto lg:max-w-4xl"
        showFooter={false}
        bodyConfig={{ padding: 'sm', scrollable: true }}
      >
        {airportSelectionField ? (
          <ul
            aria-label={`${airportSelectionField}-options`}
            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {dropdownOptions[airportSelectionField].map((option) => {
              const isSelected = selectedAirportOption?.value === option.value;
              const airportDetails = getAirportDetails(option.value);
              const displayTitle = airportDetails
                ? `${airportDetails.city} (${airportDetails.code})`
                : option.label;
              const displaySubtitle = airportDetails
                ? `${airportDetails.airport} (${airportDetails.country})`
                : undefined;

              return (
                <li key={`${airportSelectionField}-${option.value}`}>
                  <button
                    type="button"
                    onClick={() => {
                      selectOption(airportSelectionField, option);
                      closeAirportSelectionModal();
                    }}
                    className={[
                      'w-full cursor-pointer rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                      isSelected
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700',
                    ].join(' ')}
                  >
                    <span className="flex min-w-0 items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 overflow-hidden">
                        <span className="block text-lg font-semibold leading-snug sm:text-xl">
                          {displayTitle}
                        </span>
                        {displaySubtitle ? (
                          <span className="mt-1 block overflow-hidden text-ellipsis text-xs text-slate-600 sm:text-sm">
                            {displaySubtitle}
                          </span>
                        ) : null}
                      </span>
                      {isSelected ? <span className="shrink-0 text-emerald-600">✓</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </Modal>

      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-end">
        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-emerald-700 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:w-auto sm:min-w-[14rem] sm:px-8 sm:py-4 sm:text-lg"
        >
          {searchButtonText}
        </button>
      </div>
    </form>
  );
}
