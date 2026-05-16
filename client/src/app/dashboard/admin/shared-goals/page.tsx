'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button, Input } from '@/components/ui';
import api from '@/lib/api';

export default function SharedGoalsPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState(0);
    const [uom, setUom] = useState('numeric');
    const [department, setDepartment] = useState('Engineering');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handlePush = async () => {
        setLoading(true);
        setSuccess('');
        try {
            await api.post('/admin/shared-goals', {
                title,
                description,
                target,
                unit_of_measurement: uom,
                department
            });
            setSuccess(`Successfully pushed "${title}" to all ${department} employees.`);
            setTitle('');
            setDescription('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-100">Shared Goals (KPIs)</h1>
                <p className="text-slate-400">Push departmental objectives to multiple employees at once</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Create Shared Goal</h2>
                    <div className="flex flex-col gap-6">
                        <Input 
                            label="Goal Title" 
                            placeholder="e.g. Quarterly System Uptime"
                            value={title}
                            onChange={(e: any) => setTitle(e.target.value)}
                        />
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-400">Description</label>
                            <textarea 
                                className="bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200 h-24"
                                placeholder="Explain the context of this shared KPI..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-400">Target Department</label>
                                <select 
                                    className="bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                >
                                    <option value="Engineering">Engineering</option>
                                    <option value="Sales">Sales</option>
                                    <option value="HR">HR</option>
                                    <option value="Product">Product</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-400">Unit of Measurement</label>
                                <select 
                                    className="bg-slate-950 border border-slate-800 focus:border-indigo-500 outline-none rounded-lg px-3 py-2 text-slate-200"
                                    value={uom}
                                    onChange={(e) => setUom(e.target.value)}
                                >
                                    <option value="numeric">Numeric</option>
                                    <option value="percentage">Percentage</option>
                                    <option value="timeline">Timeline</option>
                                    <option value="zero_based">Zero-based</option>
                                </select>
                            </div>
                        </div>
                        <Input 
                            label="Global Target Value" 
                            type="number"
                            value={target}
                            onChange={(e: any) => setTarget(Number(e.target.value))}
                        />

                        {success && (
                            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm font-bold">
                                ✅ {success}
                            </div>
                        )}

                        <Button className="w-full mt-4" onClick={handlePush} disabled={loading || !title}>
                            {loading ? 'Pushing to Team...' : 'Broadcast Shared Goal'}
                        </Button>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-100 mb-4">How it works</h3>
                        <div className="space-y-4 text-sm text-slate-400">
                            <p>• Shared goals are automatically added to the goal sheets of all employees in the selected department.</p>
                            <p>• <strong className="text-indigo-400">Read-only Parameters:</strong> Employees cannot edit the title, description, or target of a shared goal.</p>
                            <p>• <strong className="text-indigo-400">Weightage Control:</strong> Employees must still assign a weightage (min 10%) to the shared goal in their own sheet.</p>
                            <p>• <strong className="text-indigo-400">Global Sync:</strong> Any updates to the target value by the admin will reflect across all linked user sheets instantly.</p>
                        </div>
                    </Card>

                    <Card className="p-6 border-amber-500/30 bg-amber-500/5">
                        <h3 className="text-lg font-bold text-amber-400 mb-4">Admin Notice</h3>
                        <p className="text-sm text-amber-500/80 italic">Shared goals pushed after an employee has already submitted their goal sheet will automatically move the employee's sheet back to "Rework" status to allow weightage adjustments.</p>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
