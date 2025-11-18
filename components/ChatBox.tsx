import React, { useRef, useEffect } from 'react';
import { ChatMessage, Theme } from '../types';
import { translations } from '../localization';

interface ChatBoxProps {
    messages: ChatMessage[];
    theme: Theme;
    className?: string;
    t: typeof translations.en;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, theme, className = '', t }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [messages]);

    return (
        <div className={`p-4 rounded-2xl shadow-lg ${theme.containerBg} flex flex-col ${className}`}>
            <h3 className="text-lg font-bold text-center text-white mb-3 flex-shrink-0">{t.chat_title}</h3>
            <div ref={scrollRef} className="flex-grow overflow-y-auto pr-2 space-y-2 hide-scrollbar">
                {messages.map((msg, index) => (
                    <div key={`${msg.userId}-${index}`} className="bg-black/20 p-2 rounded-lg flex items-start gap-2 animate-fade-in">
                        <img src={msg.profilePictureUrl} alt={msg.nickname} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-white/80">{msg.nickname}</p>
                            <p className="text-sm break-words">{msg.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
