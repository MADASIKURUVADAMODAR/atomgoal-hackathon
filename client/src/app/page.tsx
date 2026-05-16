import { redirect } from 'next/navigation';

export default function Home() {
    // Standard Next.js server-side redirect for better SEO and edge performance
    redirect('/login');
    
    // Fallback UI (though redirect will usually trigger first)
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-indigo-400 animate-pulse text-xl font-bold">
                AtomGoal...
            </div>
        </div>
    );
}
