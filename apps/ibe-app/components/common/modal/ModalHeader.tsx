'use client';

/**
 * ModalHeader Component
 * Reusable header section for modals with title, subtitle, and close button
 */

import React from 'react';
import type { ModalHeaderProps } from './types';
import { cx } from './utils';

/**
 * Modal header with title, subtitle, and optional close button
 */
export const ModalHeader = React.memo(
    ({
        title,
        subtitle,
        onClose,
        showCloseButton = true,
        closeButtonLabel = 'Close',
        icon,
        className,
    }: ModalHeaderProps) => {
        return (
            <div
                className={cx(
                    'flex items-start justify-between gap-4 shrink-0',
                    'border-b border-slate-200 px-4 py-4 sm:px-6',
                    className
                )}
            >
                {/* Title and subtitle section */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Icon (optional) */}
                    {icon && (
                        <div className="flex-shrink-0 mt-1">
                            {typeof icon === 'string' ? (
                                <span className="text-lg">{icon}</span>
                            ) : (
                                icon
                            )}
                        </div>
                    )}

                    {/* Text content */}
                    <div className="min-w-0 flex-1">
                        {title && (
                            <h2 className="text-lg font-bold text-slate-900 truncate">
                                {title}
                            </h2>
                        )}
                        {subtitle && (
                            <p className="text-sm text-slate-600 mt-1 truncate">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Close button */}
                {showCloseButton && onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={closeButtonLabel}
                        className="flex-shrink-0 p-2 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
        );
    }
);

ModalHeader.displayName = 'ModalHeader';
