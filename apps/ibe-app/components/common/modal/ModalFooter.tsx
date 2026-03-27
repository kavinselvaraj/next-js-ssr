'use client';

/**
 * ModalFooter Component
 * Reusable footer section for modals with action buttons
 */

import React, { useState } from 'react';
import type { ModalAction, ModalFooterProps } from './types';
import { cx, getPaddingClass, getAlignmentClass, getButtonClassName } from './utils';

/**
 * Modal footer with optional divider and action buttons
 */
export const ModalFooter = React.memo(
    ({
        children,
        actions,
        className,
        showDivider = true,
        align = 'right',
        padding = 'md',
    }: ModalFooterProps) => {
        const [loadingId, setLoadingId] = useState<string | null>(null);
        const paddingClass = getPaddingClass(padding);
        const alignmentClass = getAlignmentClass(align);

        const handleActionClick = async (action?: ModalAction) => {
            if (!action || action.disabled || loadingId) return;

            try {
                if (action.loading) {
                    setLoadingId(action.id ?? action.label);
                }
                await action.onClick();
            } finally {
                if (action.loading) {
                    setLoadingId(null);
                }
            }
        };

        return (
            <div className="shrink-0">
                {showDivider && <div className="border-t border-slate-200" />}

                <div
                    className={cx('flex items-center gap-3', paddingClass, alignmentClass, 'sm:gap-4', className)}
                >
                    {children}

                    {actions && actions.length > 0 && (
                        <>
                            {children && <div className="flex-1" />}
                            {actions.map((action) => {
                                const actionKey = action.id ?? action.label;
                                const isActionLoading = loadingId === actionKey;
                                const isDisabled = action.disabled || isActionLoading;

                                return (
                                    <button
                                        key={actionKey}
                                        type="button"
                                        onClick={() => handleActionClick(action)}
                                        disabled={isDisabled}
                                        className={getButtonClassName(
                                            action.variant || 'primary',
                                            action.size || 'md',
                                            isDisabled,
                                        )}
                                    >
                                        {isActionLoading ? (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="h-4 w-4 animate-spin"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                                                    />
                                                </svg>
                                                Loading...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                {action.icon && <span>{action.icon}</span>}
                                                {action.label}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        );
    },
);

ModalFooter.displayName = 'ModalFooter';
