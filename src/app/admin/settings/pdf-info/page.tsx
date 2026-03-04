'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Save, Info, Settings } from 'lucide-react';

export default function PdfInfoSettingsPage() {
    const [activeTab, setActiveTab] = useState<'info' | 'regulation'>('info');

    // NESS 정보 (사용자 노출용)
    const [nessInfo, setNessInfo] = useState('');
    // 규정 정보 (AI 판별용)
    const [regulationInfo, setRegulationInfo] = useState('');

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
                // DB에 값이 없으면(초기 상태) 빈 문자열 유지. 
                // 빈 문자열인 경우 서버 측 파일(pdf-NESS-info.ts 등)의 하드코딩된 기본값이 사용됨.
                setNessInfo(data.settings.pdf_ness_info_content || '');
                setRegulationInfo(data.settings.pdf_regulation_content || '');
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
            // 현재 활성화된 탭의 내용만 저장
            const targetKey = activeTab === 'info' ? 'pdf_ness_info_content' : 'pdf_regulation_content';
            const targetValue = activeTab === 'info' ? nessInfo : regulationInfo;

            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: targetKey, value: targetValue })
            });
            const data = await res.json();

            if (data.success) {
                alert(`${activeTab === 'info' ? 'NESS 안내 정보' : '진단 규정 정보'}가 성공적으로 업데이트되었습니다.`);
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
        <div className="max-w-5xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">PDF 및 정보성 텍스트 설정</h1>
                <p className="text-gray-500 mt-1">사용자에게 보여질 제도 안내 텍스트와 AI 판별에 사용될 규정 텍스트를 관리합니다.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
                {/* 탭 네비게이션 */}
                <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'info'
                                ? 'border-blue-600 text-blue-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Info size={18} />
                        NESS 안내 텍스트 (사용자 노출용)
                    </button>
                    <button
                        onClick={() => setActiveTab('regulation')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'regulation'
                                ? 'border-amber-600 text-amber-600 bg-white'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Settings size={18} />
                        진단 규정 텍스트 (AI 판별용)
                    </button>

                    <div className="ml-auto p-3">
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm disabled:cursor-not-allowed disabled:bg-gray-400 ${activeTab === 'info' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-amber-600 hover:bg-amber-700'
                                }`}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                            {activeTab === 'info' ? '안내 텍스트 저장' : '규정 텍스트 저장'}
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-100 p-4 bg-white shrink-0">
                    {activeTab === 'info' ? (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                            사용자가 "ℹ️ 국민취업지원제도란?" 버튼을 클릭했을 때 나타나는 안내 메시지입니다. 내용을 비우면 하드코딩된 기본 텍스트가 사용됩니다.
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                            AI가 최종 참여 유형을 판별할 때 기준이 되는 규정집 텍스트입니다. 내용을 비우면 하드코딩된 기본 텍스트가 사용됩니다.
                        </p>
                    )}
                </div>

                <div className="flex-1 p-0 relative bg-gray-50">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
                                데이터를 불러오는 중...
                            </div>
                        </div>
                    )}

                    {activeTab === 'info' ? (
                        <textarea
                            value={nessInfo}
                            onChange={(e) => setNessInfo(e.target.value)}
                            disabled={isLoading || isSaving}
                            className="w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed text-gray-900 bg-white focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                            placeholder="안내 텍스트를 입력하세요. 비워두면 기본 시스템 텍스트가 노출됩니다."
                            spellCheck="false"
                        />
                    ) : (
                        <textarea
                            value={regulationInfo}
                            onChange={(e) => setRegulationInfo(e.target.value)}
                            disabled={isLoading || isSaving}
                            className="w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed text-gray-900 bg-white focus:ring-2 focus:ring-inset focus:ring-amber-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
                            placeholder="AI가 참조할 규정 텍스트를 입력하세요. 비워두면 기본 시스템 텍스트가 참조됩니다."
                            spellCheck="false"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
