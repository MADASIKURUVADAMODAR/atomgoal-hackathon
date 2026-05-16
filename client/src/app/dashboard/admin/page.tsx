'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Button } from '@/components/ui';
import api from '@/lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        totalUsers: 0,
        completionRate: 68,
        activeCycles: 1,
        departmentStats: [
            { name: 'Engineering', completed: 45, pending: 20 },
            { name: 'Sales', completed: 30, pending: 15 },
            { name: 'HR', completed: 10, pending: 5 },
        ],
        goalStatus: [
            { name: 'Approved', value: 400 },
            { name: 'Pending', value: 300 },
            { name: 'Draft', value: 200 },
            { name: 'Rework', value: 100 },
        ]
    });

    const COLORS = ['#10b981', '#f59e0b', '#6366f1', '#ef4444'];

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Admin Command Center</h1>
                    <p className="text-slate-400">Organization-wide analytics and control</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.print()}>Export PDF Report</Button>
                    <Button>Configure New Cycle</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Workforce', value: '1,240', icon: '🏢' },
                    { label: 'Completion %', value: '82%', icon: '📈' },
                    { label: 'Active Goals', value: '4,850', icon: '🎯' },
                    { label: 'Pending Audits', value: '12', icon: '🛡️' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-100">{stat.value}</div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Goal Status Distribution</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.goalStatus}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.goalStatus.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Departmental Performance</h2>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.departmentStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                                <Legend />
                                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Critical Alerts</h2>
                    <div className="space-y-4">
                        {[
                            { msg: 'Q3 Review Cycle closing in 48 hours', type: 'danger', icon: '⏰' },
                            { msg: '15 employees in Engineering have unsubmitted goal sheets', type: 'warning', icon: '⚠️' },
                            { msg: 'Shared KPI "Reliability" synced across 450 users', type: 'success', icon: '🔄' },
                        ].map((alert, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                                <span className="text-xl">{alert.icon}</span>
                                <span className="text-sm text-slate-300 font-medium">{alert.msg}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">Quick Tools</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/dashboard/admin/users">
                            <Button variant="secondary" className="w-full text-left justify-start">👥 User Management</Button>
                        </Link>
                        <Link href="/dashboard/admin/shared-goals">
                            <Button variant="secondary" className="w-full text-left justify-start">🎯 Push Shared Goals</Button>
                        </Link>
                        <Link href="/dashboard/admin/audit">
                            <Button variant="secondary" className="w-full text-left justify-start">📜 Audit Logs</Button>
                        </Link>
                        <Button variant="outline" className="w-full text-left justify-start">🔓 Unlock Goal sheets</Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}

import Link from 'next/link';
