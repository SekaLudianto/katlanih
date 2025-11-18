import React from 'react';
import { AppTab, Theme } from '../types';
import { Icons } from './Icons';
import { translations } from '../localization';

interface BottomNavBarProps {
    activeTab: AppTab;
    setActiveTab: (tab: AppTab) => void;
    theme: Theme;
    t: typeof translations.en;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab, theme, t }) => {
    const navItems = [
        { id: 'game', icon: <Icons.Game className="w-6 h-6" />, label: t.nav_game },
        { id: 'chat', icon: <Icons.MessageSquare className="w-6 h-6" />, label: t.nav_chat },
        { id: 'gifts', icon: <Icons.Gift className="w-6 h-6" />, label: t.nav_gifts },
        { id: 'leaderboard', icon: <Icons.Trophy className="w-6 h-6" />, label: t.nav_leaderboard },
        { id: 'settings', icon: <Icons.Settings className="w-6 h-6" />, label: t.nav_settings },
    ] as const;

    return (
        <div className={`fixed bottom-0 left-0 right-0 ${theme.containerBg} border-t ${theme.tileBorder} z-10 lg:hidden`}>
            <div className="flex justify-around items-center max-w-xl mx-auto px-2 pt-2 pb-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-colors duration-200 ${
                            activeTab === item.id ? `${theme.accent} bg-black/20` : 'text-gray-400'
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs font-medium mt-1">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
