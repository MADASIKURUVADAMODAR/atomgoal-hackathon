'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import api from '@/lib/api';
import { Goal } from '@/types';
import Link from 'next/link';

export default function GoalListPage() {
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

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">My Goal Sheets</h1>
                    <p className="text-slate-400">View and manage your objectives</p>
                </div>
                <Link href="/dashboard/goals/new">
                    <Button>+ New Goal Sheet</Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <p className="text-indigo-400 animate-pulse">Loading your goals...</p>
                </div>
            ) : goals.length === 0 ? (
                <Card className="p-20 text-center">
                    <div className="text-5xl mb-4">📝</div>
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">No Goal Sheets Yet</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Start by creating your first goal sheet for the current cycle. Define your targets and weightages.</p>
                    <Link href="/dashboard/goals/new">
                        <Button>Get Started</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {goals.map((goal) => (
                        <Card key={goal.id} className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-100">{goal.title}</h3>
                                        <Badge status={goal.status}>{goal.status}</Badge>
                                        {goal.is_shared && <Badge status="completed">Shared KPI</Badge>}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-4">{goal.description}</p>
                                    <div className="flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        <div className="flex flex-col gap-1">
                                            <span>Thrust Area</span>
                                            <span className="text-slate-300">{goal.thrust_area}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>UoM</span>
                                            <span className="text-slate-300">{goal.unit_of_measurement}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>Target</span>
                                            <span className="text-slate-300 font-bold text-indigo-400">{goal.target}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span>Weightage</span>
                                            <span className="text-slate-300 font-bold text-indigo-400">{goal.weightage}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!goal.is_locked && (
                                        <Button variant="outline" className="text-xs">Edit</Button>
                                    )}
                                    {goal.is_locked && (
                                        <div className="text-xs text-slate-600 flex items-center gap-1 italic">
                                            🔒 Locked
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
