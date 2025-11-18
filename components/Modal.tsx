
import React from 'react';
import { Theme } from '../types';

interface ModalProps {
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    onClose: () => void;
    theme: Theme;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, content, onClose, theme }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className={`rounded-lg shadow-xl w-full max-w-md ${theme.containerBg} border border-white/10`}>
                <div className="p-6">
                    <h3 className={`text-2xl font-bold mb-4 ${theme.accent}`}>{title}</h3>
                    <div className={`${theme.text} space-y-3`}>{content}</div>
                </div>
                <div className="bg-black/20 px-6 py-4 text-right rounded-b-lg">
                    <button onClick={onClose} className={`${theme.buttonBg} ${theme.buttonHoverBg} ${theme.buttonText} font-semibold py-2 px-5 rounded-md`}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
