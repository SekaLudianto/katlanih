
import React, { useState } from 'react';
import { Theme, RoomStats, ChatMessage, GiftMessage, AppTab, ConnectionState, LeaderboardEntry, RoundWinner, ToastState, Language } from '../types';
import { RoomStatsDisplay } from '../components/RoomStatsDisplay';
import { WordleGame, WordleGameHandle } from '../components/WordleGame';
import { ChatBox } from '../components/ChatBox';
import { GiftBox } from '../components/GiftBox';
import { Icons } from '../components/Icons';
import { BottomNavBar } from '../components/BottomNavBar';
import { LeaderboardDisplay } from '../components/LeaderboardDisplay';
import { translations } from '../localization';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useWindowSize } from '../hooks/useWindowSize';

interface GamePageProps {
    theme: Theme;
    roomStats: RoomStats;
    chatMessages: ChatMessage[];
    giftMessages: GiftMessage[];
    wordleGameRef: React.RefObject<WordleGameHandle>;
    setModal: (modal: { isOpen: boolean; title: string; content: React.ReactNode }) => void;
    connectionState: ConnectionState;
    onDisconnect: () => void;
    onReconnect: () => void;
    leaderboard: LeaderboardEntry[];
    onScoresCalculated: (winners: RoundWinner[]) => void;
    showToast: (message: string, type?: ToastState['type']) => void;
    t: typeof translations.en;
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const GamePage: React.FC<GamePageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AppTab>('game');
    const { width } = useWindowSize();
    const isDesktop = width >= 1024; // Tailwind's lg breakpoint

    const isConnected = props.connectionState.status === 'connected';
    const isReconnecting = props.connectionState.status === 'connecting';

    const renderMobileContent = () => {
        switch (activeTab) {
            case 'chat':
                return <ChatBox messages={props.chatMessages} theme={props.theme} className="h-full" t={props.t} />;
            case 'gifts':
                return <GiftBox gifts={props.giftMessages} theme={props.theme} className="h-full" t={props.t} />;
            case 'leaderboard':
                return <LeaderboardDisplay leaderboard={props.leaderboard} theme={props.theme} t={props.t} />;
            case 'settings':
                return (
                    <div className="p-4 md:p-6 space-y-4">
                        <div className={`p-4 rounded-2xl ${props.theme.containerBg}`}>
                             <h3 className="font-semibold text-white/80 text-center mb-3">{props.t.settings_language_title}</h3>
                             <LanguageSwitcher language={props.language} setLanguage={props.setLanguage} />
                        </div>
                        <RoomStatsDisplay roomStats={props.roomStats} theme={props.theme} t={props.t} />
                        <button
                            onClick={props.onDisconnect}
                            className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2`}
                        >
                            <Icons.WifiOff className="w-5 h-5" />
                            {props.t.disconnect_button}
                        </button>
                    </div>
                );
            case 'game':
            default:
                return (
                    <WordleGame
                        ref={props.wordleGameRef}
                        theme={props.theme}
                        leaderboard={props.leaderboard}
                        onScoresCalculated={props.onScoresCalculated}
                        showToast={props.showToast}
                        t={props.t}
                    />
                );
        }
    };

    return (
        <div className="relative flex flex-col h-screen">
            <main className="w-full max-w-7xl mx-auto p-4 md:p-6 flex-grow flex flex-col min-h-0">
                {isDesktop ? (
                    <>
                        {/* Header for DESKTOP sizes */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                            <RoomStatsDisplay roomStats={props.roomStats} theme={props.theme} t={props.t} />
                            <button
                                onClick={props.onDisconnect}
                                className={`w-full h-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2`}
                            >
                                <Icons.WifiOff className="w-5 h-5" />
                                {props.t.disconnect_button}
                            </button>
                        </div>

                        {/* Desktop Layout */}
                        <div className="flex-grow grid grid-cols-3 gap-6 min-h-0">
                            <div className="col-span-2 flex flex-col min-h-0">
                                <WordleGame
                                    ref={props.wordleGameRef}
                                    theme={props.theme}
                                    leaderboard={props.leaderboard}
                                    onScoresCalculated={props.onScoresCalculated}
                                    showToast={props.showToast}
                                    t={props.t}
                                />
                            </div>
                            <div className="col-span-1 grid grid-rows-2 gap-6 min-h-0">
                                <ChatBox messages={props.chatMessages} theme={props.theme} className="min-h-0" t={props.t} />
                                <GiftBox gifts={props.giftMessages} theme={props.theme} className="min-h-0" t={props.t} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Mobile/Tablet Layout */}
                        <div className="flex-grow min-h-0 pb-20">
                            {renderMobileContent()}
                        </div>
                        {/* Mobile Navigation */}
                        <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} theme={props.theme} t={props.t} />
                    </>
                )}
            </main>
            
            {/* Reconnect Overlay */}
            {!isConnected && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-4 animate-fade-in">
                    <div className={`text-center space-y-4 p-8 rounded-2xl shadow-xl ${props.theme.containerBg} border ${props.theme.tileBorder}`}>
                        <h2 className="text-2xl font-bold text-white">{props.t.reconnect_title}</h2>
                        <div className="flex items-center justify-center gap-2 text-red-400">
                             <Icons.AlertTriangle className="w-5 h-5"/>
                             <span>{props.connectionState.message}</span>
                        </div>
                        <button
                            onClick={props.onReconnect}
                            disabled={isReconnecting}
                            className={`w-full sm:w-auto ${props.theme.buttonBg} ${props.theme.buttonHoverBg} ${props.theme.buttonText} font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2`}
                        >
                            {isReconnecting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {props.t.reconnect_button_connecting}
                                </>
                            ) : (
                                props.t.reconnect_button
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
