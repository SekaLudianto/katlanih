import React from 'react';
import { Theme, ToastState } from '../types';
import { Icons } from './Icons';

interface ToastProps extends ToastState {
    theme: Theme;
}

export const Toast: React.FC<ToastProps> = ({ isOpen, message, type, theme }) => {
    const typeStyles = {
        error: 'bg-red-500 text-white',
        success: 'bg-green-500 text-white',
        info: 'bg-sky-500 text-white',
    };

    return (
        <div
            className={`fixed bottom-20 lg:bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out
                ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        >
            <div className={`flex items-center gap-3 py-3 px-5 rounded-full shadow-lg border ${theme.tileBorder} ${typeStyles[type]}`}>
                {type === 'error' && <Icons.XCircle className="w-5 h-5" />}
                {type === 'success' && <Icons.CheckCircle className="w-5 h-5" />}
                {type === 'info' && <Icons.Info className="w-5 h-5" />}
                <p className="font-semibold text-sm">{message}</p>
            </div>
        </div>
    );
};