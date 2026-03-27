'use client';

/**
 * EXAMPLE: Confirmation Modal
 * Generic reusable confirmation dialog for delete, confirm, or warning scenarios
 */

import React from 'react';
import { Modal } from '../../modal';
import type { ModalAction } from '../../modal/types';

export type ConfirmationVariant = 'info' | 'warning' | 'danger' | 'success';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string | React.ReactNode;
    variant?: ConfirmationVariant;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
    isDangerous?: boolean;
    icon?: React.ReactNode;
}

/**
 * Get icon and colors based on variant
 */
function getVariantConfig(variant: ConfirmationVariant) {
    const configs = {
        info: {
            icon: 'ℹ️',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-900',
            buttonVariant: 'primary' as const,
        },
        warning: {
            icon: '⚠️',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: 'text-yellow-900',
            buttonVariant: 'primary' as const,
        },
        danger: {
            icon: '🚨',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: 'text-red-900',
            buttonVariant: 'danger' as const,
        },
        success: {
            icon: '✅',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: 'text-green-900',
            buttonVariant: 'primary' as const,
        },
    };

    return configs[variant];
}

/**
 * Generic confirmation modal
 * Demonstrates: variants, async handling, warning states
 */
export function ConfirmationModal({
    isOpen,
    onClose,
    title,
    message,
    variant = 'info',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    isDangerous = false,
    icon,
}: ConfirmationModalProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const config = getVariantConfig(variant);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const actions: ModalAction[] = [
        {
            id: 'cancel',
            label: cancelLabel,
            variant: 'secondary',
            onClick: onClose,
            disabled: isLoading,
        },
        {
            id: 'confirm',
            label: confirmLabel,
            variant: isDangerous ? 'danger' : config.buttonVariant,
            onClick: handleConfirm,
            loading: isLoading,
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showHeader
            showFooter
            title={title}
            actions={actions}
            footerConfig={{ align: 'right' }}
            headerConfig={{ icon: icon || config.icon }}
        >
            <div className={`p-4 rounded-md border ${config.bgColor} ${config.borderColor}`}>
                <p className={`text-sm ${config.textColor}`}>
                    {message}
                </p>
            </div>
        </Modal>
    );
}

/**
 * Demo showing confirmation modal
 */
export function ConfirmationModalDemo() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [variant, setVariant] = React.useState<ConfirmationVariant>('info');
    const [result, setResult] = React.useState<string>();

    const handleConfirm = async () => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setResult(`Confirmed: ${variant}`);
                resolve(undefined);
            }, 1000);
        });
    };

    return (
        <div className="p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmation Modal Demo</h2>

            <div className="space-y-2 mb-4">
                {(['info', 'warning', 'danger', 'success'] as const).map((v) => (
                    <button
                        key={v}
                        onClick={() => {
                            setVariant(v);
                            setIsOpen(true);
                        }}
                        className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md text-left"
                    >
                        Show {v.toUpperCase()} Modal
                    </button>
                ))}
            </div>

            {result && <p className="text-sm text-green-600">{result}</p>}

            <ConfirmationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`${variant.toUpperCase()} Confirmation`}
                message={`This is a ${variant} confirmation modal. Click confirm to proceed.`}
                variant={variant}
                onConfirm={handleConfirm}
                isDangerous={variant === 'danger'}
            />
        </div>
    );
}
