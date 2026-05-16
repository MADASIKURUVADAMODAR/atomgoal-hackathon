'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, Badge, Button, Input } from '@/components/ui';
import api from '@/lib/api';

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'hierarchy'>('list');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    type HierarchyNode = {
        id: string;
        name: string;
        role: string;
        department: string;
        manager_id: string | null;
        children?: HierarchyNode[];
    };

    const buildHierarchy = (parentId: string | null = null): HierarchyNode[] => {
        return (users as any[])
            .filter(u => u.manager_id === parentId)
            .map(u => ({
                id: u.id,
                name: u.name,
                role: u.role,
                department: u.department,
                manager_id: u.manager_id,
                children: buildHierarchy(u.id)
            }));
    };

    const OrgNode = ({ node, depth = 0 }: { node: HierarchyNode, depth?: number }) => (
        <div className="ml-8 mt-2">
            <div className={`flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-lg ${depth === 0 ? 'border-indigo-500/50' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                    {node.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-200">{node.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{node.role} • {node.department}</p>
                </div>
            </div>
            {node.children && node.children.length > 0 && (
                <div className="border-l-2 border-slate-800 ml-4 pl-4 space-y-2">
                    {node.children.map((child: HierarchyNode) => (
                        <OrgNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-100">User Management</h1>
                    <p className="text-slate-400">Manage organization hierarchy and permissions</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button 
                        onClick={() => setView('list')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        List View
                    </button>
                    <button 
                        onClick={() => setView('hierarchy')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'hierarchy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Hierarchy View
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-indigo-400 p-10">Loading users...</div>
            ) : view === 'list' ? (
                <Card className="overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Manager</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-900/30">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-200">{u.name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge status={u.role === 'admin' ? 'completed' : u.role === 'manager' ? 'submitted' : 'draft'}>
                                            {u.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-300">{u.department}</td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {users.find(m => m.id === u.manager_id)?.name || '—'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-2 text-green-500 text-xs font-bold">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-400 hover:underline text-sm font-bold">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <div className="space-y-6">
                    {buildHierarchy(null).map((root: HierarchyNode) => (
                        <div key={root.id} className="p-6 bg-slate-950 rounded-xl border border-slate-900">
                            <OrgNode node={root} />
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
