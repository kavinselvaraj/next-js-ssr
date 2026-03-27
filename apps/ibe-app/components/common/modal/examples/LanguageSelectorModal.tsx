'use client';

/**
 * EXAMPLE: Language Selection Modal
 * Shows how to use the reusable Modal component for language selection
 */

import React from 'react';
import { Modal, useModal } from '../../modal';
import type { ModalAction } from '../../modal/types';

interface Language {
    code: string;
    name: string;
    flag?: string;
}

interface LanguageSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentLanguage?: string;
    onLanguageSelect: (languageCode: string) => void;
}

const AVAILABLE_LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
];

/**
 * Language selection modal
 * Demonstrates: radio button selection, actions, modal integration
 */
export function LanguageSelectorModal({
    isOpen,
    onClose,
    currentLanguage = 'en',
    onLanguageSelect,
}: LanguageSelectorModalProps) {
    const [selectedLang, setSelectedLang] = React.useState(currentLanguage);

    const handleConfirm = () => {
        onLanguageSelect(selectedLang);
        onClose();
    };

    const actions: ModalAction[] = [
        {
            id: 'cancel',
            label: 'Cancel',
            variant: 'secondary',
            onClick: onClose,
        },
        {
            id: 'confirm',
            label: 'Apply',
            variant: 'primary',
            onClick: handleConfirm,
        },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Select Language"
            size="sm"
            showHeader
            showFooter
            actions={actions}
            bodyConfig={{ padding: 'lg' }}
            footerConfig={{ align: 'right', showDivider: true }}
        >
            <div className="space-y-3">
                {AVAILABLE_LANGUAGES.map((lang) => (
                    <label
                        key={lang.code}
                        className="flex items-center p-3 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                        <input
                            type="radio"
                            name="language"
                            value={lang.code}
                            checked={selectedLang === lang.code}
                            onChange={(e) => setSelectedLang(e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                        />
                        <span className="ml-3 text-lg">{lang.flag}</span>
                        <span className="ml-2 font-medium text-slate-900">
                            {lang.name}
                        </span>
                    </label>
                ))}
            </div>
        </Modal>
    );
}

/**
 * Demo component showing language selector in action
 */
export function LanguageSelectorDemo() {
    const languageModal = useModal();
    const [language, setLanguage] = React.useState('en');

    const currentLanguageName = AVAILABLE_LANGUAGES.find(
        (l) => l.code === language
    )?.name || 'English';

    return (
        <div className="p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">Language Selection Demo</h2>

            <button
                onClick={languageModal.open}
                className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
                Current Language: {currentLanguageName}
            </button>

            <LanguageSelectorModal
                isOpen={languageModal.isOpen}
                onClose={languageModal.close}
                currentLanguage={language}
                onLanguageSelect={setLanguage}
            />
        </div>
    );
}
