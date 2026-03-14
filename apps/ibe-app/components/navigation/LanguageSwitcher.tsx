'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Locale, localeCookieName } from '../../lib/i18n/index';
import { languageOptions } from '../../lib/i18n/languageOptions';
import { switchLocale } from '../../lib/i18n/switchLocale';

type LanguageSwitcherProps = {
    locale: Locale;
    preservePrefix: boolean;
    currentLanguageLabel: string;
};

export default function LanguageSwitcher({
    locale,
    preservePrefix,
    currentLanguageLabel,
}: LanguageSwitcherProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const isJapanese = locale === 'ja-jp';

    const labels = useMemo(
        () =>
            isJapanese
                ? {
                    action: '言語を変更',
                    title: '表示言語を選択',
                    subtitle: 'アプリの表示言語を選んでください。',
                    close: '閉じる',
                }
                : {
                    action: 'Change Language',
                    title: 'Choose language',
                    subtitle: 'Select the language for the application.',
                    close: 'Close',
                },
        [isJapanese],
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const onPointerDown = (event: PointerEvent) => {
            const targetNode = event.target as Node | null;

            if (dialogRef.current && targetNode && !dialogRef.current.contains(targetNode)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [isOpen]);

    const onSelectLanguage = (nextLocale: Locale) => {
        if (nextLocale === locale) {
            setIsOpen(false);
            return;
        }

        const query = searchParams.toString();
        const currentPath = query ? `${pathname}?${query}` : pathname;
        const nextPath = switchLocale(currentPath, nextLocale, { preservePrefix });

        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        setIsOpen(false);
        window.location.assign(nextPath);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1 font-medium text-slate-700 transition hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
            >
                <span>{currentLanguageLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{labels.action}</span>
            </button>

            {isOpen ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 py-8">
                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={labels.title}
                        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                    >
                        <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">{labels.title}</h2>
                                <p className="mt-1 text-sm text-slate-600">{labels.subtitle}</p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                                aria-label={labels.close}
                            >
                                ✕
                            </button>
                        </div>

                        <ul className="space-y-2" role="listbox" aria-label={labels.title}>
                            {languageOptions.map((option) => {
                                const isSelected = option.locale === locale;

                                return (
                                    <li key={option.locale}>
                                        <button
                                            type="button"
                                            onClick={() => onSelectLanguage(option.locale)}
                                            aria-pressed={isSelected}
                                            className={[
                                                'flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                                                isSelected
                                                    ? 'border-emerald-400 bg-emerald-50 text-slate-900'
                                                    : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40',
                                            ].join(' ')}
                                        >
                                            <span className="font-medium">{option.label}</span>
                                            <span className="text-sm text-slate-500">{option.nativeLabel}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            ) : null}
        </>
    );
}
