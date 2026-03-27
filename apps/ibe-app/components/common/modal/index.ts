/**
 * Modal Module - Public API
 * Reusable modal system for the entire application
 */

export type {
    ModalSize,
    ModalAnimation,
    ModalCloseTrigger,
    ModalHeaderConfig,
    ModalBodyConfig,
    ModalFooterConfig,
    ModalAction,
    ModalProps,
    ModalHeaderProps,
    ModalBodyProps,
    ModalFooterProps,
    ModalContextType,
    UseModalReturn,
} from './types';

export {
    DEFAULT_MODAL_CONFIG,
    MODAL_SIZE_CLASSES,
    MODAL_ANIMATION_CLASSES,
    PADDING_CLASSES,
    BUTTON_VARIANT_CLASSES,
    BUTTON_SIZE_CLASSES,
    BACKDROP_OPACITY_MAP,
    ALIGNMENT_CLASSES,
    FOCUS_OUTLINE_CLASS,
    TRANSITION_CLASSES,
    SCROLL_LOCKED_CLASS,
} from './constants';

export {
    getModalSizeClass,
    getModalAnimationClass,
    getPaddingClass,
    getButtonVariantClass,
    getButtonSizeClass,
    getBackdropOpacityClass,
    getAlignmentClass,
    cx,
    lockBodyScroll,
    unlockBodyScroll,
    getZIndex,
    getButtonClassName,
} from './utils';

export { Modal } from './Modal';
export { ModalHeader } from './ModalHeader';
export { ModalBody } from './ModalBody';
export { ModalFooter } from './ModalFooter';
export { useModal } from './useModal';
