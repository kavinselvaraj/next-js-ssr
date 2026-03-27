'use client';

import type { SeatType } from './types';

type SeatOption = {
    value: SeatType;
    label: string;
};

const SEAT_OPTIONS: SeatOption[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'zip-full-flat', label: 'ZIP Full-Flat' },
];

type SeatTypeSelectorProps = {
    selected: SeatType;
    onChange: (type: SeatType) => void;
};

export default function SeatTypeSelector({ selected, onChange }: SeatTypeSelectorProps) {
    return (
        <div role="radiogroup" aria-label="席タイプ" className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-slate-600 shrink-0">席タイプ</span>

            {SEAT_OPTIONS.map((option) => {
                const isActive = selected === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => onChange(option.value)}
                        className={[
                            'flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                            isActive
                                ? 'border-emerald-700 bg-white text-emerald-700'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700',
                        ].join(' ')}
                    >
                        {/* Radio circle */}
                        <span
                            className={[
                                'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                                isActive ? 'border-emerald-700' : 'border-slate-400',
                            ].join(' ')}
                        >
                            {isActive && (
                                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                            )}
                        </span>
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
