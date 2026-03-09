'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Loader2, Save } from 'lucide-react';

export default function GeminiSettingsPage() {
    const [apiKey, setApiKey] = useState('');
    const [maskedKey, setMaskedKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.success && data.settings) {
                setMaskedKey(data.settings.gemini_api_key_masked || '');
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey) {
            alert('새로운 API Key를 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'gemini_api_key', value: apiKey })
            });
            const data = await res.json();

            if (data.success) {
                alert('Gemini API Key가 성공적으로 업데이트되었습니다.');
                setApiKey(''); // 필드 초기화
                await fetchSettings(); // 마스킹된 키 다시 불러오기
            } else {
                alert(data.error || '저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('저장 중 네트워크 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gemini API 설정</h1>
                <p className="text-gray-500 mt-1">NESS 챗봇 구동에 필요한 Google Gemini API Key를 관리합니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
                        <KeyRound size={20} className="text-blue-600" />
                        API 연동 상태
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="animate-spin w-5 h-5" />
                            설정 정보를 불러오는 중...
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">현재 등록된 API Key (보안 처리됨)</label>
                            <div className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 text-gray-600 font-mono text-sm max-w-md break-all">
                                {maskedKey ? maskedKey : '등록된 API Key가 없습니다.'}
                            </div>
                        </div>
                    )}

                    <hr className="border-gray-100" />

                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">신규 API Key 등록 / 변경</label>
                            <p className="text-xs text-gray-500 mb-2">새로운 키를 입력하고 저장하면 즉시 서비스에 반영됩니다. 기존 키는 파기됩니다.</p>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-gray-900 bg-white"
                                placeholder="AIzaSy..."
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSaving || !apiKey}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
                                설정 저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
