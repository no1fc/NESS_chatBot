/**
 * ChatContainer 컴포넌트
 * 챗봇의 전체 UI를 조립하는 핵심 컨테이너 컴포넌트입니다.
 * useChat 훅과 모든 하위 컴포넌트를 통합합니다.
 * 메시지 목록, 입력 영역(선택지/텍스트/지역선택), 결과 카드를 순차적으로 렌더링합니다.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import ChatMessage from './ChatMessage';
import ChoiceChips from './ChoiceChips';
import LoadingIndicator from './LoadingIndicator';
import ProgressBar from './ProgressBar';
import RegionSelector from './RegionSelector';
import ResultCard from '@/components/result/ResultCard';
import BranchCard from '@/components/result/BranchCard';
import { Branch } from '@/lib/db';

/**
 * ChatContainer 컴포넌트
 * 챗봇 페이지의 핵심 UI를 조립합니다.
 * 헤더(ProgressBar), 메시지 영역, 입력/결과 영역으로 구성됩니다.
 */
export default function ChatContainer() {
    const {
        messages,
        isLoading,
        currentStep,
        totalSteps,
        phase,
        result,
        sendChoice,
        sendText,
        startChat,
    } = useChat();

    // 메시지 영역 ref (자동 스크롤용)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // 지점 조회 결과 상태 (null: 미조회, Branch: 지점 있음, 'none': 지점 없음)
    const [branch, setBranch] = useState<Branch | null | 'loading' | 'none'>('none');
    // 지역 선택 단계 활성화 여부 (result 이후 버튼 클릭 시)
    const [showRegionSelector, setShowRegionSelector] = useState<boolean>(false);

    // 컴포넌트 마운트 시 챗봇 자동 시작
    useEffect(() => {
        startChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 새 메시지 추가 시 스크롤 맨 아래로
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, showRegionSelector, branch]);

    /**
     * 지역 선택 완료 핸들러
     * API에서 지점 정보 조회 후 BranchCard 표시
     */
    const handleRegionSelect = async (sido: string, sigungu: string) => {
        setBranch('loading');
        setShowRegionSelector(false);

        try {
            // 지점 조회 API 호출
            const response = await fetch(
                `/api/branches?sido=${encodeURIComponent(sido)}&sigungu=${encodeURIComponent(sigungu)}`
            );
            const data = await response.json();

            if (data.branch) {
                setBranch(data.branch as Branch); // 지점 있음
            } else {
                setBranch(null); // 지점 없음 → 고용24 안내
            }
        } catch (error) {
            console.error('지점 조회 오류:', error);
            setBranch(null); // 오류 시 고용24 안내로 폴백
        }
    };

    // 가장 최근 AI 메시지의 선택지 (입력 영역에 표시)
    const lastAIMessage = [...messages].reverse().find((m) => m.role === 'ai');
    const currentChoices = lastAIMessage?.choices ?? [];

    // 입력 영역 표시 여부 (로딩 중, 결과 이후, 지역 선택 완료 시 숨김)
    const showInput =
        !isLoading &&
        phase !== 'result' &&
        phase !== 'ended' &&
        branch === 'none' &&
        currentChoices.length > 0;

    return (
        <div
            className="flex flex-col chat-page-height"
            style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)' }}
        >
            {/* ============================
          상단 헤더 영역 (고정)
      *  진행률 바 포함
      ============================ */}
            <div className="sticky top-0 z-10">
                {/* 진행률 바 (questioning 단계에서만 표시) */}
                {phase === 'questioning' && (
                    <ProgressBar current={currentStep} total={totalSteps} />
                )}
                {/* analyzing/result 단계: 완료 표시 */}
                {(phase === 'analyzing' || phase === 'result') && (
                    <ProgressBar current={totalSteps} total={totalSteps} />
                )}
            </div>

            {/* ============================
          메시지 영역 (스크롤)
      ============================ */}
            <div
                className="flex-1 overflow-y-auto px-4 py-4"
                style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                role="log"
                aria-label="대화 내역"
                aria-live="polite"
            >
                {/* 메시지 목록 렌더링 */}
                {messages.map((message, index) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isLatest={index === messages.length - 1}
                    />
                ))}

                {/* 로딩 인디케이터 */}
                {isLoading && phase !== 'analyzing' && (
                    <LoadingIndicator mode="bubble" />
                )}
                {isLoading && phase === 'analyzing' && (
                    <LoadingIndicator mode="analyzing" />
                )}

                {/* 진단 결과 카드 (result 단계에서만 표시) */}
                {phase === 'result' && result && !showRegionSelector && branch === 'none' && (
                    <ResultCard
                        result={result}
                        onSelectRegion={() => setShowRegionSelector(true)}
                    />
                )}

                {/* 지역 선택기 */}
                {showRegionSelector && (
                    <RegionSelector
                        onSelect={handleRegionSelect}
                        disabled={isLoading}
                    />
                )}

                {/* 지점 조회 로딩 */}
                {branch === 'loading' && (
                    <div className="flex items-center justify-center gap-2 py-4">
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                border: '3px solid var(--color-primary-subtle)',
                                borderTopColor: 'var(--color-primary)',
                                borderRadius: '50%',
                                animation: 'spin 0.8s linear infinite',
                            }}
                        />
                        <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                            지점 정보를 조회하고 있습니다...
                        </span>
                    </div>
                )}

                {/* 지점 카드 (조회 완료 시) */}
                {branch !== 'none' && branch !== 'loading' && result && (
                    <BranchCard branch={branch} diagnosisType={result.type} />
                )}

                {/* 스크롤 앵커 */}
                <div ref={messagesEndRef} />
            </div>

            {/* ============================
          입력 영역 (하단 고정)
      * 선택지 칩 or 텍스트 입력
      ============================ */}
            {showInput && (
                <div
                    className="sticky bottom-0 px-4 py-3"
                    style={{
                        background: 'white',
                        borderTop: '1px solid var(--color-gray-200)',
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
                    }}
                >
                    <ChoiceChips
                        choices={currentChoices}
                        onSelect={sendChoice}
                        onTextSubmit={sendText}
                        disabled={isLoading}
                    />
                </div>
            )}
        </div>
    );
}
