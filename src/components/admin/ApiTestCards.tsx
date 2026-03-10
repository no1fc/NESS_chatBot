"use client";

import React, { useState } from 'react';
import { Cpu, Map as MapIcon, CheckCircle2, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface ApiTestCardsProps {
    initialGeminiStatus: boolean;
    initialKakaoStatus: boolean;
    geminiKey: string | null;
    kakaoKeys: string[];
}

export default function ApiTestCards({ 
    initialGeminiStatus, 
    initialKakaoStatus, 
    geminiKey, 
    kakaoKeys 
}: ApiTestCardsProps) {
    const [geminiStatus, setGeminiStatus] = useState<'success' | 'error' | 'idle' | 'testing'>(
        initialGeminiStatus ? 'success' : 'error'
    );
    const [kakaoStatus, setKakaoStatus] = useState<'success' | 'error' | 'idle' | 'testing'>(
        initialKakaoStatus ? 'success' : 'error'
    );
    const [geminiMessage, setGeminiMessage] = useState<string>('');
    const [kakaoMessage, setKakaoMessage] = useState<string>('');

    // Gemini API 테스트 함수
    const testGeminiApi = async () => {
        if (!geminiKey) {
            setGeminiStatus('error');
            setGeminiMessage('DB 및 환경변수에 Gemini API Key가 없습니다.');
            return;
        }

        setGeminiStatus('testing');
        setGeminiMessage('테스트 요청 중...');

        try {
            const response = await fetch('/api/admin/test-gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: geminiKey }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setGeminiStatus('success');
                setGeminiMessage('정상 연동 확인 완료');
            } else {
                setGeminiStatus('error');
                setGeminiMessage(data.message || 'API 호출에 실패했습니다.');
            }
        } catch (error: any) {
            setGeminiStatus('error');
            setGeminiMessage(error.message || '네트워크 오류가 발생했습니다.');
        }
    };

    // Kakao Map API 테스트 함수 (클라이언트 단 SDK 호출 테스트)
    const testKakaoApi = async () => {
        if (!kakaoKeys || kakaoKeys.length === 0) {
            setKakaoStatus('error');
            setKakaoMessage('등록된 Kakao Map API Key가 없습니다.');
            return;
        }

        setKakaoStatus('testing');
        setKakaoMessage('첫 번째 Key로 로드 테스트 중...');

        try {
            const activeKey = kakaoKeys[0];
            
            // 이미 로드되어 있다면 성공 처리
            if (window.kakao && window.kakao.maps) {
                setKakaoStatus('success');
                setKakaoMessage('SDK 이미 호출 상태. 정상 동작');
                return;
            }

            // 스크립트 객체 생성하여 로드 시도
            const scriptId = 'kakao-map-script-test';
            let script = document.getElementById(scriptId) as HTMLScriptElement;

            if (script) {
                document.head.removeChild(script);
            }

            script = document.createElement('script');
            script.id = scriptId;
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${activeKey}&libraries=services&autoload=false`;
            script.async = true;

            const scriptLoadPromise = new Promise((resolve, reject) => {
                script.onload = () => resolve(true);
                script.onerror = () => reject(new Error('Kakao Maps SDK 스크립트 로드 실패'));
            });

            document.head.appendChild(script);

            await scriptLoadPromise;

            // 로드 후 바로 객체 확인
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    setKakaoStatus('success');
                    setKakaoMessage('정상 연동 확인 완료');
                });
            } else {
                throw new Error('객체를 초기화할 수 없습니다.');
            }

        } catch (error: any) {
            setKakaoStatus('error');
            setKakaoMessage(error.message || 'Kakao API 연동 실패');
        }
    };

    return (
        <>
            {/* Gemini API Test Card */}
            <div className={`border rounded-xl p-6 flex flex-col justify-between transition-colors ${geminiStatus === 'success' ? 'bg-purple-50 border-purple-100' : geminiStatus === 'error' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`${geminiStatus === 'success' ? 'text-purple-800' : geminiStatus === 'error' ? 'text-red-800' : 'text-gray-800'} font-medium`}>Gemini API</h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${geminiStatus === 'success' ? 'bg-purple-100 text-purple-600' : geminiStatus === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                        <Cpu size={20} />
                    </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                        {geminiStatus === 'success' ? (
                            <><CheckCircle2 size={24} className="text-purple-600" /><span className="text-2xl font-bold text-purple-600">안정적</span></>
                        ) : geminiStatus === 'error' ? (
                            <><AlertCircle size={24} className="text-red-600" /><span className="text-2xl font-bold text-red-600">오류</span></>
                        ) : (
                            <><Loader2 size={24} className="text-blue-500 animate-spin" /><span className="text-2xl font-bold text-gray-700">검사 중</span></>
                        )}
                    </div>
                    <button 
                        onClick={testGeminiApi}
                        disabled={geminiStatus === 'testing'}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                        title="API 연결 테스트"
                    >
                        <RefreshCw size={20} className={`text-gray-600 ${geminiStatus === 'testing' ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                {geminiMessage && (
                    <p className={`text-xs mt-3 ${geminiStatus === 'success' ? 'text-purple-600' : geminiStatus === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
                        {geminiMessage}
                    </p>
                )}
            </div>

            {/* Kakao Map API Test Card */}
            <div className={`border rounded-xl p-6 flex flex-col justify-between transition-colors ${kakaoStatus === 'success' ? 'bg-amber-50 border-amber-100' : kakaoStatus === 'error' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`${kakaoStatus === 'success' ? 'text-amber-800' : kakaoStatus === 'error' ? 'text-red-800' : 'text-gray-800'} font-medium`}>Kakao MAP API</h3>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${kakaoStatus === 'success' ? 'bg-amber-100 text-amber-600' : kakaoStatus === 'error' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                        <MapIcon size={20} />
                    </div>
                </div>
                
                <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                        {kakaoStatus === 'success' ? (
                            <><CheckCircle2 size={24} className="text-amber-600" /><span className="text-2xl font-bold text-amber-600">안정적</span></>
                        ) : kakaoStatus === 'error' ? (
                            <><AlertCircle size={24} className="text-red-600" /><span className="text-2xl font-bold text-red-600">오류</span></>
                        ) : (
                            <><Loader2 size={24} className="text-blue-500 animate-spin" /><span className="text-2xl font-bold text-gray-700">검사 중</span></>
                        )}
                    </div>
                    <button 
                        onClick={testKakaoApi}
                        disabled={kakaoStatus === 'testing'}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                        title="API 연결 테스트"
                    >
                        <RefreshCw size={20} className={`text-gray-600 ${kakaoStatus === 'testing' ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                {kakaoMessage && (
                    <p className={`text-xs mt-3 ${kakaoStatus === 'success' ? 'text-amber-600' : kakaoStatus === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
                        {kakaoMessage}
                    </p>
                )}
            </div>
        </>
    );
}
