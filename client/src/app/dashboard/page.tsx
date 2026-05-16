'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import api from '@/lib/api';
import { Goal } from '@/types';
import Link from 'next/link';

export default function EmployeeDashboard() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await api.get('/goals');
                setGoals(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGoals();
    }, []);

    const stats = {
        total: goals.length,
        submitted: goals.filter(g => g.status === 'submitted' || g.status === 'approved').length,
        pending: goals.filter(g => g.status === 'draft' || g.status === 'rework').length,
        avgProgress: 45, // Mock for now
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Overview</h1>
                    <p className="text-slate-400">Track your performance and goal progress</p>
                </div>
                <Link href="/dashboard/goals/new">
                    <Button>Create Goal Sheet</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Goals', value: stats.total, icon: '🎯' },
                    { label: 'Submitted', value: stats.submitted, icon: '✅' },
                    { label: 'Pending Action', value: stats.pending, icon: '⏳' },
                    { label: 'Overall Progress', value: `${stats.avgProgress}%`, icon: '📈' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-100">{stat.value}</div>
                        <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                            <div 
                                className="bg-indigo-500 h-full transition-all duration-1000" 
                                style={{ width: typeof stat.value === 'string' ? stat.value : '100%' }}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-100">Recent Goals</h2>
                        <Link href="/dashboard/goals" className="text-indigo-400 text-sm hover:underline">View All</Link>
                    </div>
                    {loading ? (
                        <p className="text-slate-500 italic">Loading goals...</p>
                    ) : goals.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-slate-500 mb-4">No goals created yet.</p>
                            <Link href="/dashboard/goals/new">
                                <Button variant="outline">Start Goal Setting</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {goals.slice(0, 4).map((goal) => (
                                <div key={goal.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-slate-200">{goal.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{goal.thrust_area}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge status={goal.status}>{goal.status}</Badge>
                                        <div className="text-sm font-bold text-slate-400">{goal.weightage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Quarterly Timeline</h2>
                    <div className="space-y-6">
                        {[
                            { q: 'Q1', period: 'July', status: 'Completed', color: 'bg-green-500' },
                            { q: 'Q2', period: 'October', status: 'In Progress', color: 'bg-indigo-500' },
                            { q: 'Q3', period: 'January', status: 'Upcoming', color: 'bg-slate-700' },
                            { q: 'Q4', period: 'March-April', status: 'Upcoming', color: 'bg-slate-700' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-200">{item.q} Review</span>
                                        <span className="text-xs text-slate-500">{item.period}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
