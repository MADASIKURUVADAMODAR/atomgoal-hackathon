'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button, Input } from '@/components/ui';
import api from '@/lib/api';
import { Goal } from '@/types';

export default function CheckinsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [achievement, setAchievement] = useState(0);
    const [comments, setComments] = useState('');
    const [quarter, setQuarter] = useState('Q2');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const res = await api.get('/goals');
                const approvedGoals = res.data.filter((g: Goal) => g.status === 'approved');
                setGoals(approvedGoals);
                if (approvedGoals.length > 0) setSelectedGoal(approvedGoals[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGoals();
    }, []);

    const handleSubmit = async () => {
        if (!selectedGoal) return;
        setLoading(true);
        try {
            await api.post('/checkins', {
                goal_id: selectedGoal.id,
                quarter,
                achievement,
                comments
            });
            alert('Check-in submitted successfully!');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-100">Quarterly Check-ins</h1>
                <p className="text-slate-400">Update your achievements and progress</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Goal Selection Sidebar */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Approved Goals</h2>
                    {goals.length === 0 ? (
                        <p className="text-sm text-slate-600 italic">No approved goals available for check-in.</p>
                    ) : (
                        goals.map((goal) => (
                            <button
                                key={goal.id}
                                onClick={() => setSelectedGoal(goal)}
                                className={`text-left p-4 rounded-xl border transition-all ${
                                    selectedGoal?.id === goal.id 
                                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                            >
                                <p className="font-bold text-sm truncate">{goal.title}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500">{goal.thrust_area}</span>
                                    <span className="text-xs font-bold">{goal.weightage}%</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Check-in Form */}
                <div className="lg:col-span-2">
                    {selectedGoal ? (
                        <Card className="p-8">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100">{selectedGoal.title}</h2>
                                    <p className="text-slate-400 mt-1">{selectedGoal.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Target</p>
                                    <p className="text-2xl font-bold text-indigo-400">{selectedGoal.target} <span className="text-xs text-slate-500">{selectedGoal.unit_of_measurement}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-400">Quarter</label>
                                    <select 
                                        className="bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200"
                                        value={quarter}
                                        onChange={(e) => setQuarter(e.target.value)}
                                    >
                                        <option value="Q1">Q1 (July)</option>
                                        <option value="Q2">Q2 (October)</option>
                                        <option value="Q3">Q3 (January)</option>
                                        <option value="Q4">Q4 (March-April)</option>
                                    </select>
                                </div>
                                <Input 
                                    label="Current Achievement" 
                                    type="number"
                                    value={achievement}
                                    onChange={(e: any) => setAchievement(Number(e.target.value))}
                                />
                            </div>

                            <div className="mb-8">
                                <label className="text-sm font-medium text-slate-400 block mb-1.5">Achievement Comments</label>
                                <textarea 
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200 h-32"
                                    placeholder="Provide details on your progress and any challenges..."
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                            </div>

                            {/* Progress Visualization */}
                            <div className="mb-8 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Current Progress</span>
                                    <span className="text-xl font-bold text-indigo-400">
                                        {selectedGoal.target > 0 ? Math.min(100, Math.round((achievement / selectedGoal.target) * 100)) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full transition-all duration-500" 
                                        style={{ width: `${selectedGoal.target > 0 ? Math.min(100, Math.round((achievement / selectedGoal.target) * 100)) : 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button className="px-10" onClick={handleSubmit} disabled={loading}>
                                    {loading ? 'Submitting...' : 'Update Progress'}
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-20 text-center flex flex-col items-center justify-center border-dashed">
                            <div className="text-5xl mb-4 opacity-20">📊</div>
                            <p className="text-slate-500 max-w-xs">Select an approved goal from the sidebar to update your quarterly progress.</p>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
