import React from 'react';
import { ConnectionState, Theme } from '../types';
import { Icons } from './Icons';
import { translations } from '../localization';

interface StatsDisplayProps {
    connectionState: ConnectionState;
    theme: Theme;
    t: typeof translations.en;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ connectionState, theme, t }) => {
    const statusInfo = {
        connected: { color: 'text-green-400', icon: <Icons.Wifi className="w-5 h-5" /> },
        connecting: { color: 'text-yellow-400', icon: <Icons.Wifi className="w-5 h-5 animate-pulse" /> },
        disconnected: { color: 'text-gray-400', icon: <Icons.WifiOff className="w-5 h-5" /> },
        error: { color: 'text-red-400', icon: <Icons.AlertTriangle className="w-5 h-5" /> }
    };
    
    return (
        <div className={`p-4 rounded-2xl shadow-xl ${theme.containerBg}`}>
            <div className="flex flex-col justify-center items-center text-center gap-2">
                <h3 className="font-semibold text-white/80 text-sm uppercase tracking-wider">{t.status_title}</h3>
                <div className={`flex items-center justify-center gap-3 ${statusInfo[connectionState.status].color}`}>
                    {statusInfo[connectionState.status].icon}
                    <span className="text-sm font-medium">{connectionState.message}</span>
                </div>
            </div>
        </div>
    );
};
