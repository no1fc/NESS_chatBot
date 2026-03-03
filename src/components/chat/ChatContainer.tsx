'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChoiceChips from './ChoiceChips';
import IncomeTable from './IncomeTable';
import LoadingIndicator from './LoadingIndicator';
import ProgressBar from './ProgressBar';
import ResultCard from '@/components/result/ResultCard';
import BranchCard from '@/components/result/BranchCard';
import ProcedureCard from './ProcedureCard';
import RegionSelector from './RegionSelector';
import { Branch } from '@/lib/db';

export default function ChatContainer() {
    const {
        messages,
        isLoading,
        currentStep,
        totalSteps,
        phase,
        result,
        showIncomeTable,
        sendChoice,
        sendText,
        startChat,
    } = useChat();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [branch, setBranch] = useState<Branch | null | 'loading' | 'none'>('none');
    const [showRegionSelector, setShowRegionSelector] = useState<boolean>(false);

    useEffect(() => {
        startChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, showRegionSelector, branch]);

    const handleRegionSelect = async (sido: string, sigungu: string) => {
        setBranch('loading');
        setShowRegionSelector(false);

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

    const lastAIMessage = [...messages].reverse().find((m) => m.role === 'ai');
    const currentChoices = lastAIMessage?.choices ?? [];

    const showInput =
        !isLoading &&
        phase !== 'result' &&
        phase !== 'ended' &&
        branch === 'none' &&
        currentChoices.length > 0;

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* 진행률 바 (상단 고정 - 헤더 아래) */}
            <div className="sticky top-[80px] z-10">
                {(phase === 'questioning' || phase === 'analyzing' || phase === 'result') && (
                    <ProgressBar current={phase === 'questioning' ? currentStep : totalSteps} total={totalSteps} />
                )}
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto">
                <div className="chat-container-width px-6 pt-16 pb-80">
                    <div className="space-y-12">
                        {messages.map((message, index) => (
                            <div key={message.id}>
                                <ChatMessage
                                    message={message}
                                    isLatest={index === messages.length - 1}
                                />
                                {index === 0 && phase !== 'intro' && (
                                    <div className="pl-12">
                                        <ProcedureCard />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="pl-12">
                                <LoadingIndicator mode={phase === 'analyzing' ? 'analyzing' : 'bubble'} />
                            </div>
                        )}

                        {showIncomeTable && !isLoading && phase === 'questioning' && (
                            <div className="pl-12">
                                <IncomeTable />
                            </div>
                        )}

                        {phase === 'result' && result && !showRegionSelector && branch === 'none' && (
                            <div className="animate-reveal-up pl-12">
                                <ResultCard
                                    result={result}
                                    onSelectRegion={() => setShowRegionSelector(true)}
                                />
                            </div>
                        )}

                        {showRegionSelector && (
                            <div className="pl-12">
                                <RegionSelector
                                    onSelect={handleRegionSelect}
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        {branch !== 'none' && branch !== 'loading' && result && (
                            <div className="animate-reveal-up pl-12">
                                <BranchCard branch={branch} diagnosisType={result.type} />
                            </div>
                        )}
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
