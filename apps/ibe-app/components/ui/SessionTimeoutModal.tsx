'use client';

type SessionTimeoutModalProps = {
    isWarningVisible: boolean;
    isExpired: boolean;
    countdownSeconds: number;
    onContinueSession: () => void;
};

export default function SessionTimeoutModal({
    isWarningVisible,
    isExpired,
    countdownSeconds,
    onContinueSession,
}: SessionTimeoutModalProps) {
    if (!isWarningVisible && !isExpired) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/50 p-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-live="assertive"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
                <h2 className="text-xl font-semibold text-slate-900">
                    {isExpired ? 'Session expired' : 'Inactivity warning'}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                    {isExpired
                        ? 'Session expired. Redirecting to home page.'
                        : 'Your session will expire in 1 minute due to inactivity.'}
                </p>

                {!isExpired ? (
                    <p
                        aria-live="polite"
                        className="mt-3 font-mono text-2xl font-semibold tracking-wide text-slate-900"
                    >
                        0:{String(Math.max(countdownSeconds, 0)).padStart(2, '0')}
                    </p>
                ) : null}

                {!isExpired ? (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={onContinueSession}
                            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                        >
                            Continue Session
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
