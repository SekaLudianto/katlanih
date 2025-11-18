
import { Theme } from './types';

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;
export const MAX_SCORE = 500;
export const DECAY_RATE = 2; // Score decreases by 2 for every second taken
export const MODERATOR_USERNAMES = ['achmadsyams', 'ahmadsyams.jpg'];

export const THEMES: { [key: string]: Theme } = {
    slate: {
        name: "Slate",
        bg: "bg-slate-900",
        text: "text-slate-200",
        containerBg: "bg-slate-800/50",
        inputBg: "bg-slate-700",
        buttonBg: "bg-cyan-600",
        buttonHoverBg: "hover:bg-cyan-500",
        buttonText: "text-white",
        accent: "text-cyan-400",
        tileBorder: "border-slate-600",
        tileCorrect: "bg-green-500 border-green-500",
        tilePresent: "bg-yellow-500 border-yellow-500",
        tileAbsent: "bg-slate-700 border-slate-700",
    },
    macOS: {
        name: "macOS",
        bg: "bg-gray-800",
        text: "text-gray-300",
        containerBg: "bg-gray-700/50 backdrop-blur-lg",
        inputBg: "bg-gray-900/50",
        buttonBg: "bg-blue-600",
        buttonHoverBg: "hover:bg-blue-500",
        buttonText: "text-white",
        accent: "text-blue-400",
        tileBorder: "border-gray-600",
        tileCorrect: "bg-green-600 border-green-600 text-white",
        tilePresent: "bg-yellow-500 border-yellow-500 text-white",
        tileAbsent: "bg-gray-600 border-gray-600 text-white",
    },
    rose: {
        name: "Rose",
        bg: "bg-rose-900",
        text: "text-rose-100",
        containerBg: "bg-rose-800/40",
        inputBg: "bg-rose-700/50",
        buttonBg: "bg-rose-500",
        buttonHoverBg: "hover:bg-rose-600",
        buttonText: "text-white",
        accent: "text-rose-300",
        tileBorder: "border-rose-600",
        tileCorrect: "bg-emerald-500 border-emerald-500",
        tilePresent: "bg-amber-400 border-amber-400",
        tileAbsent: "bg-rose-800 border-rose-800",
    },
};