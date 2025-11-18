import React from 'react';
import { translations } from '../localization';

interface HeaderProps {
    t: typeof translations.en;
}

export const Header: React.FC<HeaderProps> = ({ t }) => {
    return (
        <header className="text-center border-b border-white/10 pb-2 md:pb-4">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                {t.header_title}
            </h1>
            <p className="text-xs md:text-sm text-white/60 mt-1 md:mt-2">
                {t.header_subtitle}
            </p>
        </header>
    );
};
