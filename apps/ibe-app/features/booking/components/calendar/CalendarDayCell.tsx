'use client';

import type { CalendarDay } from './types';

type CalendarDayCellProps = {
    day: CalendarDay | null;
    isSelected: boolean;
    isToday: boolean;
    onClick: (date: string) => void;
};

const WEEKDAY_SUNDAY = 0;
const WEEKDAY_SATURDAY = 6;

function getDayOfWeek(dateStr: string): number {
    return new Date(`${dateStr}T00:00:00`).getDay();
}

function formatPrice(yen: number): string {
    return `¥${yen.toLocaleString('ja-JP')}`;
}

export default function CalendarDayCell({
    day,
    isSelected,
    isToday,
    onClick,
}: CalendarDayCellProps) {
    // Empty filler cell for day-grid alignment
    if (!day) {
        return <div aria-hidden="true" />;
    }

    const dateNum = parseInt(day.date.split('-')[2], 10);
    const dow = getDayOfWeek(day.date);
    const isSunday = dow === WEEKDAY_SUNDAY;
    const isSaturday = dow === WEEKDAY_SATURDAY;
    const isDisabled = day.availability !== 'available';

    const baseCell =
        'flex flex-col items-center justify-center rounded-full w-12 h-12 mx-auto select-none transition-colors text-sm font-medium leading-none';

    let cellClass = baseCell;
    let dateClass = 'text-sm font-semibold';
    let priceClass = 'text-[10px] font-normal mt-0.5';

    if (isSelected) {
        cellClass += ' bg-emerald-700 text-white';
        dateClass += ' text-white';
        priceClass += ' text-emerald-200';
    } else if (isDisabled) {
        cellClass += ' cursor-not-allowed opacity-50';
        dateClass +=
            day.availability === 'closed' ? ' text-slate-400' : ' text-slate-400 line-through';
        priceClass += ' text-slate-400';
    } else {
        cellClass += ' cursor-pointer hover:bg-emerald-50 hover:text-emerald-700';
        if (isSunday) dateClass += ' text-slate-900';
        else if (isSaturday) dateClass += ' text-slate-900';
        else dateClass += ' text-slate-900';
        priceClass += ' text-slate-500';
    }

    if (isToday && !isSelected) {
        cellClass += ' ring-2 ring-emerald-400';
    }

    const availabilityLabel = day.availability === 'sold-out' ? '×' : day.availability === 'closed' ? '-' : undefined;

    function handleClick() {
        if (!isDisabled) onClick(day!.date);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(day!.date);
        }
    }

    return (
        <div
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            aria-label={`${day.date}${day.price ? ` ¥${day.price.toLocaleString('ja-JP')}` : ''}`}
            aria-pressed={isSelected}
            aria-disabled={isDisabled}
            className={cellClass}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <span className={dateClass}>{dateNum}</span>

            {availabilityLabel ? (
                <span className={priceClass}>{availabilityLabel}</span>
            ) : day.price !== undefined ? (
                <span className={priceClass}>{formatPrice(day.price)}</span>
            ) : null}
        </div>
    );
}
