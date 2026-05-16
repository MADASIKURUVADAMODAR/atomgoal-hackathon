'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Input } from '@/components/ui';
import api from '@/lib/api';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const mockLogs = [
        { id: 1, user: 'Sneha Reddy', action: 'Created Shared Goal', entity: 'Goal', timestamp: '2026-05-16 12:45', details: 'Pushed KPI "Uptime" to Engineering' },
        { id: 2, user: 'Amit Kumar', action: 'Approved Goal', entity: 'Goal', timestamp: '2026-05-16 11:30', details: 'Approved "API Optimization" for Rahul' },
        { id: 3, user: 'Rahul Sharma', action: 'Submitted Goals', entity: 'GoalSheet', timestamp: '2026-05-16 10:15', details: 'Submitted 5 goals for Q2' },
        { id: 4, user: 'System', action: 'Escalation Triggered', entity: 'Escalation', timestamp: '2026-05-15 09:00', details: 'Manager review overdue for Priya Patel' },
    ];

    useEffect(() => {
        // Mock fetch for now
        setTimeout(() => {
            setLogs(mockLogs);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">Audit & Security Logs</h1>
                    <p className="text-slate-400">Track all administrative and critical system actions</p>
                </div>
                <div className="w-64">
                    <Input placeholder="Search logs..." />
                </div>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Entity</th>
                            <th className="px-6 py-4">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-900/30">
                                <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.timestamp}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-slate-300">{log.user}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge status={log.action.includes('Approved') || log.action.includes('Created') ? 'completed' : 'submitted'}>
                                        {log.action}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-widest">{log.entity}</td>
                                <td className="px-6 py-4 text-sm text-slate-500 italic">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </DashboardLayout>
    );
}
