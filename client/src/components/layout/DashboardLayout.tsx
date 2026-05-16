'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui';

export const Sidebar = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: '📊' },
        { label: 'Goal Sheets', path: '/dashboard/goals', icon: '📝' },
        { label: 'New Goal', path: '/dashboard/goals/new', icon: '✨' },
        { label: 'Quarterly Check-ins', path: '/dashboard/checkins', icon: '📈' },
    ];

    if (user?.role === 'manager' || user?.role === 'admin') {
        navItems.splice(1, 0, { label: 'Team Dashboard', path: '/dashboard/manager', icon: '👥' });
    }

    if (user?.role === 'admin') {
        navItems.splice(1, 0, { label: 'Admin Center', path: '/dashboard/admin', icon: '🛡️' });
    }

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6 border-b border-slate-900">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">AtomGoal</h1>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">{user?.role} Portal</p>
            </div>
            <nav className="flex-1 p-4 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link 
                            key={item.path} 
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                isActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                        >
                            <span>{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-900">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.department}</p>
                    </div>
                </div>
                <Button variant="secondary" className="w-full text-sm" onClick={logout}>Logout</Button>
            </div>
        </aside>
    );
};

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { loading, user } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen bg-slate-950 text-indigo-400">Loading...</div>;
    if (!user) return null; // Hook will redirect to login

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
};
