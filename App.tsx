
import React, { useState, useEffect, useRef, useCallback } from 'react';
import tiktokSocket from './tiktokSocket';
import { Theme, ConnectionState, RoomStats, ChatMessage, GiftMessage, LeaderboardEntry, RoundWinner, ToastState, Language } from './types';
import { THEMES, MODERATOR_USERNAMES } from './constants';
import { ConnectionPage } from './pages/ConnectionPage';
import { GamePage } from './pages/GamePage';
import { WordleGameHandle } from './components/WordleGame';
import { Modal } from './components/Modal';
import { Toast } from './components/Toast';
import { GiftAlert } from './components/GiftAlert';
import { translations } from './localization';

const App: React.FC = () => {
    const [theme, setTheme] = useState<Theme>(THEMES.slate);
    const [language, setLanguage] = useState<Language>('en');
    const [connectionState, setConnectionState] = useState<ConnectionState>({ status: 'disconnected', message: 'Enter a TikTok @username to connect.' });
    const [roomStats, setRoomStats] = useState<RoomStats>({ viewerCount: 0, likeCount: 0, diamondsCount: 0 });
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [giftMessages, setGiftMessages] = useState<GiftMessage[]>([]);
    const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode }>({ isOpen: false, title: '', content: null });
    const [toast, setToast] = useState<ToastState>({ isOpen: false, message: '', type: 'error' });

    const [hasConnectedOnce, setHasConnectedOnce] = useState(false);
    const [lastUniqueId, setLastUniqueId] = useState('');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isSimulationMode, setIsSimulationMode] = useState(false);

    // Gift Alert State
    const [giftAlertQueue, setGiftAlertQueue] = useState<GiftMessage[]>([]);
    const [currentGiftAlert, setCurrentGiftAlert] = useState<GiftMessage | null>(null);
    const [isGiftAlertVisible, setIsGiftAlertVisible] = useState(false);

    const wordleGameRef = useRef<WordleGameHandle>(null);
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setTimeout> for browser compatibility.
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const t = translations[language];

    useEffect(() => {
        // Update initial message on language change
        setConnectionState(prev => ({ ...prev, message: t.connect_init }));
    }, [t]);

    const showToast = useCallback((message: string, type: ToastState['type'] = 'error', duration = 3000) => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ isOpen: true, message, type });
        toastTimerRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, isOpen: false }));
        }, duration);
    }, []);
    
    const handleChat = (msg: ChatMessage) => {
        setChatMessages(prev => [msg, ...prev.slice(0, 99)]);
        const comment = msg.comment.trim().toLowerCase();

        if (comment === '!next') {
            wordleGameRef.current?.startNextWord();
            return;
        }

        if (comment === '!skip') {
            if (MODERATOR_USERNAMES.includes(msg.uniqueId)) {
                wordleGameRef.current?.forceEndRound();
            }
            return;
        }

        if (comment === '!rank') {
            const userRankIndex = leaderboard.findIndex(entry => entry.user.userId === msg.userId);
            if (userRankIndex !== -1) {
                const userEntry = leaderboard[userRankIndex];
                showToast(t.rank_toast(userEntry.user.nickname, userRankIndex + 1, userEntry.score), 'info');
            } else {
                showToast(t.rank_toast_not_found(msg.nickname), 'info');
            }
            return;
        }

        const firstWord = comment.split(' ')[0].toUpperCase();
        wordleGameRef.current?.handleGuess(firstWord, msg);
    };

    const handleGift = useCallback((msg: any) => {
        const giftPictureUrl = msg.giftPictureUrl || msg.gift?.gift_image?.url_list?.[0] || msg.gift?.giftImage?.urlList?.[0];

        const normalizedMsg: GiftMessage = {
            userId: msg.userId,
            uniqueId: msg.uniqueId,
            nickname: msg.nickname,
            profilePictureUrl: msg.profilePictureUrl,
            giftId: msg.giftId,
            giftName: msg.giftName,
            diamondCount: msg.diamondCount,
            repeatCount: msg.repeatCount,
            repeatEnd: msg.repeatEnd,
            describe: msg.describe,
            giftPictureUrl: giftPictureUrl || '',
        };

        if (!normalizedMsg.repeatEnd && normalizedMsg.diamondCount > 0) {
             setRoomStats(prev => ({ ...prev, diamondsCount: prev.diamondsCount + (normalizedMsg.diamondCount * normalizedMsg.repeatCount) }));
        }
        setGiftMessages(prev => [normalizedMsg, ...prev.slice(0, 49)]);

        if (normalizedMsg.diamondCount > 0) {
            setGiftAlertQueue(prev => [...prev, normalizedMsg]);
        }
    }, []);

    const handleLike = useCallback((msg: { totalLikeCount: number }) => {
        if (typeof msg.totalLikeCount === 'number') {
            setRoomStats(prev => ({ ...prev, likeCount: msg.totalLikeCount }));
        }
    }, []);

    const handleConnect = useCallback((uniqueId: string) => {
        if (!uniqueId) {
            showToast(t.error_empty_username);
            return;
        }

        const effectiveUniqueId = isSimulationMode ? `sim_${uniqueId}` : uniqueId;

        setLastUniqueId(effectiveUniqueId);
        setChatMessages([]);
        setGiftMessages([]);
        setRoomStats({ viewerCount: 0, likeCount: 0, diamondsCount: 0 });
        setLeaderboard([]);
        
        setConnectionState({ status: 'connecting', message: t.connect_connecting(uniqueId) });
        tiktokSocket.connect(effectiveUniqueId);
    }, [showToast, isSimulationMode, t]);

    const handleReconnect = useCallback(() => {
        if (lastUniqueId) {
            setConnectionState({ status: 'connecting', message: t.connect_reconnecting(lastUniqueId.replace('sim_','')) });
            tiktokSocket.connect(lastUniqueId);
        }
    }, [lastUniqueId, t]);
    
    const handleDisconnect = useCallback(() => {
        tiktokSocket.disconnect();
        setConnectionState({ status: 'disconnected', message: t.connect_disconnected_by_user });
        setHasConnectedOnce(false);
        setLastUniqueId('');
    }, [t]);

    const handleScoresCalculated = useCallback((winners: RoundWinner[]) => {
        setLeaderboard(prevLeaderboard => {
            const newLeaderboard = [...prevLeaderboard];
            winners.forEach(winner => {
                const existingEntryIndex = newLeaderboard.findIndex(entry => entry.user.userId === winner.user.userId);
                if (existingEntryIndex > -1) {
                    newLeaderboard[existingEntryIndex].score += winner.score;
                } else {
                    newLeaderboard.push({ user: winner.user, score: winner.score });
                }
            });
            return newLeaderboard.sort((a, b) => b.score - a.score);
        });
    }, []);
    
    useEffect(() => {
        if (!isGiftAlertVisible && giftAlertQueue.length > 0) {
            const [nextGift, ...rest] = giftAlertQueue;
            setCurrentGiftAlert(nextGift);
            setGiftAlertQueue(rest);
            setIsGiftAlertVisible(true);
        }
    }, [giftAlertQueue, isGiftAlertVisible]);

    useEffect(() => {
        if (isGiftAlertVisible) {
            const timer = setTimeout(() => {
                setIsGiftAlertVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isGiftAlertVisible]);

    useEffect(() => {
        const handleTiktokConnected = (state: { roomId: string }) => {
            const message = isSimulationMode ? t.connect_connected_sim : t.connect_connected_real(state.roomId);
            setConnectionState({ status: 'connected', message });
            setHasConnectedOnce(true);
        };
        const handleTiktokDisconnected = (reason: string) => {
            setConnectionState({ status: 'error', message: t.connect_disconnected_error(reason) });
        };
        const handleStreamEnd = () => {
            setConnectionState({ status: 'disconnected', message: t.connect_stream_ended });
        };
        const handleRoomUser = (msg: { viewerCount: number }) => {
            setRoomStats(prev => ({ ...prev, viewerCount: msg.viewerCount }));
        };
        
        tiktokSocket.on('tiktokConnected', handleTiktokConnected);
        tiktokSocket.on('tiktokDisconnected', handleTiktokDisconnected);
        tiktokSocket.on('streamEnd', handleStreamEnd);
        tiktokSocket.on('roomUser', handleRoomUser);
        tiktokSocket.on('like', handleLike);
        tiktokSocket.on('chat', handleChat);
        tiktokSocket.on('gift', handleGift);

        return () => {
            tiktokSocket.off('tiktokConnected', handleTiktokConnected);
            tiktokSocket.off('tiktokDisconnected', handleTiktokDisconnected);
            tiktokSocket.off('streamEnd', handleStreamEnd);
            tiktokSocket.off('roomUser', handleRoomUser);
            tiktokSocket.off('like', handleLike);
            tiktokSocket.off('chat', handleChat);
            tiktokSocket.off('gift', handleGift);
        };
    }, [isSimulationMode, handleChat, handleGift, handleLike, leaderboard, showToast, t]);

    useEffect(() => {
        if (hasConnectedOnce) {
            const intervalId = setInterval(() => {
                showToast(t.info_toast_filter, 'info', 5000);
            }, 45000);

            return () => clearInterval(intervalId);
        }
    }, [hasConnectedOnce, showToast, t]);
    
    useEffect(() => {
        return () => {
            tiktokSocket.disconnect();
        }
    }, []);

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} flex flex-col`}>
            {hasConnectedOnce ? (
                <GamePage
                    theme={theme}
                    roomStats={roomStats}
                    chatMessages={chatMessages}
                    giftMessages={giftMessages}
                    wordleGameRef={wordleGameRef}
                    setModal={setModal}
                    connectionState={connectionState}
                    onDisconnect={handleDisconnect}
                    onReconnect={handleReconnect}
                    leaderboard={leaderboard}
                    onScoresCalculated={handleScoresCalculated}
                    showToast={showToast}
                    t={t}
                    language={language}
                    setLanguage={setLanguage}
                />
            ) : (
                <ConnectionPage
                    theme={theme}
                    setTheme={setTheme}
                    connectionState={connectionState}
                    onConnect={handleConnect}
                    isSimulationMode={isSimulationMode}
                    setIsSimulationMode={setIsSimulationMode}
                    t={t}
                    language={language}
                    setLanguage={setLanguage}
                />
            )}
            <Modal {...modal} onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} theme={theme} />
            <Toast {...toast} theme={theme} />
            <GiftAlert gift={currentGiftAlert} isVisible={isGiftAlertVisible} theme={theme} t={t} />
        </div>
    );
};

export default App;
