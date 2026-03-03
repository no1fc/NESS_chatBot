/**
 * POST /api/chat - 챗봇 대화 API Route
 * 사용자 입력을 받아 Gemini AI로 응답을 생성합니다.
 * phase별로 질문 생성(questioning) 또는 유형 판별(analyzing)을 수행합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, safeParseJSON } from '@/lib/gemini';
import {
    buildChatSystemPrompt,
    buildAnalysisPrompt,
    INTRO_MESSAGE,
    LOCATION_STEP_MESSAGE,
} from '@/lib/prompts';
import { getPDFContent } from '@/lib/pdf-parser';

// 챗봇 단계 타입 정의
type ChatPhase = 'intro' | 'questioning' | 'analyzing' | 'location' | 'result' | 'ended';

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
}

// API 응답 바디 타입 정의
interface ChatResponse {
    message: string;
    choices?: Choice[];
    phase: ChatPhase;
    currentStep?: number;
    totalSteps?: number;
    result?: {
        type: string;
        score?: number | null;
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
        // 요청 바디 파싱
        const body: ChatRequest = await request.json();
        const { messages, phase, userAnswers = {} } = body;

        // 요청 유효성 검증
        if (!phase) {
            return NextResponse.json({ error: '유효하지 않은 요청입니다.' }, { status: 400 });
        }

        // ==================== INTRO 단계 ====================
        // 첫 번째 인사 메시지 반환 (Gemini 호출 없음)
        if (phase === 'intro') {
            return NextResponse.json(INTRO_MESSAGE, { status: 200 });
        }

        // ==================== LOCATION 단계 ====================
        // 지역 선택 안내 메시지 반환 (Gemini 호출 없음)
        if (phase === 'location') {
            return NextResponse.json(LOCATION_STEP_MESSAGE, { status: 200 });
        }

        // ==================== ANALYZING 단계 ====================
        // 수집된 QA 데이터로 최종 유형 판별
        if (phase === 'analyzing') {
            // PDF 규정 문서 텍스트 로드
            const pdfContent = await getPDFContent();

            // 분석 프롬프트 생성 (규정 + 사용자 답변 결합)
            const analysisPrompt = buildAnalysisPrompt(pdfContent, userAnswers);

            // Gemini API 호출 (분석 모델 사용)
            const rawResponse = await generateResponse(
                analysisPrompt,
                '위 데이터를 바탕으로 국민취업지원제도 참여 유형을 JSON 형식으로 판별해주세요.',
                true // 분석 모델 사용
            );

            // JSON 파싱
            const analysisResult = safeParseJSON<ChatResponse['result'] & { phase: string }>(rawResponse);

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
                    description: analysisResult.description,
                    subType: analysisResult.subType,
                    tips: analysisResult.tips,
                    restrictReason: analysisResult.restrictReason,
                },
            } as ChatResponse);
        }

        // ==================== QUESTIONING 단계 ====================
        // 다음 질문 생성

        // PDF 규정 문서 텍스트 로드 (캐시 활용)
        const pdfContent = await getPDFContent();

        // 시스템 프롬프트 생성
        const systemPrompt = buildChatSystemPrompt(pdfContent);

        // 대화 히스토리를 하나의 문자열로 변환
        const historyText = messages
            .map((m) => `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`)
            .join('\n');

        // 수집된 답변 요약
        const answersText = Object.keys(userAnswers).length > 0
            ? `\n[현재까지 수집된 정보]\n${JSON.stringify(userAnswers, null, 2)}`
            : '';

        // Gemini API 호출 (다음 질문 생성)
        const userMessage = `${historyText}${answersText}\n\n위 대화를 이어서 다음 질문을 JSON 형식으로 생성해주세요.`;

        const rawResponse = await generateResponse(systemPrompt, userMessage, false);

        // JSON 파싱
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed = safeParseJSON<any>(rawResponse);

        if (!parsed) {
            // 파싱 실패 시 원시 텍스트로 응답
            return NextResponse.json({
                message: rawResponse || 'AI가 응답을 생성하는 중 오류가 발생했습니다.',
                phase: 'questioning',
            } as ChatResponse);
        }

        // 정상 응답 반환
        return NextResponse.json({
            message: parsed.message || '',
            choices: parsed.choices || [],
            phase: parsed.phase || 'questioning',
            currentStep: parsed.currentStep || 1,
            totalSteps: parsed.totalSteps || 5,
        } as ChatResponse);

    } catch (error) {
        // 서버 오류 처리
        console.error('/api/chat 오류:', error);
        return NextResponse.json(
            { error: 'AI 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' },
            { status: 500 }
        );
    }
}
