/**
 * Modal Component Constants
 */

import type { ModalSize, ModalAnimation } from './types';

/**
 * Default modal configuration
 */
export const DEFAULT_MODAL_CONFIG = {
    size: 'md' as ModalSize,
    animation: 'fade' as ModalAnimation,
    closeOnEscape: true,
    closeOnBackdropClick: true,
    showHeader: true,
    showFooter: false,
    showBackdrop: true,
    backdropOpacity: 50,
    zIndex: 50,
};

/**
 * Modal size breakpoints (Tailwind-based)
 * Maps size to max-width class
 */
export const MODAL_SIZE_CLASSES: Record<ModalSize, string> = {
    sm: 'max-w-sm',      // 420px
    md: 'max-w-md',      // 448px
    lg: 'max-w-lg',      // 512px
    xl: 'max-w-xl',      // 576px
    full: 'max-w-full',  // 100% (with padding)
};

/**
 * Modal animation classes
 */
export const MODAL_ANIMATION_CLASSES: Record<ModalAnimation, string> = {
    fade: 'animate-fade-in',
    slide: 'animate-slide-up',
    zoom: 'animate-zoom-in',
    none: '',
};

/**
 * Padding classes for modal body/footer
 */
export const PADDING_CLASSES = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

/**
 * Button variant classes
 */
export const BUTTON_VARIANT_CLASSES = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-slate-300',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-slate-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-400',
};

/**
 * Button size classes
 */
export const BUTTON_SIZE_CLASSES = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

/**
 * Backdrop opacity mapping
 */
export const BACKDROP_OPACITY_MAP: Record<number, string> = {
    0: 'bg-black/0',
    10: 'bg-black/10',
    20: 'bg-black/20',
    30: 'bg-black/30',
    40: 'bg-black/40',
    50: 'bg-black/50',
    60: 'bg-black/60',
    70: 'bg-black/70',
    80: 'bg-black/80',
    90: 'bg-black/90',
};

/**
 * Alignment classes for footer
 */
export const ALIGNMENT_CLASSES = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
};

/**
 * Focus outline class
 */
export const FOCUS_OUTLINE_CLASS = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500';

/**
 * Transition classes
 */
export const TRANSITION_CLASSES = 'transition-all duration-300 ease-in-out';

/**
 * Modal scroll lock class
 */
export const SCROLL_LOCKED_CLASS = 'overflow-hidden';
