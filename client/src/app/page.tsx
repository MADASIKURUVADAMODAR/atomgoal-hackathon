'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-indigo-400 animate-pulse text-xl font-bold">
                AtomGoal...
            </div>
        </div>
    );
}
