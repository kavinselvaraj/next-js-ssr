'use client';

type CalendarFooterProps = {
    onReset: () => void;
    onConfirm: () => void;
};

export default function CalendarFooter({ onReset, onConfirm }: CalendarFooterProps) {
    return (
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500">価格は在庫状況により変動する可能性があります</p>

            <div className="flex items-center gap-3 shrink-0">
                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1"
                >
                    リセット
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                >
                    選択を確定する
                </button>
            </div>
        </div>
    );
}
