import React from 'react';
import { LeaderboardEntry, Theme } from '../types';
import { Icons } from './Icons';
import { translations } from '../localization';

interface LeaderboardDisplayProps {
    leaderboard: LeaderboardEntry[];
    theme: Theme;
    t: typeof translations.en;
}

export const LeaderboardDisplay: React.FC<LeaderboardDisplayProps> = ({ leaderboard, theme, t }) => {
    return (
        <div className={`p-4 rounded-2xl shadow-lg ${theme.containerBg} flex flex-col h-full`}>
            <h3 className="text-lg font-bold text-center text-white mb-3 flex-shrink-0 flex items-center justify-center gap-2">
                <Icons.Trophy className="w-5 h-5 text-yellow-400" />
                {t.leaderboard_title}
            </h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-1.5 hide-scrollbar">
                {leaderboard.length > 0 ? (
                    leaderboard.map((entry, index) => (
                        <div key={entry.user.userId} className={`flex items-center gap-3 p-2 rounded-lg ${theme.inputBg} animate-fade-in`}>
                            <span className="font-bold text-lg w-7 text-center text-white/70">{index + 1}</span>
                            <img src={entry.user.profilePictureUrl} alt={entry.user.nickname} className="w-9 h-9 rounded-full" />
                            <span className="flex-grow font-semibold truncate">{entry.user.nickname}</span>
                            <span className="font-bold text-yellow-400">{entry.score.toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-center text-white/50 italic">{t.leaderboard_no_scores}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
