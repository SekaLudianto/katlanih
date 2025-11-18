export interface TikTokUser {
    userId: string;
    uniqueId: string;
    nickname: string;
    profilePictureUrl: string;
}

export interface ChatMessage extends TikTokUser {
    comment: string;
}

export interface GiftMessage extends TikTokUser {
    giftId: number;
    giftName: string;
    giftPictureUrl: string;
    diamondCount: number;
    repeatCount: number;
    repeatEnd: boolean;
    describe: string;
}

export interface RoomStats {
    viewerCount: number;
    likeCount: number;
    diamondsCount: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface ConnectionState {
    status: ConnectionStatus;
    message: string;
}

export interface Theme {
    name: string;
    bg: string;
    text: string;
    containerBg: string;
    inputBg: string;
    buttonBg: string;
    buttonHoverBg: string;
    buttonText: string;
    accent: string;
    tileBorder: string;
    tileCorrect: string;
    tilePresent: string;
    tileAbsent: string;
}

export enum TileStatus {
    Empty = 'empty',
    Correct = 'correct',
    Present = 'present',
    Absent = 'absent',
    Pending = 'pending',
}

export interface Tile {
    letter: string;
    status: TileStatus;
}

export type AppTab = 'game' | 'chat' | 'gifts' | 'leaderboard' | 'settings';

export interface RoundWinner {
    user: TikTokUser;
    duration: number; // in seconds
    score: number;
}

export interface LeaderboardEntry {
    user: TikTokUser;
    score: number;
}

export type GameState = 'idle' | 'running' | 'solved' | 'leaderboard' | 'waiting' | 'round_over';

export interface ToastState {
    isOpen: boolean;
    message: string;
    type: 'error' | 'success' | 'info';
}

export type Language = 'en' | 'id';

// FIX: Exported WordleGameHandle interface so it can be used in other modules.
export interface WordleGameHandle {
    handleGuess: (guess: string, userData: ChatMessage) => void;
    startRound: () => void; // Changed from startNextWord to startRound
    forceEndRound: () => void;
}