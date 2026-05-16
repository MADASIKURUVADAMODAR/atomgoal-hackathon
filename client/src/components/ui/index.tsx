'use client';

import React from 'react';

// Card Component
export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl ${className}`}>
        {children}
    </div>
);

// Button Component
export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }: any) => {
    const variants: any = {
        primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
        danger: 'bg-red-600 hover:bg-red-500 text-white',
        outline: 'bg-transparent border border-indigo-600 text-indigo-400 hover:bg-indigo-600/10'
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// Input Component
export const Input = ({ label, error, ...props }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-slate-400">{label}</label>}
        <input
            {...props}
            className={`bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200 transition-all`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
);

// Badge Component
export const Badge = ({ children, status }: { children: React.ReactNode, status: string }) => {
    const colors: any = {
        draft: 'bg-slate-800 text-slate-400',
        submitted: 'bg-blue-900/30 text-blue-400',
        approved: 'bg-green-900/30 text-green-400',
        rejected: 'bg-red-900/30 text-red-400',
        rework: 'bg-amber-900/30 text-amber-400',
        completed: 'bg-indigo-900/30 text-indigo-400',
        on_track: 'bg-emerald-900/30 text-emerald-400',
        not_started: 'bg-slate-800 text-slate-400'
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || colors.draft}`}>
            {children}
        </span>
    );
};
