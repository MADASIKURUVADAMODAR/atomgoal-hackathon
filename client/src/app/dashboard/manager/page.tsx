'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button } from '@/components/ui';
import api from '@/lib/api';
import { PlannedVsActualChart } from '@/components/charts/PlannedVsActualChart';
import Link from 'next/link';

export default function ManagerDashboard() {
    const [teamGoals, setTeamGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamData = async () => {
            try {
                const res = await api.get('/manager/team-goals');
                setTeamGoals(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeamData();
    }, []);

    const chartData = teamGoals.slice(0, 5).map(g => ({
        title: g.title.length > 10 ? g.title.substring(0, 10) + '...' : g.title,
        target: 100, // Normalized to 100% for chart
        actual: 45 // Mock actual for now
    }));

    const stats = {
        totalEmployees: new Set(teamGoals.map(g => g.user_id)).size,
        pendingReview: teamGoals.filter(g => g.status === 'submitted').length,
        approved: teamGoals.filter(g => g.status === 'approved').length,
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-100">Team Dashboard</h1>
                <p className="text-slate-400">Review and manage your team's performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Team Size', value: stats.totalEmployees, icon: '👥' },
                    { label: 'Pending Review', value: stats.pendingReview, icon: '⏳', color: 'text-amber-400' },
                    { label: 'Approved Goals', value: stats.approved, icon: '✅', color: 'text-green-400' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className={`text-3xl font-bold ${stat.color || 'text-slate-100'}`}>{stat.value}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Planned vs Actual Progress</h2>
                    <PlannedVsActualChart data={chartData} />
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Action Items</h2>
                    <div className="space-y-4">
                        {teamGoals.filter(g => g.status === 'submitted').length === 0 ? (
                            <p className="text-sm text-slate-500 italic">No pending goal sheets to review.</p>
                        ) : (
                            teamGoals.filter(g => g.status === 'submitted').map((goal) => (
                                <div key={goal.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-indigo-400">{goal.employee_name}</span>
                                        <Badge status={goal.status}>Pending</Badge>
                                    </div>
                                    <h3 className="text-sm font-medium text-slate-200 mb-3">{goal.title}</h3>
                                    <Link href={`/dashboard/manager/review?id=${goal.id}`}>
                                        <Button className="w-full text-xs py-1.5" variant="outline">Review Sheet</Button>
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            <Card className="mt-8 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-slate-100">Team Goal List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Goal Title</th>
                                <th className="px-6 py-4">Target</th>
                                <th className="px-6 py-4">Weightage</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {teamGoals.map((goal) => (
                                <tr key={goal.id} className="hover:bg-slate-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-200">{goal.employee_name}</div>
                                        <div className="text-xs text-slate-500">{goal.department}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300">{goal.title}</td>
                                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{goal.target} {goal.unit_of_measurement}</td>
                                    <td className="px-6 py-4 text-sm text-slate-300 font-bold">{goal.weightage}%</td>
                                    <td className="px-6 py-4">
                                        <Badge status={goal.status}>{goal.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/dashboard/manager/review?id=${goal.id}`}>
                                            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Manage</button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
}
