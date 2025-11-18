import React, { useState } from 'react';
import { ConnectionStatus, Theme } from '../types';
import { translations } from '../localization';

interface ConnectFormProps {
    onConnect: (uniqueId: string) => void;
    connectionStatus: ConnectionStatus;
    theme: Theme;
    t: typeof translations.en;
}

export const ConnectForm: React.FC<ConnectFormProps> = ({ onConnect, connectionStatus, theme, t }) => {
    const [uniqueId, setUniqueId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect(uniqueId.replace(/^@/, ''));
    };

    const isConnecting = connectionStatus === 'connecting';

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="uniqueIdInput" className="block text-center text-lg font-medium mb-3" dangerouslySetInnerHTML={{ __html: t.connect_form_label }} />
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                    type="text"
                    id="uniqueIdInput"
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    placeholder={t.connect_form_placeholder}
                    disabled={isConnecting}
                    className={`flex-grow w-full ${theme.inputBg} placeholder-white/40 border-2 border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 outline-none disabled:opacity-50`}
                />
                <button
                    type="submit"
                    disabled={isConnecting}
                    className={`w-full sm:w-auto ${theme.buttonBg} ${theme.buttonHoverBg} ${theme.buttonText} font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2`}
                >
                    {isConnecting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t.connect_form_connecting_button}
                        </>
                    ) : (
                        t.connect_form_button
                    )}
                </button>
            </div>
        </form>
    );
};
