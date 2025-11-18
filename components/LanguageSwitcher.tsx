import React from 'react';
import { Language } from '../types';

interface LanguageSwitcherProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, setLanguage }) => {
    const languages: { id: Language; label: string }[] = [
        { id: 'en', label: 'EN' },
        { id: 'id', label: 'ID' },
    ];

    return (
        <div className="flex justify-center items-center gap-2 p-1 bg-black/20 rounded-full">
            {languages.map((lang) => (
                <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 w-16
                        ${language === lang.id
                        ? `bg-cyan-500 text-white shadow-lg`
                        : 'bg-transparent text-white/60 hover:bg-white/10'
                        }`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};
