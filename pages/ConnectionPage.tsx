import React from 'react';
import { Header } from '../components/Header';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { ConnectForm } from '../components/ConnectForm';
import { StatsDisplay } from '../components/StatsDisplay';
import { Theme, ConnectionState, Language } from '../types';
import { translations } from '../localization';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface ConnectionPageProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    connectionState: ConnectionState;
    onConnect: (uniqueId: string) => void;
    isSimulationMode: boolean;
    setIsSimulationMode: (isSim: boolean) => void;
    t: typeof translations.en;
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const ConnectionPage: React.FC<ConnectionPageProps> = ({ theme, setTheme, connectionState, onConnect, isSimulationMode, setIsSimulationMode, t, language, setLanguage }) => {
    
    const handleOpenSimulator = () => {
        const simulatorHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Katla Simulator Control Panel</title>
                <script src="https://cdn.tailwindcss.com"><\/script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                </style>
            </head>
            <body class="bg-slate-800 text-slate-200 p-4 sm:p-6 md:p-8">
                <div class="max-w-md mx-auto">
                    <h1 class="text-2xl font-bold text-center text-cyan-400 mb-4">Simulator Control Panel</h1>
                    <p class="text-sm text-center text-slate-400 mb-6">This page sends fake events to the main application via a local server. Keep both open.</p>

                    <div class="bg-slate-900/50 p-6 rounded-2xl space-y-4">
                        <div>
                            <label for="username" class="block text-sm font-medium text-slate-300 mb-1">Username (Fake)</label>
                            <input type="text" id="username" value="simulator_user" class="w-full bg-slate-700 text-white placeholder-slate-400 border-2 border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 outline-none">
                        </div>

                        <div>
                            <label for="message" class="block text-sm font-medium text-slate-300 mb-1">Message / Guess</label>
                            <input type="text" id="message" placeholder="Type a message or 5-letter guess" class="w-full bg-slate-700 text-white placeholder-slate-400 border-2 border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 outline-none">
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            <button id="sendComment" class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled>Send Comment</button>
                            <button id="sendGift" class="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled>Send Gift</button>
                        </div>
                         <div class="pt-2">
                            <button id="sendLike" class="w-full bg-rose-500 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50" disabled>Send Like</button>
                        </div>
                         <p id="status" class="text-xs text-center text-yellow-400 pt-2">Connecting to server...</p>
                    </div>
                </div>

                <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js"><\/script>
                <script>
                    const socket = io('http://localhost:8081');

                    const usernameInput = document.getElementById('username');
                    const messageInput = document.getElementById('message');
                    const sendCommentBtn = document.getElementById('sendComment');
                    const sendGiftBtn = document.getElementById('sendGift');
                    const sendLikeBtn = document.getElementById('sendLike');
                    const statusEl = document.getElementById('status');
                    
                    socket.on('connect', () => {
                        console.log('Simulator connected to backend server.');
                        statusEl.textContent = 'Connected to server. Ready to send events.';
                        statusEl.className = 'text-xs text-center text-green-400 pt-2';
                        sendCommentBtn.disabled = false;
                        sendGiftBtn.disabled = false;
                        sendLikeBtn.disabled = false;
                    });
                    
                    socket.on('connect_error', () => {
                        console.error('Failed to connect to backend server.');
                        statusEl.textContent = 'Error: Failed to connect to server at localhost:8081. Is it running?';
                        statusEl.className = 'text-xs text-center text-red-400 pt-2';
                    });

                    let likeCount = 0;

                    function getRandomId() {
                        return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
                    }

                    function createBaseUser() {
                        const username = usernameInput.value.trim() || 'guest';
                        return {
                            userId: \`sim_\${username}_\${getRandomId()}\`,
                            uniqueId: username,
                            nickname: username.charAt(0).toUpperCase() + username.slice(1),
                            profilePictureUrl: \`https://api.dicebear.com/8.x/adventurer/svg?seed=\${username}\`
                        };
                    }

                    sendCommentBtn.addEventListener('click', () => {
                        const message = messageInput.value.trim();
                        if (!message) {
                            alert('Message cannot be empty.');
                            return;
                        }

                        const payload = {
                            ...createBaseUser(),
                            comment: message,
                        };

                        socket.emit('simulation-event', { type: 'chat', payload });
                        messageInput.value = '';
                        messageInput.focus();
                    });
                    
                    messageInput.addEventListener('keyup', (e) => {
                         if (e.key === 'Enter') {
                            sendCommentBtn.click();
                        }
                    });

                    sendGiftBtn.addEventListener('click', () => {
                        const gifts = [
                            { id: 5655, name: 'Rose', diamonds: 1, url: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/8116782136953604113.png~tplv-obj.png' },
                            { id: 5487, name: 'TikTok', diamonds: 1, url: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/6763131829396244497.png~tplv-obj.png'},
                            { id: 7192, name: 'Ice Cream', diamonds: 1, url: 'https://p16-webcast.tiktokcdn.com/img/maliva/webcast-va/6920089492186859537.png~tplv-obj.png' }
                        ];
                        const randomGift = gifts[Math.floor(Math.random() * gifts.length)];

                        const payload = {
                            ...createBaseUser(),
                            giftId: randomGift.id,
                            giftName: randomGift.name,
                            giftPictureUrl: randomGift.url,
                            diamondCount: randomGift.diamonds,
                            repeatCount: 1,
                            repeatEnd: true,
                            describe: \`sent a \${randomGift.name}\`,
                        };
                        
                        socket.emit('simulation-event', { type: 'gift', payload });
                    });

                    sendLikeBtn.addEventListener('click', () => {
                         likeCount += 1;
                         const payload = {
                             ...createBaseUser(),
                             totalLikeCount: likeCount,
                         }
                         socket.emit('simulation-event', { type: 'like', payload });
                    });

                <\/script>
            </body>
            </html>
        `;
        const simulatorWindow = window.open('', 'Simulator Control Panel', 'width=500,height=700,scrollbars=yes,resizable=yes');
        if (simulatorWindow) {
            simulatorWindow.document.write(simulatorHtml);
            simulatorWindow.document.close();
        } else {
            alert('Please allow popups for this site to use the simulator.');
        }
    };
    
    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center min-h-screen p-4">
             <div className="w-full space-y-6">
                <Header t={t} />
                <div className="flex justify-center items-center gap-4">
                    <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
                    <LanguageSwitcher language={language} setLanguage={setLanguage} />
                </div>
                <div className={`p-4 md:p-6 rounded-2xl shadow-xl ${theme.containerBg}`}>
                    <ConnectForm onConnect={onConnect} connectionStatus={connectionState.status} theme={theme} t={t} />
                </div>
                <StatsDisplay connectionState={connectionState} theme={theme} t={t} />

                <div className={`p-4 rounded-2xl ${theme.containerBg} space-y-3`}>
                    <label htmlFor="simMode" className="flex justify-between items-center cursor-pointer">
                        <span className="font-semibold text-white/80">
                            {t.sim_mode_title}
                        </span>
                        <div className="relative inline-flex items-center">
                            <input
                                type="checkbox"
                                id="simMode"
                                className="sr-only peer"
                                checked={isSimulationMode}
                                onChange={(e) => setIsSimulationMode(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-cyan-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </div>
                    </label>
                     <p className="text-xs text-white/50">
                        {t.sim_mode_description}
                    </p>
                    <button
                        onClick={handleOpenSimulator}
                        className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        {t.sim_mode_button}
                    </button>
                </div>
             </div>
        </div>
    );
};
