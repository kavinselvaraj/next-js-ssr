'use client';

/**
 * ModalBody Component
 * Reusable content area for modals with optional scrolling
 */

import React from 'react';
import type { ModalBodyProps } from './types';
import { cx, getPaddingClass } from './utils';

/**
 * Modal body with flexible padding and scroll options
 */
export const ModalBody = React.memo(
    ({
        children,
        className,
        scrollable = true,
        padding = 'md',
    }: ModalBodyProps) => {
        const paddingClass = getPaddingClass(padding);

        return (
            <div
                className={cx(
                    'flex-1 min-h-0',
                    scrollable ? 'overflow-y-auto' : 'overflow-hidden',
                    'scroll-smooth',
                    className
                )}
            >
                <div className={paddingClass}>
                    {children}
                </div>
            </div>
        );
    }
);

ModalBody.displayName = 'ModalBody';
