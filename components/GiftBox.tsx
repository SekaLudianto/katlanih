import React, { useRef, useEffect } from 'react';
import { GiftMessage, Theme } from '../types';
import { Icons } from './Icons';
import { translations } from '../localization';

interface GiftBoxProps {
    gifts: GiftMessage[];
    theme: Theme;
    className?: string;
    t: typeof translations.en;
}

export const GiftBox: React.FC<GiftBoxProps> = ({ gifts, theme, className = '', t }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [gifts]);

    return (
        <div className={`p-4 rounded-2xl shadow-lg ${theme.containerBg} flex flex-col ${className}`}>
            <h3 className="text-lg font-bold text-center text-white mb-3 flex-shrink-0">{t.gifts_title}</h3>
            <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 space-y-2 hide-scrollbar">
                 {gifts.map((gift, index) => (
                    <div key={`${gift.userId}-${gift.giftId}-${index}`} className="bg-black/20 p-2 rounded-lg flex items-center gap-3 animate-fade-in">
                        <img src={gift.giftPictureUrl} alt={gift.giftName} className="w-12 h-12" />
                        <div className="flex-1">
                             <p className="text-sm font-semibold text-white/80">{gift.nickname}</p>
                             <p className="text-sm" dangerouslySetInnerHTML={{ __html: t.gift_sent_message(gift.giftName, gift.repeatCount) }} />
                        </div>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold">
                           <Icons.Diamond className="w-4 h-4"/>
                           <span>{(gift.diamondCount * gift.repeatCount).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
