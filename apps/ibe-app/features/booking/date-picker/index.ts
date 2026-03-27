/**
 * Date Picker Module - Public API
 * Main barrel export for the complete reusable date picker system
 */

// Types
export type {
    TripType,
    DateCellState,
    DateSelection,
    CalendarDay,
    FareCalendarData,
    DatePickerConstraints,
    CalendarConfig,
    DatePickerProps,
    DateSelectionState,
    CalendarNavigationState,
    DatePickerState,
    DatePickerHeaderProps,
    SelectedDateSummaryProps,
    DatePickerFooterProps,
    CalendarNavigationProps,
    CalendarDayCellProps,
    CalendarGridProps,
    CalendarMonthProps,
} from './types';

// Constants
export {
    DEFAULT_CALENDAR_CONFIG,
    WEEKDAY_LABELS_EN,
    WEEKDAY_LABELS_JA,
    MONTH_LABELS_EN,
    MONTH_LABELS_JA,
    DEFAULT_CONSTRAINTS,
    DATE_CELL_STATE_CLASSES,
    CALENDAR_MONTH_RANGE,
    MODAL_ANIMATION_CLASSES,
    FOCUS_OUTLINE_CLASS,
    DEFAULT_ROUND_TRIP_MIN_STAY,
    DEFAULT_ROUND_TRIP_MAX_STAY,
    CURRENCY_SYMBOLS,
} from './constants';

// Utilities
export {
    getISODateString,
    cloneDate,
    setDateToStartOfDay,
    isSameDay,
    isDateBefore,
    isDateAfter,
    isDateBetween,
    isToday,
    getDaysBetween,
    addDaysToDate,
    getFirstDayOfMonth,
    getDaysInMonth,
    generateCalendarDays,
    determineDateCellState,
    formatDateLabel,
    formatDateRange,
    getDateCellClasses,
    isValidRoundTripSelection,
    isValidOneWaySelection,
    getMonthOffset,
    getDateForMonthOffset,
    smartSwapDatesIfNeeded,
    formatPrice,
    clampDate,
} from './utils';

// Hooks
export {
    useDateSelection,
    useCalendarNavigation,
    useDatePicker,
    useDatePickerModal,
} from './hooks';

// Components
export {
    CalendarDayCell,
    CalendarGrid,
    CalendarMonth,
    CalendarNavigation,
    SelectedDateSummary,
    DatePickerHeader,
    DatePickerFooter,
    DatePickerModal,
} from './components';
