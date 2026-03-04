'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Loader2, Save, LayoutTemplate, MessageSquare, Database } from 'lucide-react';

type PromptKey =
    | 'system_prompt'
    | 'median_income_table'
    | 'score_table'
    | 'static_questions'
    | 'location_step_message'
    | 'intro_message'
    | 'info_message';

export default function PromptsSettingsPage() {
    const [activeTab, setActiveTab] = useState<PromptKey>('system_prompt');

    const [settingsData, setSettingsData] = useState<Record<PromptKey, string>>({
        system_prompt: '',
        median_income_table: '',
        score_table: '',
        static_questions: '',
        location_step_message: '',
        intro_message: '',
        info_message: '',
    });

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
                setSettingsData({
                    system_prompt: data.settings.system_prompt || '',
                    median_income_table: data.settings.median_income_table || '',
                    score_table: data.settings.score_table || '',
                    static_questions: data.settings.static_questions || '',
                    location_step_message: data.settings.location_step_message || '',
                    intro_message: data.settings.intro_message || '',
                    info_message: data.settings.info_message || '',
                });
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
            const targetValue = settingsData[activeTab];

            // JSON 탭들의 경우 유효성 검사 (비워둔 경우는 제외)
            if (['static_questions', 'location_step_message', 'intro_message', 'info_message'].includes(activeTab) && targetValue.trim() !== '') {
                try {
                    JSON.parse(targetValue);
                } catch (e) {
                    alert('유효하지 않은 JSON 형식입니다. 저장하기 전에 다시 확인해주세요.');
                    setIsSaving(false);
                    return;
                }
            }

            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: activeTab, value: targetValue })
            });
            const data = await res.json();

            if (data.success) {
                alert('프롬프트 변경사항이 성공적으로 업데이트되었습니다.');
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

    const handleTextChange = (val: string) => {
        setSettingsData(prev => ({
            ...prev,
            [activeTab]: val
        }));
    };

    const tabs: { key: PromptKey; label: string; icon: React.ReactNode; desc: string }[] = [
        { key: 'system_prompt', label: '시스템 프롬프트', icon: <Bot size={16} />, desc: '챗봇의 기본 역할 및 페르소나를 정의합니다.' },
        { key: 'median_income_table', label: '중위소득표', icon: <Database size={16} />, desc: '참여 유형 판별에 사용되는 연도별 가구 중위소득 기준표입니다.' },
        { key: 'score_table', label: '점수표', icon: <Database size={16} />, desc: '선발형 등 판별 시 계산 근거로 활용되는 점수 부여표입니다.' },
        { key: 'static_questions', label: '질문 시나리오(JSON)', icon: <MessageSquare size={16} />, desc: '챗봇이 사용자에게 묻는 객관식 및 주관식 질문 배열 정보 (JSON) 입니다.' },
        { key: 'intro_message', label: '인트로 메시지(JSON)', icon: <LayoutTemplate size={16} />, desc: '챗봇 접속 시 나타나는 초기 인사 및 안내 메시지 데이터입니다.' },
        { key: 'info_message', label: '안내 메시지(JSON)', icon: <LayoutTemplate size={16} />, desc: '제도 안내 클릭 시 출력되는 추가 부가정보 메시지 데이터 구조입니다.' },
        { key: 'location_step_message', label: '거주지 메시지(JSON)', icon: <LayoutTemplate size={16} />, desc: '거주 지역을 물을 때 출력되는 텍스트 데이터 구조입니다.' },
    ];

    const currentTabInfo = tabs.find(t => t.key === activeTab);

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">프롬프트 및 시나리오 관리</h1>
                <p className="text-gray-500 mt-1">챗봇의 모든 정적 프롬프트, 템플릿, 질문 시나리오를 통합하여 관리합니다.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[600px]">
                {/* 좌측 탭 리스트 */}
                <div className="lg:w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="bg-gray-50 py-4 px-5 border-b border-gray-100 font-semibold text-gray-700">관리 항목</div>
                    <div className="flex-1 overflow-y-auto w-full flex flex-row lg:flex-col custom-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-3 px-5 py-4 w-full text-left font-medium text-sm transition-colors border-l-4 lg:border-l-4 lg:border-b-0 border-b-4 shrink-0 whitespace-nowrap lg:whitespace-normal ${activeTab === tab.key
                                        ? 'border-purple-600 text-purple-700 bg-purple-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 우측 에디터 영역 */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-w-0">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 shrink-0 flex justify-between items-center h-16">
                        <div>
                            <span className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                {currentTabInfo?.icon}
                                {currentTabInfo?.label}
                            </span>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                            현재 탭 변경사항 저장
                        </button>
                    </div>

                    <div className="bg-white px-6 py-3 border-b border-gray-100 shrink-0">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-purple-500"></span>
                            {currentTabInfo?.desc} 내용을 비워두면 하드코딩된 기본 시나리오/프롬프트가 적용됩니다. JSON 항목은 올바른 문법을 유지해야 합니다.
                        </p>
                    </div>

                    <div className="flex-1 p-0 relative bg-gray-50 min-h-0">
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <Loader2 className="animate-spin w-6 h-6 text-purple-600" />
                                    데이터 불러오는 중...
                                </div>
                            </div>
                        )}
                        <textarea
                            value={settingsData[activeTab]}
                            onChange={(e) => handleTextChange(e.target.value)}
                            disabled={isLoading || isSaving}
                            className={`w-full h-full p-6 resize-none outline-none font-mono text-sm leading-relaxed text-gray-900 bg-white focus:ring-2 focus:ring-inset focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500 transition-colors ${['static_questions', 'location_step_message', 'intro_message', 'info_message'].includes(activeTab) ? 'whitespace-pre text-[13px]' : ''
                                }`}
                            placeholder="내용을 입력하세요. 비워두면 시스템 기본값이 사용됩니다."
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
