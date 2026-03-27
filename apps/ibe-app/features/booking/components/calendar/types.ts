export type SeatType = 'standard' | 'zip-full-flat';

export type DateAvailability = 'available' | 'sold-out' | 'closed';

export type CalendarDay = {
    /** ISO date string, e.g. "2025-07-16" */
    date: string;
    /** Price in yen, undefined if not for sale */
    price?: number;
    availability: DateAvailability;
};

export type CalendarMonth = {
    /** Full year, e.g. 2025 */
    year: number;
    /** 0-indexed month, e.g. 6 = July */
    month: number;
    days: CalendarDay[];
};

export type CalendarModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (selectedDate: string | null, seatType: SeatType) => void;
    initialDate?: string | null;
    initialSeatType?: SeatType;
    months: CalendarMonth[];
    /** Informational link handler */
    onInfoLinkClick?: () => void;
};
