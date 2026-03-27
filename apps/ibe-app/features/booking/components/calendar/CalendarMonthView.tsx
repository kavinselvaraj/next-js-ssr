'use client';

import CalendarDayCell from './CalendarDayCell';
import type { CalendarMonth } from './types';

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'] as const;

type CalendarMonthViewProps = {
    monthData: CalendarMonth;
    selectedDate: string | null;
    todayISO: string;
    onSelectDate: (date: string) => void;
};

function getDayOfWeek(dateStr: string): number {
    return new Date(`${dateStr}T00:00:00`).getDay();
}

function buildMonthGrid(monthData: CalendarMonth): Array<{ date: string; price?: number; availability: 'available' | 'sold-out' | 'closed' } | null> {
    if (monthData.days.length === 0) return [];

    const firstDow = getDayOfWeek(monthData.days[0].date);
    const grid: Array<typeof monthData.days[0] | null> = [
        ...Array(firstDow).fill(null),
        ...monthData.days,
    ];

    // Pad end to complete last week row
    const remainder = grid.length % 7;
    if (remainder !== 0) {
        for (let i = 0; i < 7 - remainder; i++) {
            grid.push(null);
        }
    }

    return grid;
}

export default function CalendarMonthView({
    monthData,
    selectedDate,
    todayISO,
    onSelectDate,
}: CalendarMonthViewProps) {
    const grid = buildMonthGrid(monthData);
    const monthLabel = `${monthData.year}年${monthData.month + 1}月`;

    return (
        <div className="flex flex-1 flex-col gap-3 min-w-0">
            {/* Month heading */}
            <h3 className="text-center text-xl font-bold text-emerald-700">{monthLabel}</h3>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-center">
                {WEEKDAY_LABELS.map((label) => (
                    <div key={label} className="text-xs font-semibold text-slate-500 py-1">
                        {label}
                    </div>
                ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-1">
                {grid.map((day, idx) => (
                    <CalendarDayCell
                        key={day ? day.date : `empty-${idx}`}
                        day={day}
                        isSelected={day !== null && day.date === selectedDate}
                        isToday={day !== null && day.date === todayISO}
                        onClick={onSelectDate}
                    />
                ))}
            </div>
        </div>
    );
}
