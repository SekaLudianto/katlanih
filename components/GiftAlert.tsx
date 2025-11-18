import React from 'react';
import { GiftMessage, Theme } from '../types';
import { Icons } from './Icons';
import { translations } from '../localization';

interface GiftAlertProps {
    gift: GiftMessage | null;
    isVisible: boolean;
    theme: Theme;
    t: typeof translations.en;
}

export const GiftAlert: React.FC<GiftAlertProps> = ({ gift, isVisible, theme, t }) => {
    if (!gift) return null;

    const totalDiamonds = gift.diamondCount * gift.repeatCount;

    return (
        <div className={`fixed top-1/2 -translate-y-1/2 right-4 z-40 transition-all duration-500 ease-in-out
            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        >
            <div className={`w-auto max-w-sm p-3 rounded-2xl shadow-2xl border ${theme.containerBg} ${theme.tileBorder} flex items-center gap-3`}>
                <img src={gift.profilePictureUrl} alt={gift.nickname} className="w-10 h-10 rounded-full border-2 border-cyan-400 flex-shrink-0" />
                
                <div className="flex-grow overflow-hidden">
                    <p className="font-bold text-white truncate text-sm">{gift.nickname}</p>
                    <p className="text-xs text-white/70 truncate">{t.gift_alert_sent(gift.giftName)}</p>
                </div>
                
                <div className="relative flex-shrink-0">
                    <img src={gift.giftPictureUrl} alt={gift.giftName} className="w-14 h-14" />
                    {totalDiamonds > 0 && (
                        <div className="absolute -bottom-1 -right-1 flex items-center justify-center gap-1 text-yellow-400 font-bold bg-black/50 py-0.5 px-1.5 rounded-full text-xs">
                           <Icons.Diamond className="w-3 h-3"/>
                           <span>{totalDiamonds.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
