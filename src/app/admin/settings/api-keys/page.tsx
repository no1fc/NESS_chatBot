'use client';

import React, { useState, useEffect } from 'react';
import { KeyRound, Loader2, Save, Trash2, Plus, Cpu, Map as MapIcon, Calculator } from 'lucide-react';

interface ApiGroupProps {
    title: string;
    description: string;
    settingKey: string;
    icon: React.ReactNode;
    keys: string[];
    onAdd: (settingKey: string, value: string) => Promise<void>;
    onDelete: (settingKey: string, index: number) => Promise<void>;
}

function ApiGroup({ title, description, settingKey, icon, keys, onAdd, onDelete }: ApiGroupProps) {
    const [newKey, setNewKey] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKey.trim()) return;
        setIsSaving(true);
        await onAdd(settingKey, newKey.trim());
        setNewKey('');
        setIsSaving(false);
    };

    const handleDelete = async (index: number) => {
        if (!window.confirm('이 API Key를 삭제하시겠습니까?')) return;
        await onDelete(settingKey, index);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-1">
                        {icon}
                        {title}
                    </div>
                    <p className="text-gray-500 text-sm">{description}</p>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">등록된 API Keys (보안 처리됨)</h3>
                    {keys.length === 0 ? (
                        <div className="text-gray-500 text-sm py-4 text-center border rounded-lg bg-gray-50 border-dashed">
                            등록된 API Key가 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {keys.map((k, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${idx === 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                                            {idx === 0 ? '메인 Key' : `예비 Key ${idx}`}
                                        </span>
                                        <code className="text-sm text-gray-600 font-mono break-all line-clamp-1">
                                            {k}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors flex-shrink-0 ml-2"
                                        title="삭제"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <hr className="border-gray-100" />

                <form onSubmit={handleAdd} className="flex items-start gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={newKey}
                            onChange={(e) => setNewKey(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-gray-900 bg-white"
                            placeholder="새로운 API Key를 입력하세요..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSaving || !newKey.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
                    >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus size={18} />}
                        키 추가
                    </button>
                </form>
            </div>
        </div>
    );
}

const GEMINI_PRICING: Record<string, { label: string, inputRate: number, outputRate: number }> = {
    'gemini-3.1-pro-preview': { label: 'Gemini 3.1 Pro Preview', inputRate: 2.00, outputRate: 12.00 },
    'gemini-3.1-flash-preview': { label: 'Gemini 3.1 Flash Preview', inputRate: 0.50, outputRate: 3.00 },
    'gemini-3.1-flash-lite-preview': { label: 'Gemini 3.1 Flash-Lite Preview', inputRate: 0.25, outputRate: 1.50 },
    'gemini-2.5-pro': { label: 'Gemini 2.5 Pro', inputRate: 1.25, outputRate: 10.00 },
    'gemini-2.5-flash': { label: 'Gemini 2.5 Flash', inputRate: 0.30, outputRate: 2.50 },
    'gemini-2.5-flash-lite': { label: 'Gemini 2.5 Flash-Lite', inputRate: 0.10, outputRate: 0.40 },
};

export default function ApiKeysSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [geminiKeys, setGeminiKeys] = useState<string[]>([]);
    const [kakaoKeys, setKakaoKeys] = useState<string[]>([]);
    const [geminiModel, setGeminiModel] = useState<string>('gemini-2.5-flash');
    const [isSavingModel, setIsSavingModel] = useState(false);
    const [inputTokens, setInputTokens] = useState<number>(1);
    const [outputTokens, setOutputTokens] = useState<number>(1);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.success && data.settings) {
                // 배열 형태 파싱
                const parseStringArray = (val: string) => {
                    if (!val) return [];
                    try {
                        const parsed = JSON.parse(val);
                        if (Array.isArray(parsed)) return parsed;
                    } catch (e) {
                        // Fallback for non-JSON content
                    }
                    return [];
                };

                setGeminiKeys(parseStringArray(data.settings.gemini_api_keys_masked));
                setKakaoKeys(parseStringArray(data.settings.kakao_map_api_keys_masked));
                if (data.settings.gemini_model_name) {
                    setGeminiModel(data.settings.gemini_model_name);
                }
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newModel = e.target.value;
        setGeminiModel(newModel);
        setIsSavingModel(true);

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'gemini_model_name', value: newModel })
            });
            const data = await res.json();

            if (!data.success) {
                alert(data.error || '모델 설정 저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Model change error:', error);
            alert('설정 저장 중 네트워크 오류가 발생했습니다.');
        } finally {
            setIsSavingModel(false);
        }
    };

    const handleAddKey = async (settingKey: string, value: string) => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: settingKey, value, action: 'add' })
            });
            const data = await res.json();

            if (data.success) {
                await fetchSettings();
            } else {
                alert(data.error || '저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Add error:', error);
            alert('저장 중 네트워크 오류가 발생했습니다.');
        }
    };

    const handleDeleteKey = async (settingKey: string, index: number) => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: settingKey, action: 'delete', index })
            });
            const data = await res.json();

            if (data.success) {
                await fetchSettings();
            } else {
                alert(data.error || '삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 중 네트워크 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-gray-500">
                <Loader2 className="animate-spin w-8 h-8 mr-3 text-blue-600" />
                <span>API 설정 정보를 불러오는 중입니다...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-6 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">통합 API Key 관리</h1>
                <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed">
                    시스템 전반(Gemini AI 및 카카오 지도 연동)에 사용되는 외부 서비스 API Key를 관리합니다.<br />
                    첫 번째로 등록된 Key가 메인으로 사용되며, 이후 등록된 Key들은 예비(Fallback) 용도로 사용됩니다.
                </p>
            </div>

            <div className="mt-8">
                {/* Gemini Model Selection & Cost Calculator */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-gray-800 font-bold text-lg mb-1">
                                <Cpu className="text-blue-600" size={22} />
                                Gemini 생성 모델 선택
                            </div>
                            <p className="text-gray-500 text-sm">기본적으로 사용할 Gemini AI 버전을 선택하고 비용을 예상해보세요.</p>
                        </div>
                        <div className="flex items-center">
                            {isSavingModel && <span className="text-sm text-blue-600 mr-3 flex items-center"><Loader2 className="w-4 h-4 animate-spin mr-1" /> 저장 중...</span>}
                            <select
                                value={geminiModel}
                                onChange={handleModelChange}
                                disabled={isSavingModel}
                                className="px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white font-medium cursor-pointer shadow-sm"
                            >
                                <option value="" disabled className="text-gray-400">모델을 선택하세요</option>
                                {Object.entries(GEMINI_PRICING).map(([key, info]) => (
                                    <option key={key} value={key}>{info.label}</option>
                                ))}
                                {/* 이전 모델 호환성 유지 */}
                                {!Object.keys(GEMINI_PRICING).includes(geminiModel) && geminiModel !== '' && (
                                    <option value={geminiModel}>{geminiModel} (레거시)</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Cost Calculator Section */}
                    {GEMINI_PRICING[geminiModel] && (
                        <div className="p-6 bg-white">
                            <div className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                                <Calculator className="text-emerald-500" size={18} />
                                예상 비용 계산기 (100만 토큰 기준 단가적용)
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">예상 월별 입력 (백만 토큰)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={inputTokens}
                                            onChange={(e) => setInputTokens(parseFloat(e.target.value) || 0)}
                                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">M</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">단가: ${GEMINI_PRICING[geminiModel].inputRate.toFixed(2)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">예상 월별 출력 (백만 토큰)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={outputTokens}
                                            onChange={(e) => setOutputTokens(parseFloat(e.target.value) || 0)}
                                            className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">M</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">단가: ${GEMINI_PRICING[geminiModel].outputRate.toFixed(2)}</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex flex-col justify-center items-center">
                                    <span className="text-sm font-medium text-emerald-800 mb-1">월별 예상 환산 금액</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        ${((inputTokens * GEMINI_PRICING[geminiModel].inputRate) + (outputTokens * GEMINI_PRICING[geminiModel].outputRate)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <ApiGroup
                    title="Google Gemini API (AI)"
                    description="NESS 챗봇 구동 및 AI 텍스트 생성에 사용되는 구글 제미나이 API Key 배열입니다."
                    settingKey="gemini_api_keys"
                    icon={<Cpu className="text-purple-600" size={22} />}
                    keys={geminiKeys}
                    onAdd={handleAddKey}
                    onDelete={handleDeleteKey}
                />

                <ApiGroup
                    title="Kakao Maps API (지도 연동)"
                    description="지점 위치 정보 조회 및 지도 렌더링에 사용되는 카카오 자바스크립트 API Key 배열입니다."
                    settingKey="kakao_map_api_keys"
                    icon={<MapIcon className="text-amber-500" size={22} />}
                    keys={kakaoKeys}
                    onAdd={handleAddKey}
                    onDelete={handleDeleteKey}
                />
            </div>
        </div>
    );
}
