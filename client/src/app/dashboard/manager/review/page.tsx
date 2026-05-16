'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button, Input } from '@/components/ui';
import api from '@/lib/api';

function ReviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const goalId = searchParams.get('id');
    const [goal, setGoal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState('');
    const [editTarget, setEditTarget] = useState<number>(0);
    const [editWeightage, setEditWeightage] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!goalId) return;
        const fetchGoal = async () => {
            try {
                const res = await api.get('/manager/team-goals');
                const found = res.data.find((g: any) => g.id === goalId);
                setGoal(found);
                setEditTarget(found.target);
                setEditWeightage(found.weightage);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGoal();
    }, [goalId]);

    const handleAction = async (action: 'approved' | 'rejected' | 'rework') => {
        setSubmitting(true);
        try {
            await api.post(`/manager/goals/${goalId}/review`, {
                action,
                comments,
                modified_target: editTarget !== goal.target ? editTarget : undefined,
                modified_weightage: editWeightage !== goal.weightage ? editWeightage : undefined
            });
            router.push('/dashboard/manager');
        } catch (err) {
            console.error(err);
            alert('Action failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-indigo-400">Loading goal details...</div>;
    if (!goal) return <div className="p-8 text-red-500">Goal not found.</div>;

    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <Link href="/dashboard/manager" className="hover:text-indigo-400 transition-colors">Team Dashboard</Link>
                    <span>/</span>
                    <span>Review Goal</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-100">Review Goal Sheet</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <Badge status={goal.status}>{goal.status}</Badge>
                                <h2 className="text-2xl font-bold text-slate-100 mt-2">{goal.title}</h2>
                                <p className="text-slate-400 mt-2">{goal.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase">Employee</p>
                                <p className="text-lg font-bold text-indigo-400">{goal.employee_name}</p>
                                <p className="text-xs text-slate-500">{goal.department}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 p-6 bg-slate-950/50 border border-slate-800 rounded-xl">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Original Parameters</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Target:</span>
                                        <span className="text-slate-200 font-bold">{goal.target} {goal.unit_of_measurement}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Weightage:</span>
                                        <span className="text-slate-200 font-bold">{goal.weightage}%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Thrust Area:</span>
                                        <span className="text-slate-200 font-bold">{goal.thrust_area}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-indigo-400 uppercase mb-3 italic">Inline Editing (Adjustment)</p>
                                <div className="space-y-4">
                                    <Input 
                                        label="Adjust Target" 
                                        type="number" 
                                        value={editTarget} 
                                        onChange={(e: any) => setEditTarget(Number(e.target.value))} 
                                    />
                                    <Input 
                                        label="Adjust Weightage (%)" 
                                        type="number" 
                                        value={editWeightage} 
                                        onChange={(e: any) => setEditWeightage(Number(e.target.value))} 
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-8">
                        <h3 className="text-lg font-bold text-slate-100 mb-4">Manager Comments</h3>
                        <textarea 
                            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-4 py-3 text-slate-200 h-32 mb-4"
                            placeholder="Provide feedback to the employee..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="danger" onClick={() => handleAction('rejected')} disabled={submitting}>Reject</Button>
                            <Button variant="secondary" onClick={() => handleAction('rework')} disabled={submitting}>Return for Rework</Button>
                            <Button onClick={() => handleAction('approved')} disabled={submitting}>Approve & Lock Goal</Button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Goal Context</h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-800/30 rounded-lg">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status Policy</p>
                                <p className="text-xs text-slate-400">Approved goals are locked and cannot be edited by the employee until unlocked by an admin.</p>
                            </div>
                            <div className="p-3 bg-slate-800/30 rounded-lg">
                                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Shared Goal</p>
                                <p className="text-xs text-slate-400">{goal.is_shared ? 'This is a department KPI. Titles and targets are globally synced.' : 'Personal goal created by the employee.'}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Approval History</h3>
                        <div className="text-xs text-slate-600 italic">No previous actions recorded for this goal cycle.</div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

import Link from 'next/link';

export default function ReviewGoalPage() {
    return (
        <Suspense fallback={<div className="p-8 text-indigo-400">Loading...</div>}>
            <ReviewContent />
        </Suspense>
    );
}
