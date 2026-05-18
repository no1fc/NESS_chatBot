/**
 * POST /api/chat - 챗봇 대화 API Route
 * 사용자 입력을 받아 Gemini AI로 응답을 생성합니다.
 * phase별로 질문 생성(questioning) 또는 유형 판별(analyzing)을 수행합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, safeParseJSON } from '@/lib/gemini';
import {
    buildAnalysisPrompt,
    getInfoMessage,
    getIntroMessage,
    getLocationStepMessage,
    getStaticQuestions,
} from '@/lib/prompts';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic'; // API 자동 캐싱 방지 처리 및 DB 상시 조회

// 챗봇 단계 타입 정의
type ChatPhase = 'intro' | 'info' | 'questioning' | 'analyzing' | 'location' | 'result' | 'ended';

// 선택지 타입 정의
interface Choice {
    id: string;
    label: string;
    value: string;
    isOther?: boolean;
}

// API 요청 바디 타입 정의
interface ChatRequest {
    messages: Array<{
        role: 'user' | 'model';
        content: string;
    }>;
    phase: ChatPhase;
    userAnswers?: Record<string, string>;
    currentStep?: number;
}

// API 응답 바디 타입 정의
interface ChatResponse {
    message: string;
    choices?: Choice[];
    phase: ChatPhase;
    currentStep?: number;
    totalSteps?: number;
    showIncomeTable?: boolean; // 중위소득 기준표 표시 여부
    type?: string; // 질문의 특수 타입 (예: 'region')
    result?: {
        type: string;
        score?: number | null;
        scoreDetails?: string[];
        description: string;
        subType?: string | null;
        tips?: string[];
        restrictReason?: string | null;
    };
    error?: string;
}


/**
 * POST 요청 핸들러
 * phase에 따라 다음 질문 생성 또는 최종 유형 판별 수행
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // 요청 바디 파싱 및 검증
        const { chatRequestSchema, formatZodError } = await import('@/lib/validations');
        const rawBody = await request.json();
        const parsed = chatRequestSchema.safeParse(rawBody);
        if (!parsed.success) {
            return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
        }
        const { messages, phase, userAnswers, currentStep } = parsed.data;

        // ==================== INTRO 단계 ====================
        // 첫 번째 인사 메시지 반환 (Gemini 호출 없음)
        if (phase === 'intro') {
            return NextResponse.json(await getIntroMessage(), { status: 200 });
        }

        // ==================== INFO 단계 ====================
        // 국민취업지원제도 정보 메시지 반환 (Gemini 호출 없음)
        if (phase === 'info') {
            return NextResponse.json(await getInfoMessage(), { status: 200 });
        }

        // ==================== LOCATION 단계 (Deprecated) ====================
        // 더 이상 사용되지 않음 (이제 질문 단계에서 처리됨)
        if (phase === 'location') {
            return NextResponse.json({ error: 'Deprecated phase' }, { status: 400 });
        }

        // ==================== ANALYZING 단계 ====================
        // 수집된 QA 데이터로 최종 유형 판별
        if (phase === 'analyzing') {
            // DB에서 커스텀 시스템 프롬프트 로드
            const { getSetting, logApiUsage } = await import('@/lib/db');
            const customSystemPrompt = await getSetting('system_prompt');

            // 분석 프롬프트 생성 (규정 + 사용자 답변 결합)
            const analysisPrompt = await buildAnalysisPrompt(userAnswers, customSystemPrompt);

            // Gemini API 호출 (분석 모델 사용)
            const aiResponse = await generateResponse(
                analysisPrompt,
                '위 데이터를 바탕으로 국민취업지원제도 참여 유형을 JSON 형식으로 판별해주세요.',
                true // 분석 모델 사용
            );

            // JSON 파싱
            const analysisResult = safeParseJSON<ChatResponse['result'] & { phase: string }>(aiResponse.text);

            // DB에 사용량 로깅
            if (analysisResult) {
                await logApiUsage(
                    aiResponse.modelName,
                    aiResponse.usageMetadata?.promptTokenCount || 0,
                    aiResponse.usageMetadata?.candidatesTokenCount || 0,
                    aiResponse.usageMetadata?.totalTokenCount || 0,
                    analysisResult.type || 'unknown'
                );
            }

            if (!analysisResult) {
                // 파싱 실패 시 기본 오류 응답
                return NextResponse.json({
                    message: '진단 결과를 처리하는 중 오류가 발생했습니다. 다시 시도해 주세요.',
                    phase: 'analyzing',
                } as ChatResponse);
            }

            // 결과 반환
            return NextResponse.json({
                message: '진단이 완료되었습니다! 아래에서 결과를 확인하세요.',
                phase: 'result',
                result: {
                    type: analysisResult.type,
                    score: analysisResult.score,
                    scoreDetails: analysisResult.scoreDetails,
                    description: analysisResult.description,
                    subType: analysisResult.subType,
                    tips: analysisResult.tips,
                    restrictReason: analysisResult.restrictReason,
                },
            } as ChatResponse);
        }

        // ==================== QUESTIONING 단계 ====================
        // 정적 질문 반환 (프론트엔드에서 넘겨준 currentStep 기준)
        const staticQuestions = await getStaticQuestions();
        const totalStaticSteps = staticQuestions.length;
        const totalSteps = totalStaticSteps + 1; // 거주 지역 질문(하드코딩) 포함

        // 1. 정적 질문 진행 (0부터 totalStaticSteps - 1까지)
        if (currentStep < totalStaticSteps) {
            const nextQuestion = staticQuestions[currentStep];
            return NextResponse.json({
                message: nextQuestion.message,
                choices: nextQuestion.choices,
                phase: 'questioning',
                currentStep: currentStep + 1,
                totalSteps: totalSteps,
                showIncomeTable: nextQuestion.showIncomeTable,
                type: nextQuestion.type
            } as ChatResponse, { status: 200 });
        }

        // 2. 거주 지역 묻기 (마지막 단계)
        if (currentStep === totalStaticSteps) {
            return NextResponse.json({
                message: '거주 지역 확인\n가까운 잡모아 지점을 안내해 드리기 위해 거주하시는 지역을 선택해주세요.',
                choices: [], // 커스텀 UI 사용
                phase: 'questioning',
                currentStep: currentStep + 1,
                totalSteps: totalSteps,
                showIncomeTable: false,
                type: 'region'
            } as ChatResponse, { status: 200 });
        }

        // 3. 모든 질문 완료 후 analyzing 트리거용 응답
        return NextResponse.json({
            message: '모든 질문이 완료되었습니다. 분석을 시작합니다...',
            choices: [],
            phase: 'questioning', // 아직 훅에서 triggerAnalysis를 통해 넘어갈 수 있도록
            currentStep: currentStep + 1,
            totalSteps: totalSteps,
            showIncomeTable: false,
        } as ChatResponse, { status: 200 });


    } catch (error) {
        // 서버 오류 처리
        logger.error('/api/chat 오류:', error);
        return NextResponse.json(
            { error: 'AI 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' },
            { status: 500 }
        );
    }
}
