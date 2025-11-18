
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { Theme, Tile, TileStatus, ChatMessage, GameState, RoundWinner, LeaderboardEntry, ToastState, WordleGameHandle } from '../types';
import { WORD_LENGTH, MAX_SCORE, DECAY_RATE } from '../constants';
import { Icons } from './Icons';
import { translations } from '../localization';

interface WordleGameProps {
    theme: Theme;
    leaderboard: LeaderboardEntry[];
    onScoresCalculated: (winners: RoundWinner[]) => void;
    showToast: (message: string, type?: ToastState['type']) => void;
    t: typeof translations.en;
}

interface BestGuess {
    guess: string;
    tiles: Tile[];
    score: number;
}

const ROUND_DURATION = 300; // 5 minutes in seconds
const RESTART_DURATION = 10; // 10 seconds

export const WordleGame = forwardRef<WordleGameHandle, WordleGameProps>(({ theme, leaderboard, onScoresCalculated, showToast, t }, ref) => {
    const [targetWord, setTargetWord] = useState('');
    const [guesses, setGuesses] = useState<Tile[][]>([]);
    const [guessers, setGuessers] = useState<ChatMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [wordList, setWordList] = useState<string[]>([]);
    
    const [gameState, setGameState] = useState<GameState>('idle');
    const [startTime, setStartTime] = useState<number>(0);
    const [roundWinners, setRoundWinners] = useState<RoundWinner[]>([]);

    const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
    const [autoRestartTimeLeft, setAutoRestartTimeLeft] = useState(RESTART_DURATION);
    const [bestGuess, setBestGuess] = useState<BestGuess | null>(null);
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setInterval> for browser compatibility.
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setInterval> for browser compatibility.
    const autoRestartTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/wordlist.json')
            .then(res => res.json())
            .then(data => setWordList(data.map((word: string) => word.toUpperCase())))
            .catch(err => console.error("Failed to load word list:", err));
    }, []);
    
     useEffect(() => {
        if (boardRef.current) {
            boardRef.current.scrollTop = 0;
        }
    }, [guesses]);

    const startNextWordInternal = useCallback(() => { // Renamed to internal helper
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
        setTargetWord(randomWord);
        setGuesses([]);
        setGuessers([]);
        setBestGuess(null);
        setRoundWinners([]);
        setStartTime(Date.now());
        setGameState('running');
        console.log(`New Word: ${randomWord}`);
    }, [wordList]);

    const startRound = useCallback(() => {
        if (wordList.length === 0) {
             console.warn("Word list not available. Cannot start the game.");
            return;
        }
        
        if (timerRef.current) clearInterval(timerRef.current);
        if (autoRestartTimerRef.current) clearInterval(autoRestartTimerRef.current);
        
        setBestGuess(null);
        setTimeLeft(ROUND_DURATION);
        
        startNextWordInternal(); // Call the internal helper
        
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setGameState('round_over');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [wordList, startNextWordInternal]);

    useEffect(() => {
        if (gameState === 'idle' && wordList.length > 0) {
            startRound();
        }
    }, [gameState, wordList, startRound]);

    useEffect(() => {
        if (gameState === 'round_over') {
            // FIX: If there were any winners in the round, calculate their scores before starting the next.
            if (roundWinners.length > 0) {
                onScoresCalculated(roundWinners);
            }

            setAutoRestartTimeLeft(RESTART_DURATION);
            autoRestartTimerRef.current = setInterval(() => {
                setAutoRestartTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(autoRestartTimerRef.current!);
                        startRound();
                        return RESTART_DURATION;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (autoRestartTimerRef.current) clearInterval(autoRestartTimerRef.current);
        };
    }, [gameState, startRound, onScoresCalculated, roundWinners]);


    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (autoRestartTimerRef.current) clearInterval(autoRestartTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (gameState === 'solved') {
            const timer = setTimeout(() => setGameState('leaderboard'), 5000);
            return () => clearTimeout(timer);
        }
        if (gameState === 'leaderboard') {
            const timer = setTimeout(() => setGameState('waiting'), 10000);
            return () => clearTimeout(timer);
        }
    }, [gameState]);


    const calculateGuessScore = (tiles: Tile[]): number => {
        return tiles.reduce((score, tile) => {
            if (tile.status === TileStatus.Correct) return score + 2;
            if (tile.status === TileStatus.Present) return score + 1;
            return score;
        }, 0);
    };

    useImperativeHandle(ref, () => ({
        handleGuess: (guess: string, userData: ChatMessage) => {
            if (wordList.length === 0) {
                return;
            }

            if (gameState !== 'running' || isProcessing || guess.length !== WORD_LENGTH || !/^[A-Z]+$/.test(guess)) {
                return;
            }
            
            if (!wordList.includes(guess)) {
                showToast(t.error_not_in_dictionary(guess));
                return;
            }

            const isWin = guess === targetWord;
            if (isWin) {
                const alreadyWon = roundWinners.some(w => w.user.userId === userData.userId);
                
                if (alreadyWon) {
                    showToast(t.info_already_solved, 'info');
                    return;
                }

                const correctGuessRow: Tile[] = guess.split('').map(letter => ({ letter, status: TileStatus.Correct }));
                setGuesses(prev => [correctGuessRow, ...prev]);
                setGuessers(prev => [userData, ...prev]);

                const timeUsed = (Date.now() - startTime) / 1000;
                const score = Math.floor(Math.max(0, MAX_SCORE - (timeUsed * DECAY_RATE)));
                const newWinner: RoundWinner = { user: userData, duration: timeUsed, score };
                
                const updatedWinners = [...roundWinners, newWinner].sort((a,b) => a.duration - b.duration);
                setRoundWinners(updatedWinners);

                if (updatedWinners.length >= 3) {
                    onScoresCalculated(updatedWinners);
                    setGameState('solved');
                }
                return;
            }

            setIsProcessing(true);

            const newGuessRow: Tile[] = [];
            const targetWordArr = targetWord.split('');

            for (let i = 0; i < WORD_LENGTH; i++) {
                if (guess[i] === targetWord[i]) {
                    newGuessRow.push({ letter: guess[i], status: TileStatus.Correct });
                    targetWordArr[i] = '_';
                } else {
                    newGuessRow.push({ letter: guess[i], status: TileStatus.Pending });
                }
            }

            for (let i = 0; i < WORD_LENGTH; i++) {
                if (newGuessRow[i].status === TileStatus.Pending) {
                    const letterIndex = targetWordArr.indexOf(guess[i]);
                    if (letterIndex !== -1) {
                        newGuessRow[i].status = TileStatus.Present;
                        targetWordArr[letterIndex] = '_';
                    } else {
                        newGuessRow[i].status = TileStatus.Absent;
                    }
                }
            }
            
            setGuesses(prev => [newGuessRow, ...prev]);
            setGuessers(prev => [userData, ...prev]);
            
            const newScore = calculateGuessScore(newGuessRow);
            if (!bestGuess || newScore > bestGuess.score) {
                setBestGuess({ guess, tiles: newGuessRow, score: newScore });
            }
            
            setIsProcessing(false);
        },
        startRound, // Exposing startRound now
        forceEndRound: () => {
            if (gameState === 'running') {
                onScoresCalculated(roundWinners);
                setGameState('solved');
            }
        },
    }));

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const isOverlayVisible = gameState === 'solved' || gameState === 'leaderboard' || gameState === 'waiting' || gameState === 'round_over';

    return (
        <div className={`relative p-3 md:p-6 rounded-2xl shadow-xl ${theme.containerBg} flex flex-col h-full`}>
            <div className={`flex flex-col h-full min-h-0 transition-all duration-300 ${isOverlayVisible ? 'blur-sm pointer-events-none' : ''}`}>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 md:mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 sm:mb-0">{t.game_title}</h2>
                     <p className="font-semibold text-white/60">{t.game_subtitle}</p>
                </div>
                
                <div className={`flex flex-col sm:flex-row items-center gap-4 text-center p-3 rounded-lg mb-4 ${theme.inputBg}`}>
                    <div className="w-full sm:flex-grow">
                        <div className="flex justify-between items-center mb-1 px-1">
                            <p className="text-xs uppercase tracking-wider text-white/60">{t.game_time_left}</p>
                            <p className={`font-mono font-bold text-base ${timeLeft <= 30 ? 'text-red-400 animate-pulse' : theme.accent}`}>
                                {formatTime(timeLeft)}
                            </p>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden border border-white/10">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${timeLeft <= 30 ? 'bg-red-600' : theme.buttonBg.replace('hover:','')}`}
                                style={{ width: `${(timeLeft / ROUND_DURATION) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4 sm:min-w-[160px]">
                        <p className="text-xs uppercase tracking-wider text-white/60 mb-1 text-center">{t.game_best_guess}</p>
                        {bestGuess ? (
                            <div className={`grid max-w-[140px] mx-auto gap-0.5`} style={{ gridTemplateColumns: `repeat(${WORD_LENGTH}, minmax(0, 1fr))` }}>
                                {bestGuess.tiles.map((tile, tileIndex) => (
                                    <div key={tileIndex} className={`aspect-square rounded-sm flex items-center justify-center text-sm font-bold
                                        ${tile.status === TileStatus.Correct ? theme.tileCorrect : ''}
                                        ${tile.status === TileStatus.Present ? theme.tilePresent : ''}
                                        ${tile.status === TileStatus.Absent ? theme.tileAbsent : ''}
                                        text-white
                                    `}>
                                        {tile.letter}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full min-h-[32px]">
                                <p className="text-xs text-white/50 italic">{t.game_no_guesses_yet}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div ref={boardRef} id="game-board" className="w-full max-w-xl mx-auto space-y-2 overflow-y-auto pr-2 flex-grow hide-scrollbar">
                    {gameState === 'idle' && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-lg text-white/70">{t.game_starting}</p>
                        </div>
                    )}
                    {(gameState === 'running' || isOverlayVisible) && guesses.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex items-center gap-1.5 sm:gap-4 animate-fade-in">
                            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                                <img src={guessers[rowIndex]?.profilePictureUrl} alt="guesser" className="w-full h-full rounded-md object-cover bg-black/20" />
                            </div>
                            <div className={`grid flex-grow gap-1 sm:gap-2`} style={{gridTemplateColumns: `repeat(${WORD_LENGTH}, minmax(0, 1fr))`}}>
                                {row.map((tile, tileIndex) => (
                                    <div key={tileIndex} className={`relative aspect-square flex items-center justify-center text-xl sm:text-2xl font-bold uppercase rounded-md border-2 transition-all duration-500 ${theme.tileBorder} 
                                        ${tile.status !== TileStatus.Empty ? 'animate-flip' : ''}
                                        ${tile.status === TileStatus.Correct ? theme.tileCorrect : ''}
                                        ${tile.status === TileStatus.Present ? theme.tilePresent : ''}
                                        ${tile.status === TileStatus.Absent ? theme.tileAbsent : ''}
                                        ${tile.status !== TileStatus.Empty ? 'text-white' : ''}
                                    `}>
                                        {tile.letter}
                                    </div>
                                ))}
                            </div>
                             <div className="flex-shrink-0 w-16 sm:w-24 text-left">
                               <span className="text-xs sm:text-sm text-white/70 font-medium break-words">{guessers[rowIndex]?.nickname}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isOverlayVisible && (
                 <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 animate-fade-in">
                    
                    {(gameState === 'solved' || gameState === 'leaderboard' || gameState === 'round_over') && (
                        <div className="w-full max-w-md p-4 rounded-2xl ${theme.containerBg} border ${theme.tileBorder} shadow-2xl">
                            {gameState === 'solved' && (
                                <div className="flex flex-col items-center justify-center animate-fade-in">
                                    <h3 className="text-2xl font-bold mb-4 text-cyan-400">{t.overlay_winners_title}</h3>
                                    <div className="w-full max-w-md space-y-1.5">
                                        {roundWinners.slice(0, 10).map((winner, index) => (
                                            <div key={winner.user.userId} className={`flex items-center gap-3 p-2 rounded-lg ${theme.inputBg}`}>
                                                <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
                                                <img src={winner.user.profilePictureUrl} alt={winner.user.nickname} className="w-8 h-8 rounded-full" />
                                                <span className="flex-grow font-semibold truncate">{winner.user.nickname}</span>
                                                <span className="text-sm text-white/70">{winner.duration.toFixed(2)}s</span>
                                                <span className={`font-bold ${theme.accent}`}>+{winner.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {gameState === 'leaderboard' && (
                                <div className="flex flex-col items-center justify-center animate-fade-in space-y-4">
                                    <h3 className="text-2xl font-bold text-yellow-400">{t.overlay_leaderboard_title}</h3>
                                    <div className="w-full max-w-md space-y-1.5">
                                        {leaderboard.slice(0, 10).map((entry, index) => (
                                            <div key={entry.user.userId} className={`flex items-center gap-3 p-2 rounded-lg ${theme.inputBg}`}>
                                                <span className="font-bold text-lg w-6 text-center">{index + 1}</span>
                                                <img src={entry.user.profilePictureUrl} alt={entry.user.nickname} className="w-8 h-8 rounded-full" />
                                                <span className="flex-grow font-semibold truncate">{entry.user.nickname}</span>
                                                <span className="font-bold text-yellow-400">{entry.score.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {leaderboard.length === 0 && <p className="text-center text-white/50">{t.leaderboard_no_scores}</p>}
                                    </div>
                                </div>
                            )}
                            {gameState === 'round_over' && (
                                <div className="flex flex-col items-center justify-center animate-fade-in space-y-3">
                                    <h3 className="text-2xl font-bold text-red-400">{t.overlay_times_up_title}</h3>
                                    <p className="text-white/80">{t.overlay_correct_word}</p>
                                    <div className="flex items-center justify-center gap-2">
                                        {targetWord.split('').map((letter, i) => (
                                            <div key={i} className={`w-12 h-12 flex items-center justify-center text-2xl font-bold uppercase rounded-md text-white ${theme.tileCorrect}`}>
                                                {letter}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-white/80 pt-2">{t.overlay_next_round}</p>
                                    <p className="text-4xl font-bold text-white">{autoRestartTimeLeft}</p>
                                </div>
                            )}
                        </div>
                    )}

                     {gameState === 'waiting' && (
                        <div className="text-center space-y-4 animate-pulse">
                            <div className="bg-black/50 p-4 rounded-lg">
                                <p className="font-semibold text-lg text-white" dangerouslySetInnerHTML={{ __html: t.overlay_waiting_next }} />
                            </div>
                            <div className="flex items-center justify-center gap-3 text-white/80 bg-black/50 p-3 rounded-lg">
                                <Icons.Heart className="w-5 h-5 text-rose-400"/>
                                <span className="font-semibold">{t.overlay_waiting_likes}</span>
                                <Icons.Heart className="w-5 h-5 text-rose-400"/>
                            </div>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
});