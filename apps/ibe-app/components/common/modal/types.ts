/**
 * Reusable Modal Component Types
 * Shared interfaces for modal system used across the application
 */

import type { ReactNode } from 'react';

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal animation style
 */
export type ModalAnimation = 'fade' | 'slide' | 'zoom' | 'none';

/**
 * Modal close triggers
 */
export type ModalCloseTrigger = 'button' | 'escape' | 'backdrop' | 'all';

/**
 * Modal header configuration
 */
export interface ModalHeaderConfig {
    title?: ReactNode;
    subtitle?: ReactNode;
    showCloseButton?: boolean;
    closeButtonLabel?: string;
    className?: string;
    icon?: ReactNode;
}

/**
 * Modal body configuration
 */
export interface ModalBodyConfig {
    className?: string;
    scrollable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Modal footer configuration
 */
export interface ModalFooterConfig {
    className?: string;
    showDivider?: boolean;
    align?: 'left' | 'center' | 'right' | 'space-between';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Modal action button configuration
 */
export interface ModalAction {
    id?: string;
    label: string;
    onClick: () => void | Promise<void>;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Main Modal component props
 */
export interface ModalProps {
    // State
    isOpen: boolean;
    onClose: () => void;

    // Content
    title?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;

    // Configuration
    size?: ModalSize;
    animation?: ModalAnimation;
    closeOn?: ModalCloseTrigger;
    closeOnEscape?: boolean;
    closeOnBackdropClick?: boolean;
    closeButtonLabel?: string;

    // Header
    headerConfig?: ModalHeaderConfig;

    // Body
    bodyConfig?: ModalBodyConfig;

    // Footer
    footerConfig?: ModalFooterConfig;
    actions?: ModalAction[];

    // Styling
    className?: string;
    backdropClassName?: string;
    contentClassName?: string;
    showHeader?: boolean;
    showFooter?: boolean;

    // Accessibility
    ariaLabel?: string;
    ariaDescribedBy?: string;

    // Behavior
    preventDefaultClose?: boolean;
    onBeforeClose?: () => boolean | Promise<boolean>;
    onAfterOpen?: () => void;

    // Z-index
    zIndex?: number;

    // Backdrop
    showBackdrop?: boolean;
    backdropOpacity?: number;
}

/**
 * Modal header component props
 */
export interface ModalHeaderProps {
    title?: ReactNode;
    subtitle?: ReactNode;
    onClose?: () => void;
    showCloseButton?: boolean;
    closeButtonLabel?: string;
    icon?: ReactNode;
    className?: string;
}

/**
 * Modal body component props
 */
export interface ModalBodyProps {
    children?: ReactNode;
    className?: string;
    scrollable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Modal footer component props
 */
export interface ModalFooterProps {
    children?: ReactNode;
    actions?: ModalAction[];
    className?: string;
    showDivider?: boolean;
    align?: 'left' | 'center' | 'right' | 'space-between';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Modal context for nested components
 */
export interface ModalContextType {
    isOpen: boolean;
    onClose: () => void;
    size: ModalSize;
    animation: ModalAnimation;
}

/**
 * Hook return type for useModal
 */
export interface UseModalReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}
