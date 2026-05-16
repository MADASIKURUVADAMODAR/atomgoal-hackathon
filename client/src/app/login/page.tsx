'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-2">AtomGoal</h1>
                    <p className="text-slate-400 font-medium italic">Smart Goal Setting & Tracking Portal</p>
                </div>

                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-slate-100 mb-6">Welcome Back</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Input 
                            label="Email Address" 
                            type="email" 
                            placeholder="you@atomgoal.com"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            required
                        />
                        <Input 
                            label="Password" 
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            required
                        />
                        
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                        
                        <Button type="submit" className="w-full h-11 text-lg mt-2" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 text-center mb-4 uppercase tracking-widest font-bold">Hackathon Demo Access</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => { setEmail('rahul@atomgoal.com'); setPassword('demo123'); }}
                                className="text-[10px] bg-slate-800/50 hover:bg-slate-800 p-2 rounded text-slate-400 transition-colors"
                            >
                                Employee Login
                            </button>
                            <button 
                                onClick={() => { setEmail('amit@atomgoal.com'); setPassword('demo123'); }}
                                className="text-[10px] bg-slate-800/50 hover:bg-slate-800 p-2 rounded text-slate-400 transition-colors"
                            >
                                Manager Login
                            </button>
                        </div>
                    </div>
                </Card>
                
                <p className="mt-8 text-center text-slate-600 text-sm">
                    &copy; 2026 AtomGoal • Powered by Next.js & SQLite
                </p>
            </div>
        </div>
    );
}
