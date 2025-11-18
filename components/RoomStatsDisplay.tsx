import React from 'react';
import { RoomStats, Theme } from '../types';
import { Icons } from './Icons';
import { translations } from '../localization';

interface RoomStatsDisplayProps {
    roomStats: RoomStats;
    theme: Theme;
    t: typeof translations.en;
}

export const RoomStatsDisplay: React.FC<RoomStatsDisplayProps> = ({ roomStats, theme, t }) => {
    return (
        <div className={`p-3 rounded-2xl shadow-lg ${theme.containerBg} flex flex-col justify-center items-center`}>
             <h3 className="font-semibold text-white/80 text-xs uppercase tracking-wider mb-2">{t.room_stats_title}</h3>
            <div className="flex justify-around items-center w-full gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 text-white/80">
                    <Icons.Users className="w-4 h-4"/>
                    <span className="font-bold text-sm sm:text-base text-white">{roomStats.viewerCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400">
                    <Icons.Heart className="w-4 h-4"/>
                    <span className="font-bold text-sm sm:text-base text-white">{roomStats.likeCount.toLocaleString()}</span>
                </div>
                 <div className="flex items-center gap-1.5 text-yellow-400">
                    <Icons.Diamond className="w-4 h-4"/>
                    <span className="font-bold text-sm sm:text-base text-white">{roomStats.diamondsCount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};
