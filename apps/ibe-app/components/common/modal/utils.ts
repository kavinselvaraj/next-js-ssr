/**
 * Utility functions for Modal component
 */

import {
    MODAL_SIZE_CLASSES,
    MODAL_ANIMATION_CLASSES,
    PADDING_CLASSES,
    BUTTON_VARIANT_CLASSES,
    BUTTON_SIZE_CLASSES,
    BACKDROP_OPACITY_MAP,
    ALIGNMENT_CLASSES,
} from './constants';
import type { ModalSize, ModalAnimation } from './types';

/**
 * Get modal size class
 */
export function getModalSizeClass(size: ModalSize): string {
    return MODAL_SIZE_CLASSES[size] || MODAL_SIZE_CLASSES.md;
}

/**
 * Get modal animation class
 */
export function getModalAnimationClass(animation: ModalAnimation): string {
    return MODAL_ANIMATION_CLASSES[animation] || '';
}

/**
 * Get padding class
 */
export function getPaddingClass(
    padding?: 'none' | 'sm' | 'md' | 'lg'
): string {
    if (!padding) return PADDING_CLASSES.md;
    return PADDING_CLASSES[padding];
}

/**
 * Get button variant class
 */
export function getButtonVariantClass(
    variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary'
): string {
    return BUTTON_VARIANT_CLASSES[variant];
}

/**
 * Get button size class
 */
export function getButtonSizeClass(
    size: 'sm' | 'md' | 'lg' = 'md'
): string {
    return BUTTON_SIZE_CLASSES[size];
}

/**
 * Get backdrop opacity class
 */
export function getBackdropOpacityClass(opacity: number): string {
    const rounded = Math.round(opacity / 10) * 10;
    const clamped = Math.max(0, Math.min(90, rounded));
    return BACKDROP_OPACITY_MAP[clamped] || BACKDROP_OPACITY_MAP[50];
}

/**
 * Get alignment class
 */
export function getAlignmentClass(
    align: 'left' | 'center' | 'right' | 'space-between' = 'right'
): string {
    return ALIGNMENT_CLASSES[align];
}

/**
 * Combine class names (like classnames library)
 */
export function cx(...classes: (string | undefined | false | null)[]): string {
    return classes.filter((c) => typeof c === 'string' && c.length > 0).join(' ');
}

/**
 * Lock body scroll
 */
export function lockBodyScroll(): void {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('overflow-hidden');
    }
}

/**
 * Unlock body scroll
 */
export function unlockBodyScroll(): void {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.classList.remove('overflow-hidden');
    }
}

/**
 * Get z-index value (prevents conflicts)
 */
export function getZIndex(baseIndex: number, modalIndex: number = 0): number {
    return baseIndex + modalIndex * 10;
}

/**
 * Format button class name
 */
export function getButtonClassName(
    variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary',
    size: 'sm' | 'md' | 'lg' = 'md',
    disabled: boolean = false,
    customClass?: string
): string {
    return cx(
        'rounded-md font-medium transition-colors duration-150',
        getButtonVariantClass(variant),
        getButtonSizeClass(size),
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
        customClass
    );
}
