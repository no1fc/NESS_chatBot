'use client';

import React, { useState, useEffect } from 'react';
import { ShieldPlus, Trash2, KeyRound, Loader2 } from 'lucide-react';

interface AdminUser {
    id: number;
    username: string;
    role: string;
    created_at: string;
}

export default function AdminUsersManagementPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // New Admin Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', role: 'admin' });
    const [isSaving, setIsSaving] = useState(false);

    // Password Change Modal State
    const [isPwModalOpen, setIsPwModalOpen] = useState(false);
    const [pwFormData, setPwFormData] = useState({ id: 0, password: '' });
    const [isPwSaving, setIsPwSaving] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setAdmins(data.admins);
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
            alert('관리자 목록을 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                await fetchAdmins();
                setIsModalOpen(false);
                setFormData({ username: '', password: '', role: 'admin' });
            } else {
                alert(data.error || '관리자 생성 실패');
            }
        } catch (error) {
            console.error('Create admin error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPwSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${pwFormData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwFormData.password })
            });
            const data = await res.json();
            if (data.success) {
                setIsPwModalOpen(false);
                setPwFormData({ id: 0, password: '' });
                alert('비밀번호가 변경되었습니다.');
            } else {
                alert(data.error || '비밀번호 변경 실패');
            }
        } catch (error) {
            console.error('Change password error:', error);
        } finally {
            setIsPwSaving(false);
        }
    };

    const handleDelete = async (id: number, username: string) => {
        if (!window.confirm(`정말 관리자 '${username}' 계정을 삭제하시겠습니까?`)) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                await fetchAdmins();
            } else {
                alert(data.error || '삭제 실패');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const handleRoleChange = async (id: number, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            if (data.success) {
                await fetchAdmins(); // Refresh list to show updated roles
            } else {
                alert(data.error || '권한 변경 실패');
            }
        } catch (error) {
            console.error('Change role error:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">관리자 지정</h1>
                    <p className="text-gray-500 mt-1">NESS 챗봇 시스템에 접근할 관리자 계정을 관리합니다.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <ShieldPlus size={18} />
                    신규 계정 생성
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm font-semibold border-b border-gray-200">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">아이디 (Username)</th>
                                <th className="px-6 py-4">생성일</th>
                                <th className="px-6 py-4">역할</th>
                                <th className="px-6 py-4">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="animate-spin w-5 h-5 text-blue-600 mx-auto mb-2" />
                                        계정 정보를 불러오는 중...
                                    </td>
                                </tr>
                            ) : admins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">등록된 관리자가 없습니다.</td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">#{admin.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{admin.username}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(admin.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={admin.role}
                                                onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full outline-none cursor-pointer appearance-none text-center ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                                    }`}
                                            >
                                                <option value="superadmin" className="bg-white text-gray-800">최고 관리자</option>
                                                <option value="admin" className="bg-white text-gray-800">일반 관리자</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setPwFormData({ id: admin.id, password: '' });
                                                        setIsPwModalOpen(true);
                                                    }}
                                                    className="text-slate-600 hover:text-slate-800 transition-colors p-1"
                                                    title="비밀번호 변경"
                                                >
                                                    <KeyRound size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin.id, admin.username)}
                                                    disabled={admin.role === 'superadmin' && admins.length === 1} // 마지막 남은 superadmin 삭제 방지 UI
                                                    className={`p-1 transition-colors ${admin.role === 'superadmin' && admins.length === 1
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-red-600 hover:text-red-800'
                                                        }`}
                                                    title="계정 삭제"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 새 관리자 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">신규 관리자 생성</h2>
                        </div>
                        <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                                <input required name="username" value={formData.username} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900 bg-white" placeholder="아이디 영문입력" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">임시 비밀번호</label>
                                <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900 bg-white" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-gray-900 bg-white">
                                    <option value="admin">일반 관리자</option>
                                    <option value="superadmin">최고 관리자</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                                <button disabled={isSaving} type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center">
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}생성
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 비밀번호 변경 모달 */}
            {isPwModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">비밀번호 변경</h2>
                        </div>
                        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                                <input required type="password" value={pwFormData.password} onChange={(e) => setPwFormData(p => ({ ...p, password: e.target.value }))} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="강력한 암호 입력" />
                            </div>
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={() => setIsPwModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
                                <button disabled={isPwSaving} type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center">
                                    {isPwSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}변경
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
