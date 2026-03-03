/**
 * useChat 커스텀 훅
 * 챗봇의 전체 상태 관리, API 통신, 단계 진행을 담당하는 핵심 훅입니다.
 * ChatContainer 컴포넌트에서 사용됩니다.
 */

'use client';

import { useState, useCallback } from 'react';

// ====================================
// 타입 정의
// ====================================

/** 선택지 타입 */
export interface Choice {
    id: string;
    label: string;
    value: string;
    isOther?: boolean; // '기타' 선택지 여부
}

/** 챗 메시지 타입 */
export interface Message {
    id: string;            // 고유 ID (crypto.randomUUID 또는 timestamp)
    role: 'ai' | 'user';  // 발신자 역할
    content: string;       // 메시지 내용
    choices?: Choice[];    // AI 메시지의 선택지 (있을 경우)
    timestamp: Date;       // 생성 시각
}

/** 진단 결과 타입 */
export interface DiagnosisResult {
    type: '1유형_요건심사형' | '1유형_선발형' | '2유형' | '제한';
    score?: number | null;
    scoreDetails?: string[];
    description: string;
    subType?: string | null;
    tips?: string[];
    restrictReason?: string | null;
}

/** 챗봇 단계 타입 */
export type ChatPhase = 'intro' | 'questioning' | 'analyzing' | 'location' | 'result' | 'ended';

/** useChat 훅 반환값 타입 */
export interface UseChatReturn {
    messages: Message[];
    isLoading: boolean;
    currentStep: number;
    totalSteps: number;
    isError: boolean;
    showIncomeTable: boolean; // 중위소득 기준표 표시 여부
    sendChoice: (choice: Choice) => Promise<void>;
    sendText: (text: string) => Promise<void>;
    retry: () => Promise<void>;
    startChat: () => Promise<void>;
    resetChat: () => void;
}

// ====================================
// 헬퍼 함수
// ====================================

/**
 * 고유 메시지 ID 생성 함수
 * crypto.randomUUID 미지원 브라우저 대응
 */
function generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * AI 메시지 객체 생성 헬퍼
 */
function createAIMessage(content: string, choices?: Choice[]): Message {
    return {
        id: generateId(),
        role: 'ai',
        content,
        choices,
        timestamp: new Date(),
    };
}

/**
 * 사용자 메시지 객체 생성 헬퍼
 */
function createUserMessage(content: string): Message {
    return {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
    };
}

// ====================================
// useChat 훅 본체
// ====================================
/**
 * 챗봇 상태 관리 커스텀 훅
 * 메시지 목록, 로딩 상태, 단계 진행, API 통신을 통합 관리합니다.
 */
