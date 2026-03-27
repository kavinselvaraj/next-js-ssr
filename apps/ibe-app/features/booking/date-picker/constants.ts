/**
 * Constants for the Date Picker system
 */

import type { CalendarConfig } from './types';

/**
 * Default calendar configuration
 */
export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
    monthsToShow: 2, // 2 months desktop (can be 1 for mobile)
    weekStartsOn: 0, // Sunday
    showFares: true,
    showWeekdayLabels: true,
    locale: 'en-US',
};

/**
 * Weekday labels (starting Sunday)
 * Can be replaced with i18n in the future
 */
export const WEEKDAY_LABELS_EN: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
];

export const WEEKDAY_LABELS_JA: string[] = [
    '日',
    '月',
    '火',
    '水',
    '木',
    '金',
    '土',
];

/**
 * Month labels (0-indexed, for display)
 */
export const MONTH_LABELS_EN: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const MONTH_LABELS_JA: string[] = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
];

/**
 * Default calendar constraint values
 */
export const DEFAULT_CONSTRAINTS = {
    disablePastDates: true,
    minStay: 0, // for round-trip
    maxStay: 365, // for round-trip
};

/**
 * CSS class names for styling
 */
export const DATE_CELL_STATE_CLASSES: Record<string, string> = {
    default: 'bg-white hover:bg-slate-100 text-slate-900 cursor-pointer',
    selected: 'bg-emerald-500 text-white font-semibold hover:bg-emerald-600',
    rangeStart:
        'bg-emerald-500 text-white font-semibold hover:bg-emerald-600 rounded-l-lg',
    rangeMiddle: 'bg-emerald-100 text-slate-900 hover:bg-emerald-200',
    rangeEnd:
        'bg-emerald-500 text-white font-semibold hover:bg-emerald-600 rounded-r-lg',
    disabled:
        'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50 line-through',
    unavailable:
        'bg-slate-50 text-slate-400 cursor-not-allowed opacity-40 line-through',
    today: 'ring-2 ring-blue-400 bg-slate-100 hover:bg-slate-200',
};

/**
 * Minimum/maximum months to show in calendar (for constraints)
 */
export const CALENDAR_MONTH_RANGE = {
    minMonths: 1,
    maxMonths: 12, // can look ahead up to 12 months
};

/**
 * Tailwind animation for modal entrance
 */
export const MODAL_ANIMATION_CLASSES =
    'animate-fade-in transition-all duration-300';

/**
 * Accessibility focus outline
 */
export const FOCUS_OUTLINE_CLASS = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500';

/**
 * Default minimum stay for round-trip bookings (in days)
 */
export const DEFAULT_ROUND_TRIP_MIN_STAY = 0;

/**
 * Default maximum stay for round-trip bookings (in days)
 */
export const DEFAULT_ROUND_TRIP_MAX_STAY = 365;

/**
 * Currency symbols (for display in fare cells)
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
    JPY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    INR: '₹',
    SGD: 'S$',
    HKD: 'HK$',
    THB: '฿',
};
