import React from 'react';
import { Theme } from '../types';
import { translations } from '../localization';
import { MAX_WINNERS, MIN_WINNERS } from '../constants';

interface WinnerCountSettingProps {
    winnerCount: number;
    setWinnerCount: (count: number) => void;
    theme: Theme;
    t: typeof translations.en;
}

export const WinnerCountSetting: React.FC<WinnerCountSettingProps> = ({ winnerCount, setWinnerCount, theme, t }) => {

    const handleDecrement = () => {
        setWinnerCount(Math.max(MIN_WINNERS, winnerCount - 1));
    };

    const handleIncrement = () => {
        setWinnerCount(Math.min(MAX_WINNERS, winnerCount + 1));
    };

    return (
        <div className={`p-4 rounded-2xl ${theme.containerBg}`}>
            <h3 className="font-semibold text-white/80 text-center mb-1">{t.settings_winner_count_title}</h3>
            <p className="text-xs text-center text-white/50 mb-3">{t.settings_winner_count_description}</p>
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={handleDecrement}
                    disabled={winnerCount <= MIN_WINNERS}
                    className={`w-12 h-12 flex items-center justify-center text-3xl font-bold rounded-full transition-colors ${theme.buttonBg} ${theme.buttonHoverBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    -
                </button>
                <span className={`text-4xl font-bold w-16 text-center ${theme.accent}`}>
                    {winnerCount}
                </span>
                <button
                    onClick={handleIncrement}
                    disabled={winnerCount >= MAX_WINNERS}
                    className={`w-12 h-12 flex items-center justify-center text-3xl font-bold rounded-full transition-colors ${theme.buttonBg} ${theme.buttonHoverBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    +
                </button>
            </div>
        </div>
    );
};