export function useChat(): UseChatReturn {
    // 메시지 목록 상태
    const [messages, setMessages] = useState<Message[]>([]);
    // AI 응답 대기 상태
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // 현재 질문 단계 (0: 시작 전, 1~5: 질문 진행 중)
    const [currentStep, setCurrentStep] = useState<number>(0);
    // 전체 질문 단계 수
    const [totalSteps] = useState<number>(8);
    // 현재 챗봇 진행 단계
    const [phase, setPhase] = useState<ChatPhase>('intro');
    // 수집된 사용자 답변 (유형 판별에 사용)
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    // 대화 히스토리 (API 전송용)
    const [history, setHistory] = useState<Array<{ role: 'user' | 'model'; content: string }>>([]);
    // 최종 진단 결과
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    // 중위소득 기준표 표시 여부 (소득 관련 질문 시 true)
    const [showIncomeTable, setShowIncomeTable] = useState<boolean>(false);
    // 에러 상태 (재시도 버튼 노출용)
    const [isError, setIsError] = useState<boolean>(false);
    // 마지막 작업 저장 (재시도용)
    const [lastAction, setLastAction] = useState<{
        type: 'choice' | 'text' | 'analysis';
        data: any;
    } | null>(null);

    /**
     * /api/chat 호출 공통 함수
     * @param currentPhase - 전송할 단계
     * @param newHistory - 업데이트된 대화 히스토리
     * @param answers - 현재까지 수집된 답변
     */
    const callChatAPI = useCallback(
        async (
            currentPhase: ChatPhase,
            newHistory: Array<{ role: 'user' | 'model'; content: string }>,
            answers: Record<string, string>,
            currentStepForAPI?: number
        ) => {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newHistory,
                    phase: currentPhase,
                    userAnswers: answers,
                    currentStep: currentStepForAPI,
                }),
            });

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status}`);
            }

            return response.json();
        },
        []
    );

    /**
     * 챗봇 시작 함수
     * 인트로 메시지를 API에서 받아 첫 메시지를 표시합니다.
     */
    const startChat = useCallback(async () => {
        setIsLoading(true);
        try {
            // 인트로 메시지 요청
            const data = await callChatAPI('intro', [], {}, 0);

            // 인트로 AI 메시지 추가
            const introMessage = createAIMessage(data.message, data.choices);
            setMessages([introMessage]);
            setPhase('intro');
        } catch (error) {
            console.error('챗봇 시작 오류:', error);
            // 오류 시 기본 메시지 표시
            const errorMessage = createAIMessage(
                '챗봇 시작 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.'
            );
            setMessages([errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [callChatAPI]);

    /**
     * 선택지 전송 함수 (객관식 버튼 클릭 시)
     * @param choice - 선택된 Choice 객체
     */
    const sendChoice = useCallback(async (choice: Choice) => {
        if (isLoading) return; // 로딩 중 중복 전송 방지

        setIsLoading(true);
        setIsError(false);
        setLastAction({ type: 'choice', data: choice });

        // 사용자 메시지 즉시 추가 (UI 반응성)
        const userMsg = createUserMessage(choice.label);
        setMessages((prev) => [...prev, userMsg]);

        try {
            // 대화 히스토리 업데이트
            const newHistory = [
                ...history,
                { role: 'user' as const, content: choice.label },
            ];
            setHistory(newHistory);

            // '시작하기' 선택 시 → intro에서 questioning으로 전환
            const nextPhase: ChatPhase =
                phase === 'intro' && choice.value === 'start' ? 'questioning' : phase;

            // 답변 저장 (단계별 키로 저장)
            const stepKey = `step_${currentStep}_${Date.now()}`;
            const newAnswers = { ...userAnswers, [stepKey]: `${choice.label}: ${choice.value}` };
            setUserAnswers(newAnswers);

            // API 호출
            const data = await callChatAPI(nextPhase, newHistory, newAnswers, currentStep);

            // 단계 업데이트
            if (data.currentStep) setCurrentStep(data.currentStep);

            // 단계 업데이트
            if (data.phase) setPhase(data.phase as ChatPhase);

            // 중위소득 기준표 표시 여부 업데이트
            setShowIncomeTable(!!data.showIncomeTable);

            // 판별 결과 처리
            if (data.phase === 'result' && data.result) {
                setResult(data.result as DiagnosisResult);
                setShowIncomeTable(false); // 결과 화면에서는 기준표 숨김
            }

            // AI 응답 메시지 추가
            const aiMsg = createAIMessage(data.message, data.choices);
            setMessages((prev) => [...prev, aiMsg]);

            // 히스토리에 AI 응답 추가
            setHistory((prev) => [...prev, { role: 'model', content: data.message }]);
            setLastAction(null); // 성공 시 마지막 작업 초기화

            // analyzing 단계로 자동 전환 (마지막 질문 완료 시)
            if (data.phase === 'questioning' && data.currentStep > totalSteps) {
                await triggerAnalysis(newHistory, newAnswers);
            }
        } catch (error) {
            console.error('선택지 전송 오류:', error);
            setIsError(true);
            const errMsg = createAIMessage('응답 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, history, phase, currentStep, userAnswers, callChatAPI, totalSteps]);

    /**
     * 텍스트 전송 함수 ('기타' 선택 후 자유 텍스트 입력 시)
     * @param text - 사용자가 입력한 텍스트
     */
    const sendText = useCallback(async (text: string) => {
        if (isLoading || !text.trim()) return;

        setIsLoading(true);
        setIsError(false);
        setLastAction({ type: 'text', data: text });

        // 사용자 메시지 즉시 추가
        const userMsg = createUserMessage(text);
        setMessages((prev) => [...prev, userMsg]);

        try {
            // 히스토리 업데이트
            const newHistory = [
                ...history,
                { role: 'user' as const, content: text },
            ];
            setHistory(newHistory);

            // 답변 저장
            const stepKey = `step_${currentStep}_text_${Date.now()}`;
            const newAnswers = { ...userAnswers, [stepKey]: `기타입력: ${text}` };
            setUserAnswers(newAnswers);

            // API 호출 (현재 phase 유지)
            const data = await callChatAPI(phase, newHistory, newAnswers, currentStep);

            if (data.currentStep) setCurrentStep(data.currentStep);
            if (data.phase) setPhase(data.phase as ChatPhase);

            // 중위소득 기준표 표시 여부 업데이트
            setShowIncomeTable(!!data.showIncomeTable);

            if (data.phase === 'result' && data.result) {
                setResult(data.result as DiagnosisResult);
                setShowIncomeTable(false);
            }

            const aiMsg = createAIMessage(data.message, data.choices);
            setMessages((prev) => [...prev, aiMsg]);
            setHistory((prev) => [...prev, { role: 'model', content: data.message }]);
            setLastAction(null);
        } catch (error) {
            console.error('텍스트 전송 오류:', error);
            setIsError(true);
            const errMsg = createAIMessage('응답 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setMessages((prev) => [...prev, errMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, history, phase, currentStep, userAnswers, callChatAPI]);

    /**
     * 마지막 작업을 다시 시도하는 함수
     */
    const retry = useCallback(async () => {
        if (!lastAction || isLoading) return;

        // 마지막 에러 메시지 제거 (사용자 경험 개선)
        setMessages((prev) => prev.slice(0, -1));

        if (lastAction.type === 'choice') {
            // 선택된 메시지도 중복 추가되지 않도록 slice 하나 더
            setMessages((prev) => prev.slice(0, -1));
            await sendChoice(lastAction.data);
        } else if (lastAction.type === 'text') {
            setMessages((prev) => prev.slice(0, -1));
            await sendText(lastAction.data);
        } else if (lastAction.type === 'analysis') {
            await triggerAnalysis(lastAction.data.history, lastAction.data.answers);
        }
    }, [lastAction, isLoading, sendChoice, sendText]);

    /**
     * 최종 유형 판별 분석 트리거 함수
     * 모든 질문 완료 후 analyzing phase로 전환하여 AI 판별 요청
     */
    const triggerAnalysis = useCallback(
        async (
            currentHistory: Array<{ role: 'user' | 'model'; content: string }>,
            answers: Record<string, string>
        ) => {
            setPhase('analyzing');
            setIsLoading(true);
            setIsError(false);
            setLastAction({ type: 'analysis', data: { history: currentHistory, answers } });

            // 로딩 중 메시지 표시
            const loadingMsg = createAIMessage('🔍 AI가 요건을 검토 중입니다...');
            setMessages((prev) => [...prev, loadingMsg]);

            try {
                const data = await callChatAPI('analyzing', currentHistory, answers, currentStep);

                if (data.result) {
                    setResult(data.result as DiagnosisResult);
                    setPhase('result');
                }

                // 로딩 메시지 제거 후 결과 메시지 추가
                setMessages((prev) => {
                    const withoutLoading = prev.slice(0, -1); // 마지막 로딩 메시지 제거
                    return [...withoutLoading, createAIMessage(data.message)];
                });
                setLastAction(null);
            } catch (error) {
                console.error('분석 오류:', error);
                setIsError(true);
                setMessages((prev) => {
                    const withoutLoading = prev.slice(0, -1);
                    return [
                        ...withoutLoading,
                        createAIMessage('분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'),
                    ];
                });
            } finally {
                setIsLoading(false);
            }
        },
        [callChatAPI, currentStep]
    );

    /**
     * 챗봇 상태 전체 초기화 함수
     * 새로운 진단을 시작할 때 사용
     */
    const resetChat = useCallback(() => {
        setMessages([]);
        setIsLoading(false);
        setCurrentStep(0);
        setPhase('intro');
        setUserAnswers({});
        setHistory([]);
        setResult(null);
        setShowIncomeTable(false); // 기준표 초기화
        setIsError(false);
        setLastAction(null);
    }, []);

    return {
        messages,
        isLoading,
        currentStep,
        totalSteps,
        phase,
        result,
        isError,
        showIncomeTable,
        sendChoice,
        sendText,
        retry,
        startChat,
        resetChat,
    };
}
