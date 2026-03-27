'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CalendarFooter from './CalendarFooter';
import CalendarMonthView from './CalendarMonthView';
import SeatTypeSelector from './SeatTypeSelector';
import type { CalendarModalProps, SeatType } from './types';

function getTodayISO(): string {
    return new Date().toISOString().split('T')[0];
}

function formatSelectedDateLabel(dateISO: string): string {
    const d = new Date(`${dateISO}T00:00:00`);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export default function CalendarModal({
    isOpen,
    onClose,
    onConfirm,
    initialDate = null,
    initialSeatType = 'standard',
    months,
    onInfoLinkClick,
}: CalendarModalProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
    const [seatType, setSeatType] = useState<SeatType>(initialSeatType);
    const [monthOffset, setMonthOffset] = useState(0);
    const todayISO = getTodayISO();
    const dialogRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedDate(initialDate);
            setSeatType(initialSeatType);
            setMonthOffset(0);
            // Focus the close button on open for accessibility
            setTimeout(() => closeButtonRef.current?.focus(), 50);
        }
    }, [isOpen, initialDate, initialSeatType]);

    // Escape key to close
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll while modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleBackdropClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) onClose();
        },
        [onClose],
    );

    const handleReset = useCallback(() => {
        setSelectedDate(null);
    }, []);

    const handleConfirm = useCallback(() => {
        onConfirm(selectedDate, seatType);
        onClose();
    }, [onConfirm, selectedDate, seatType, onClose]);

    const canGoPrev = monthOffset > 0;
    const canGoNext = monthOffset + 2 < months.length;

    const leftMonth = months[monthOffset];
    const rightMonth = months[monthOffset + 1];

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[2000] overflow-y-auto bg-slate-950/50 animate-fade-in"
            aria-modal="true"
            role="dialog"
            aria-label="日付選択"
        >
            {/* Inner centering wrapper — backdrop click fires here, not on the modal */}
            <div
                className="flex min-h-full items-center justify-center p-4"
                onClick={handleBackdropClick}
            >
                <div
                    ref={dialogRef}
                    className="relative flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl max-h-[90vh]"
                >
                    {/* ── Header ─────────────────────────────────────────── */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                        <h2 className="text-xl font-bold text-slate-900">日付選択</h2>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            aria-label="閉じる"
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    {/* ── Sub-header: seat type + info link ──────────────── */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-200 shrink-0">
                        <SeatTypeSelector selected={seatType} onChange={setSeatType} />

                        <button
                            type="button"
                            onClick={onInfoLinkClick}
                            className="flex items-center gap-1 text-sm text-emerald-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            カレンダーの見方について
                        </button>
                    </div>

                    {/* ── Selected date summary ───────────────────────────── */}
                    {selectedDate && (
                        <div className="px-6 py-2 text-center text-sm font-semibold text-emerald-700 border-b border-slate-100 shrink-0">
                            {formatSelectedDateLabel(selectedDate)}
                        </div>
                    )}

                    {/* ── Calendar body ───────────────────────────────────── */}
                    {/*
                 * Block container (not flex-row) so overflow-y-auto reliably
                 * measures vertical overflow against its flex-derived height.
                 */}
                    <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
                        <div className="flex px-4 py-4">
                            {/* Prev arrow */}
                            <div className="flex items-start pt-8 pr-2 shrink-0">
                                <button
                                    type="button"
                                    aria-label="前の月"
                                    disabled={!canGoPrev}
                                    onClick={() => setMonthOffset((o) => o - 1)}
                                    className={[
                                        'flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition',
                                        canGoPrev
                                            ? 'hover:bg-slate-100 text-slate-700 cursor-pointer'
                                            : 'opacity-30 cursor-not-allowed text-slate-400',
                                    ].join(' ')}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Two-month grid */}
                            <div className="flex flex-1 gap-6 min-w-0">
                                {leftMonth && (
                                    <CalendarMonthView
                                        monthData={leftMonth}
                                        selectedDate={selectedDate}
                                        todayISO={todayISO}
                                        onSelectDate={setSelectedDate}
                                    />
                                )}

                                {/* Vertical divider */}
                                {leftMonth && rightMonth && (
                                    <div className="w-px bg-slate-200 shrink-0 self-stretch" aria-hidden="true" />
                                )}

                                {rightMonth && (
                                    <CalendarMonthView
                                        monthData={rightMonth}
                                        selectedDate={selectedDate}
                                        todayISO={todayISO}
                                        onSelectDate={setSelectedDate}
                                    />
                                )}
                            </div>

                            {/* Next arrow */}
                            <div className="flex items-start pt-8 pl-2 shrink-0">
                                <button
                                    type="button"
                                    aria-label="次の月"
                                    disabled={!canGoNext}
                                    onClick={() => setMonthOffset((o) => o + 1)}
                                    className={[
                                        'flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 transition',
                                        canGoNext
                                            ? 'hover:bg-slate-100 text-slate-700 cursor-pointer'
                                            : 'opacity-30 cursor-not-allowed text-slate-400',
                                    ].join(' ')}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>{/* end inner flex row */}
                    </div>{/* end calendar body scroll container */}

                    {/* ── Footer ─────────────────────────────────────────── */}
                    <div className="shrink-0">
                        <CalendarFooter onReset={handleReset} onConfirm={handleConfirm} />
                    </div>
                </div>
            </div>{/* end inner centering wrapper */}
        </div>
    );
}
