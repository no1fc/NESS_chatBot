/**
 * Gemini AI API 클라이언트 유틸리티
 * Google Gemini API를 사용하는 싱글톤 클라이언트 및 헬퍼 함수 모음.
 * Temperature 0.1로 설정하여 환각 방지.
 * Free Tier 한도를 위해 gemini-flash-lite-latest 모델 사용.
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

import { getSetting } from '@/lib/db';

export interface GeminiResponse {
    text: string;
    usageMetadata: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
    } | null;
    modelName: string;
}

/**
 * Gemini 모델에 메시지를 전송하고 응답을 받는 함수
 * 429 Rate Limit 발생 시 30초 대기 후 1회 재시도
 * @param systemPrompt - AI의 역할과 제약을 정의하는 시스템 프롬프트
 * @param userMessage - 사용자 메시지 또는 분석 요청
 * @param useAnalysisModel - true이면 분석용 모델 사용 (기본: 일반 챗 모델)
 * @returns 텍스트 응답, 토큰 사용량, 모델 이름이 포함된 객체
 */
export async function generateResponse(
    systemPrompt: string,
    userMessage: string,
    useAnalysisModel: boolean = false
): Promise<GeminiResponse> {
    const keysRaw = getSetting('gemini_api_keys');
    let keys: string[] = [];
    if (keysRaw) {
        try {
            keys = JSON.parse(keysRaw);
            if (!Array.isArray(keys)) keys = [];
        } catch (e) {
            keys = [];
        }
    }

    // 환경 변수에 값이 있고, 배열에 없다면 추가
    if (keys.length === 0 && process.env.GEMINI_API_KEY) {
        keys.push(process.env.GEMINI_API_KEY);
    }

    if (keys.length === 0) {
        throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    // 시스템 프롬프트와 사용자 메시지를 하나의 프롬프트로 결합
    const fullPrompt = `${systemPrompt}\n\n---\n\n${userMessage}`;

    let lastError: any = null;

    // 등록된 API 키들을 순회하며 요청 시도
    for (let i = 0; i < keys.length; i++) {
        const apiKey = keys[i];
        try {
            // 설정에서 모델명 불러오기 (기본값: gemini-2.5-flash)
            const configuredModel = getSetting('gemini_model_name') || 'gemini-2.5-flash';

            // Google Generative AI 클라이언트 초기화
            const genAI = new GoogleGenerativeAI(apiKey);

            // 사용할 모델 선택 및 설정
            const model = genAI.getGenerativeModel({
                model: configuredModel,
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: useAnalysisModel ? 2048 : 1024,
                    responseMimeType: 'application/json',
                },
            });

            // Gemini API 호출
            const result = await model.generateContent(fullPrompt);
            const response = result.response;
            return {
                text: response.text(),
                usageMetadata: response.usageMetadata ? {
                    promptTokenCount: response.usageMetadata.promptTokenCount,
                    candidatesTokenCount: response.usageMetadata.candidatesTokenCount,
                    totalTokenCount: response.usageMetadata.totalTokenCount,
                } : null,
                modelName: configuredModel
            };

        } catch (error: any) {
            lastError = error;
            const status = error?.status;

            // 403 (Forbidden, 401 (Unauthorized), 429 (Too Many Requests) -> 다음 키 시도
            if (
                status === 403 || status === 401 || status === 429 || status === 503 ||
                error.message?.includes('403') || error.message?.includes('leaked') || error.message?.includes('API key not valid')
            ) {
                console.warn(`[Gemini API] Key ${i + 1}/${keys.length} failed (Status: ${status}). error: ${error.message}. trying next key...`);
                // 마지막 키가 아니라면 다음 루프로 진행
                continue;
            }

            console.error(`[Gemini API] Key ${i + 1} unexpected error:`, error);
            // 알 수 없는 에러여도 다음 키가 있으면 시도
            continue;
        }
    }

    // 루프를 다 돌았는데도 성공하지 못한 경우
    console.error('All Gemini API keys failed. Last error:', lastError);
    throw new Error('AI 서비스 연결에 실패했습니다. (모든 API 키 호출 실패)');
}

/**
 * Gemini 응답 텍스트에서 JSON을 안전하게 파싱하는 함수
 * JSON 파싱 실패 시 null 반환
 * @param text - Gemini 응답 원시 텍스트
 * @returns 파싱된 객체 또는 null
 */
export function safeParseJSON<T>(text: string): T | null {
    try {
        // 마크다운 코드 블록 제거 후 파싱 (```json ... ``` 형태 대응)
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleaned) as T;
    } catch {
        // JSON 파싱 실패 시 null 반환
        console.error('JSON 파싱 실패:', text);
        return null;
    }
}
