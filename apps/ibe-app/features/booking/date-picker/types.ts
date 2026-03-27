/**
 * Date Picker Types
 * Shared interface definitions for the reusable date picker system
 */

export type TripType = 'oneWay' | 'roundTrip';

export type DateCellState =
    | 'default'
    | 'selected'
    | 'rangeStart'
    | 'rangeMiddle'
    | 'rangeEnd'
    | 'disabled'
    | 'unavailable'
    | 'today';

/**
 * Date selection state model
 * Handles both one-way (single date) and round-trip (date range) scenarios
 */
export interface DateSelection {
    tripType: TripType;
    departureDate: Date | null;
    returnDate: Date | null;
    hoveredDate?: Date | null;
    focusedInput?: 'departure' | 'return';
}

/**
 * Represents a single day in the calendar with availability and fare info
 */
export interface CalendarDay {
    date: Date;
    state: DateCellState;
    availabilityId?: string;
    price?: number;
    currency?: string;
    available?: boolean;
}

/**
 * One month's calendar data
 */
export interface CalendarMonth {
    year: number;
    month: number; // 0-11
    days: CalendarDay[];
}

/**
 * Fare/availability data keyed by ISO date string
 * Extensible structure for future enhancements (seat types, multiple pricing tiers, etc.)
 */
export interface FareCalendarData {
    [isoDateString: string]: {
        price?: number;
        currency?: string;
        available?: boolean;
        seatClass?: string;
        restrictionCode?: string;
    };
}

/**
 * Constraints for date selection
 */
export interface DatePickerConstraints {
    minDate?: Date;
    maxDate?: Date;
    unavailableDates?: Date[];
    minStay?: number; // for round-trip: minimum days between departure and return
    maxStay?: number; // for round-trip: maximum days between departure and return
    blockoutDates?: Date[];
    disablePastDates?: boolean;
}

/**
 * Configuration for calendar presentation
 */
export interface CalendarConfig {
    monthsToShow: number; // 1 for mobile, 2 for desktop
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
    showFares: boolean;
    showWeekdayLabels: boolean;
    locale?: string; // for future i18n support
}

/**
 * Props for the Date Picker Modal component
 */
export interface DatePickerProps {
    isOpen: boolean;
    tripType: TripType;
    initialDepartureDate?: Date | null;
    initialReturnDate?: Date | null;
    onClose: () => void;
    onConfirm: (selection: {
        departureDate: Date | null;
        returnDate: Date | null;
    }) => void;
    onReset?: () => void;
    constraints?: DatePickerConstraints;
    fareCalendarData?: FareCalendarData;
    calendarConfig?: Partial<CalendarConfig>;
    disableBackdropClose?: boolean;
    showFareLegend?: boolean;
}

/**
 * State returned by useDateSelection hook
 */
export interface DateSelectionState {
    selection: DateSelection;
    isValid: boolean;
    canConfirm: boolean;
    handleDateClick: (date: Date) => void;
    handleHoverDate: (date: Date | null) => void;
    handleFocusInput: (input: 'departure' | 'return') => void;
    resetSelection: () => void;
    confirmSelection: () => {
        departureDate: Date | null;
        returnDate: Date | null;
    };
}

/**
 * State returned by useCalendarNavigation hook
 */
export interface CalendarNavigationState {
    visibleMonths: CalendarMonth[];
    visibleMonthIndices: number[];
    canGoToPrevious: boolean;
    canGoToNext: boolean;
    goToPreviousMonth: () => void;
    goToNextMonth: () => void;
    goToMonth: (monthOffset: number) => void;
}

/**
 * Full date picker state (top-level hook)
 */
export interface DatePickerState {
    dateSelection: DateSelectionState;
    calendarNavigation: CalendarNavigationState;
    isInitialized: boolean;
}

/**
 * Props for individual components
 */
export interface DatePickerHeaderProps {
    tripType: TripType;
    onClose: () => void;
}

export interface SelectedDateSummaryProps {
    tripType: TripType;
    departureDate: Date | null;
    returnDate: Date | null;
    locale?: string;
}

export interface DatePickerFooterProps {
    canConfirm: boolean;
    onReset: () => void;
    onConfirm: () => void;
    helperText?: string;
    showResetButton?: boolean;
}

export interface CalendarNavigationProps {
    canGoToPrevious: boolean;
    canGoToNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    currentMonthLabel?: string;
    className?: string;
    buttonClassName?: string;
}

export interface CalendarDayCellProps {
    date: Date;
    state: DateCellState;
    price?: number;
    currency?: string;
    onClick: (date: Date) => void;
    onHover: (date: Date | null) => void;
    showPrice?: boolean;
}

export interface CalendarGridProps {
    days: CalendarDay[];
    onDayClick: (date: Date) => void;
    onDayHover: (date: Date | null) => void;
    showFares?: boolean;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CalendarMonthProps {
    month: CalendarMonth;
    showFares?: boolean;
    onDayClick: (date: Date) => void;
    onDayHover: (date: Date | null) => void;
    monthLabel?: string;
    locale?: string;
}
