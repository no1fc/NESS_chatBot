'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Loader2, Save } from 'lucide-react';

export default function PromptsSettingsPage() {
    const [prompt, setPrompt] = useState('');
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
                setPrompt(data.settings.system_prompt || '');
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'system_prompt', value: prompt })
            });
            const data = await res.json();

            if (data.success) {
                alert('시스템 프롬프트가 성공적으로 업데이트되었습니다.');
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
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">시스템 프롬프트 설정</h1>
                <p className="text-gray-500 mt-1">챗봇의 페르소나, 역할, 기본 응답 규칙을 정의합니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
                <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex justify-between items-center text-gray-800 font-semibold text-lg">
                        <span className="flex items-center gap-2">
                            <Bot size={20} className="text-purple-600" />
                            System Prompt (프롬프트 에디터)
                        </span>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                            변경사항 저장
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-0 relative bg-gray-50">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <Loader2 className="animate-spin w-6 h-6 text-purple-600" />
                                프롬프트 불러오는 중...
                            </div>
                        </div>
                    )}
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading || isSaving}
                        className="w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed text-gray-900 bg-white focus:ring-2 focus:ring-inset focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                        placeholder="여기에 시스템 프롬프트를 입력하세요...&#10;&#10;예시:&#10;당신은 NESS 기관의 친절한 상담 챗봇입니다.&#10;다음 규칙을 반드시 지켜주세요..."
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    );
}
