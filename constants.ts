
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
    sky: {
        name: "Sky",
        bg: "bg-sky-100",
        text: "text-sky-800",
        containerBg: "bg-white/70",
        inputBg: "bg-sky-50",
        buttonBg: "bg-sky-500",
        buttonHoverBg: "hover:bg-sky-600",
        buttonText: "text-white",
        accent: "text-sky-600",
        tileBorder: "border-sky-300",
        tileCorrect: "bg-teal-500 border-teal-500 text-white",
        tilePresent: "bg-amber-500 border-amber-500 text-white",
        tileAbsent: "bg-sky-200 border-sky-200",
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