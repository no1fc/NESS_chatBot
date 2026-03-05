'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChoiceChips from './ChoiceChips';
import IncomeTable from './IncomeTable';
import RetryButton from './RetryButton';
import LoadingIndicator from './LoadingIndicator';
import ProgressBar from './ProgressBar';
import ResultCard from '@/components/result/ResultCard';
import BranchCard from '@/components/result/BranchCard';
import RegionSelector from './RegionSelector';
import { Branch } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';

export default function ChatContainer() {
    const {
        messages,
        isLoading,
        currentStep,
        totalSteps,
        phase,
        result,
        isError,
        showIncomeTable,
        canGoBack,
        sendChoice,
        sendText,
        goBack,
        retry,
        startChat,
    } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);
    const [branch, setBranch] = useState<Branch | null | 'loading' | 'none'>('none');

    useEffect(() => {
        startChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // 결과 화면일 경우 결과 카드 상단으로 스크롤 고정
        if (phase === 'result' && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, branch, phase]);

    const handleRegionSelect = async (sido: string, sigungu: string) => {
        setBranch('loading');

        try {
            const response = await fetch(
                `/api/branches?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`
            );
            const data = await response.json();

            if (data.branch) {
                setBranch(data.branch as Branch);
            } else {
                setBranch(null);
            }
        } catch (error) {
            console.error('지점 조회 오류:', error);
            setBranch(null);
        }
    };

    useEffect(() => {
        if (phase === 'result' && branch === 'none' && result && result.type !== '제한') {
            const firstUserMessage = messages.find((m) => m.role === 'user');
            if (firstUserMessage) {
                const parts = firstUserMessage.content.split(' ');
                if (parts.length >= 2) {
                    handleRegionSelect(parts[0], parts.slice(1).join(' '));
                }
            }
        }
    }, [phase, result, branch, messages]);

    const lastAIMessage = [...messages].reverse().find((m) => m.role === 'ai');
    const currentChoices = lastAIMessage?.choices ?? [];

    // 현재 질문이 지역 선택형인지 확인 (1단계)
    const isRegionStep = phase === 'questioning' && currentStep === 1;

    const showInput =
        !isLoading &&
        !isError &&
        !isRegionStep &&
        phase !== 'result' &&
        phase !== 'ended' &&
        branch === 'none' &&
        currentChoices.length > 0;

    return (
        <div className="flex flex-col h-full bg-transparent relative">
            {/* 진행률 바 & 상단 컨트롤 (상단 고정 - 헤더 아래) */}
            <div className="sticky top-[80px] z-10">
                {(phase === 'questioning' || phase === 'analyzing' || phase === 'result') && (
                    <ProgressBar current={phase === 'questioning' ? currentStep : totalSteps} total={totalSteps} />
                )}

                {/* 이전으로 돌아가기 버튼 (진행률 바 아래에 위치 - result 단계에서는 숨김) */}
                {canGoBack && !isLoading && phase !== 'result' && (
                    <div className="absolute left-6 top-8 z-20">
                        <button
                            onClick={goBack}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            이전
                        </button>
                    </div>
                )}
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto">
                <div className="chat-container-width px-6 pt-24 pb-100">
                    <div className="space-y-12">
                        {messages.map((message, index) => (
                            <div key={message.id}>
                                <ChatMessage
                                    message={message}
                                    isLatest={index === messages.length - 1}
                                />
                                {index === messages.length - 1 && showIncomeTable && !isLoading && phase === 'questioning' && message.role === 'ai' && (
                                    <div className="mt-4">
                                        <IncomeTable />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="">
                                <LoadingIndicator mode={phase === 'analyzing' ? 'analyzing' : 'bubble'} />
                            </div>
                        )}

                        {phase === 'result' && result && (
                            <div className="animate-reveal-up" ref={resultRef}>
                                <ResultCard result={result} />
                            </div>
                        )}

                        {isRegionStep && (
                            <div className="animate-reveal-up pb-10">
                                <RegionSelector
                                    onSelect={(sido, sigungu) => {
                                        // 질문 단계에서의 지역 선택: useChat의 sendText 호출
                                        sendText(`${sido} ${sigungu}`);
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        {branch !== 'none' && branch !== 'loading' && result && (
                            <div className="animate-reveal-up">
                                <BranchCard branch={branch} diagnosisType={result.type} />
                            </div>
                        )}

                        {/* 재시도 버튼 (에러 발생 시) */}
                        {isError && <RetryButton onRetry={retry} />}
                    </div>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 입력 영역 - 하단 고정 플로팅 필 */}
            {showInput && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 z-20">
                    <div className="floating-pill rounded-[2rem] p-4">
                        <ChoiceChips
                            choices={currentChoices}
                            onSelect={sendChoice}
                            onTextSubmit={sendText}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
