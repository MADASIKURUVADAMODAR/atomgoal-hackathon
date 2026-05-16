'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Input } from '@/components/ui';
import api from '@/lib/api';

export default function CreateGoalPage() {
    const router = useRouter();
    const [goals, setGoals] = useState([{
        thrust_area: '',
        title: '',
        description: '',
        unit_of_measurement: 'numeric',
        target: 0,
        weightage: 10
    }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addGoal = () => {
        if (goals.length >= 8) {
            setError('Maximum 8 goals allowed');
            return;
        }
        setGoals([...goals, {
            thrust_area: '',
            title: '',
            description: '',
            unit_of_measurement: 'numeric',
            target: 0,
            weightage: 10
        }]);
    };

    const removeGoal = (index: number) => {
        if (goals.length === 1) return;
        setGoals(goals.filter((_, i) => i !== index));
    };

    const updateGoal = (index: number, field: string, value: any) => {
        const newGoals = [...goals];
        (newGoals[index] as any)[field] = value;
        setGoals(newGoals);
        setError('');
    };

    const totalWeightage = goals.reduce((sum, g) => sum + Number(g.weightage), 0);

    const handleSubmit = async (isDraft: boolean) => {
        if (!isDraft) {
            if (totalWeightage !== 100) {
                setError(`Total weightage must be exactly 100% (currently ${totalWeightage}%)`);
                return;
            }
            if (goals.some(g => g.weightage < 10)) {
                setError('Minimum weightage for any goal is 10%');
                return;
            }
        }

        setLoading(true);
        try {
            await api.post('/goals', {
                goals,
                cycle_id: 'c1', // Demo cycle
                is_draft: isDraft
            });
            router.push('/dashboard/goals');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Create Goal Sheet</h1>
                    <p className="text-slate-400">Define your objectives for the current cycle</p>
                </div>
                <div className="flex gap-4">
                    <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${totalWeightage === 100 ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-amber-500/50 bg-amber-500/10 text-amber-400'}`}>
                        <span className="text-xs font-bold uppercase tracking-tighter">Total Weightage:</span>
                        <span className="text-lg font-bold">{totalWeightage}%</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {goals.map((goal, index) => (
                    <Card key={index} className="p-6 relative group">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-lg font-bold text-indigo-400">Goal #{index + 1}</h3>
                            {goals.length > 1 && (
                                <button 
                                    onClick={() => removeGoal(index)}
                                    className="text-slate-600 hover:text-red-500 transition-colors"
                                >
                                    ✕ Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Input 
                                label="Thrust Area" 
                                value={goal.thrust_area} 
                                onChange={(e: any) => updateGoal(index, 'thrust_area', e.target.value)}
                                placeholder="e.g. System Performance"
                            />
                            <Input 
                                label="Goal Title" 
                                value={goal.title} 
                                onChange={(e: any) => updateGoal(index, 'title', e.target.value)}
                                placeholder="e.g. Optimize API Latency"
                            />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-400">UoM</label>
                                <select 
                                    className="bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200"
                                    value={goal.unit_of_measurement}
                                    onChange={(e) => updateGoal(index, 'unit_of_measurement', e.target.value)}
                                >
                                    <option value="numeric">Numeric</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="timeline">Timeline</option>
                                    <option value="zero_based">Zero-based</option>
                                </select>
                            </div>
                            <Input 
                                label="Target" 
                                type="number"
                                value={goal.target} 
                                onChange={(e: any) => updateGoal(index, 'target', e.target.value)}
                            />
                            <Input 
                                label="Weightage (%)" 
                                type="number"
                                min="10"
                                max="100"
                                value={goal.weightage} 
                                onChange={(e: any) => updateGoal(index, 'weightage', e.target.value)}
                            />
                            <Input 
                                label="Description" 
                                value={goal.description} 
                                onChange={(e: any) => updateGoal(index, 'description', e.target.value)}
                                placeholder="Details about the goal..."
                            />
                        </div>
                    </Card>
                ))}

                {goals.length < 8 && (
                    <button 
                        onClick={addGoal}
                        className="py-4 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition-all font-medium"
                    >
                        + Add Another Goal
                    </button>
                )}

                {error && (
                    <Card className="p-4 border-red-500/50 bg-red-500/10">
                        <p className="text-red-500 text-sm font-medium">⚠️ {error}</p>
                    </Card>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading}>
                        Save as Draft
                    </Button>
                    <Button onClick={() => handleSubmit(false)} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit to Manager'}
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
