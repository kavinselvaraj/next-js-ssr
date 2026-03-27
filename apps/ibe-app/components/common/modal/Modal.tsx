'use client';

/**
 * Modal Component
 * Reusable modal component for the entire application
 * Supports flexible content, header, footer, and comprehensive configuration
 */

import React, { useCallback, useEffect, useRef } from 'react';
import type { ModalProps } from './types';
import { ModalHeader } from './ModalHeader';
import { ModalBody } from './ModalBody';
import { ModalFooter } from './ModalFooter';
import {
    cx,
    lockBodyScroll,
    unlockBodyScroll,
    getModalSizeClass,
    getModalAnimationClass,
    getBackdropOpacityClass,
    getZIndex,
} from './utils';
import { DEFAULT_MODAL_CONFIG } from './constants';

/**
 * Main Modal component
 * Fully configurable, accessible, and reusable across the application
 */
export const Modal = React.memo(
    ({
        isOpen,
        onClose,
        title,
        children,
        footer,
        size = DEFAULT_MODAL_CONFIG.size,
        animation = DEFAULT_MODAL_CONFIG.animation,
        closeOnEscape = DEFAULT_MODAL_CONFIG.closeOnEscape,
        closeOnBackdropClick = DEFAULT_MODAL_CONFIG.closeOnBackdropClick,
        closeButtonLabel = 'Close',
        headerConfig,
        bodyConfig,
        footerConfig,
        actions,
        className,
        backdropClassName,
        contentClassName,
        showHeader = DEFAULT_MODAL_CONFIG.showHeader,
        showFooter = DEFAULT_MODAL_CONFIG.showFooter,
        ariaLabel,
        ariaDescribedBy,
        preventDefaultClose = false,
        onBeforeClose,
        onAfterOpen,
        zIndex = DEFAULT_MODAL_CONFIG.zIndex,
        showBackdrop = DEFAULT_MODAL_CONFIG.showBackdrop,
        backdropOpacity = DEFAULT_MODAL_CONFIG.backdropOpacity,
    }: ModalProps) => {
        const dialogRef = useRef<HTMLDivElement>(null);
        const backdropRef = useRef<HTMLDivElement>(null);
        const previousFocusRef = useRef<HTMLElement | null>(null);
        const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

        /**
         * Handle close with before/after hooks
         */
        const handleClose = useCallback(async () => {
            if (preventDefaultClose) return;

            // Call before close hook
            if (onBeforeClose) {
                const canClose = await onBeforeClose();
                if (!canClose) return;
            }

            onClose();
        }, [onClose, preventDefaultClose, onBeforeClose]);

        /**
         * Handle Escape key
         */
        const handleKeyDown = useCallback(
            (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Escape' && closeOnEscape) {
                    e.preventDefault();
                    handleClose();
                }
            },
            [closeOnEscape, handleClose]
        );

        /**
         * Handle backdrop click
         */
        const handleBackdropClick = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (closeOnBackdropClick && e.target === backdropRef.current) {
                    handleClose();
                }
            },
            [closeOnBackdropClick, handleClose]
        );

        /**
         * Handle modal open
         */
        useEffect(() => {
            if (isOpen) {
                // Save previous focus
                previousFocusRef.current = document.activeElement as HTMLElement;

                // Lock scroll
                lockBodyScroll();

                // Focus close button or dialog
                if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                }

                closeTimeoutRef.current = setTimeout(() => {
                    if (showHeader && headerConfig?.showCloseButton !== false) {
                        const closeButton = dialogRef.current?.querySelector(
                            'button[aria-label]'
                        ) as HTMLButtonElement | null;
                        closeButton?.focus();
                    } else if (dialogRef.current) {
                        dialogRef.current.focus();
                    }

                    onAfterOpen?.();
                }, 50);
            } else {
                // Unlock scroll
                unlockBodyScroll();

                // Restore focus
                if (previousFocusRef.current) {
                    previousFocusRef.current.focus();
                }
            }

            return () => {
                if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                }
                unlockBodyScroll();
            };
        }, [isOpen, onAfterOpen, showHeader, headerConfig?.showCloseButton]);

        if (!isOpen) {
            return null;
        }

        const sizeClass = getModalSizeClass(size);
        const animationClass = getModalAnimationClass(animation);
        const backdropOpacityClass = getBackdropOpacityClass(backdropOpacity);
        const computedZIndex = getZIndex(zIndex);
        const computedAriaLabel = ariaLabel ?? (typeof title === 'string' ? title : undefined);

        return (
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                style={{ zIndex: computedZIndex }}
                onKeyDown={handleKeyDown}
            >
                {/* Backdrop */}
                {showBackdrop && (
                    <div
                        ref={backdropRef}
                        className={cx(
                            'fixed inset-0',
                            backdropOpacityClass,
                            TRANSITION_CLASSES,
                            backdropClassName
                        )}
                        onClick={handleBackdropClick}
                        role="presentation"
                    />
                )}

                {/* Centering wrapper */}
                <div className="flex min-h-full items-start justify-center p-2 sm:items-center sm:p-4 md:p-6">
                    {/* Modal dialog */}
                    <div
                        ref={dialogRef}
                        className={cx(
                            'relative flex w-full flex-col rounded-lg bg-white shadow-xl',
                            'max-h-[calc(100dvh-1rem)] sm:max-h-[90vh]',
                            sizeClass,
                            animationClass,
                            TRANSITION_CLASSES,
                            contentClassName,
                            className
                        )}
                        role="dialog"
                        aria-modal="true"
                        aria-label={computedAriaLabel}
                        aria-describedby={ariaDescribedBy}
                        tabIndex={-1}
                    >
                        {/* Header */}
                        {showHeader && (
                            <ModalHeader
                                title={title || headerConfig?.title}
                                subtitle={headerConfig?.subtitle}
                                onClose={handleClose}
                                showCloseButton={headerConfig?.showCloseButton !== false}
                                closeButtonLabel={closeButtonLabel}
                                icon={headerConfig?.icon}
                                className={headerConfig?.className}
                            />
                        )}

                        {/* Body */}
                        {children && (
                            <ModalBody
                                className={bodyConfig?.className}
                                scrollable={bodyConfig?.scrollable !== false}
                                padding={bodyConfig?.padding}
                            >
                                {children}
                            </ModalBody>
                        )}

                        {/* Footer */}
                        {(showFooter || footer || actions) && (
                            <ModalFooter
                                actions={actions}
                                className={footerConfig?.className}
                                showDivider={footerConfig?.showDivider !== false}
                                align={footerConfig?.align}
                                padding={footerConfig?.padding}
                            >
                                {footer}
                            </ModalFooter>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

Modal.displayName = 'Modal';

// Import constants at the end to avoid circular dependency
import { TRANSITION_CLASSES } from './constants';
