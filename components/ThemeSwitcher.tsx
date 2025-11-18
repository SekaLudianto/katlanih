
import React from 'react';
import { THEMES } from '../constants';
import { Theme } from '../types';

interface ThemeSwitcherProps {
    currentTheme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
    return (
        <div className="flex justify-center items-center gap-2 p-2 bg-black/20 rounded-full">
            {Object.values(THEMES).map((theme) => (
                <button
                    key={theme.name}
                    onClick={() => setTheme(theme)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                        currentTheme.name === theme.name 
                        ? `${theme.buttonBg} ${theme.buttonText} shadow-lg` 
                        : 'bg-transparent text-white/60 hover:bg-white/10'
                    }`}
                >
                    {theme.name}
                </button>
            ))}
        </div>
    );
};
