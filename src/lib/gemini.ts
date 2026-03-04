/**
 * Gemini AI API 클라이언트 유틸리티
 * Google Gemini API를 사용하는 싱글톤 클라이언트 및 헬퍼 함수 모음.
 * Temperature 0.1로 설정하여 환각 방지.
 * Free Tier 한도를 위해 gemini-flash-lite-latest 모델 사용.
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

import { getSetting } from '@/lib/db';

/**
 * Gemini 모델에 메시지를 전송하고 응답을 받는 함수
 * 429 Rate Limit 발생 시 30초 대기 후 1회 재시도
 * @param systemPrompt - AI의 역할과 제약을 정의하는 시스템 프롬프트
 * @param userMessage - 사용자 메시지 또는 분석 요청
 * @param useAnalysisModel - true이면 분석용 모델 사용 (기본: 일반 챗 모델)
 * @returns 파싱된 JSON 객체 또는 원시 텍스트 응답
 */
export async function generateResponse(
    systemPrompt: string,
    userMessage: string,
    useAnalysisModel: boolean = false
): Promise<string> {
    // DB에서 최신 API 키 가져오기 (없으면 환경변수 폴백)
    const apiKey = getSetting('gemini_api_key') || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    // Google Generative AI 클라이언트 초기화
    const genAI = new GoogleGenerativeAI(apiKey);

    // 사용할 모델 선택 및 설정
    const model = genAI.getGenerativeModel({
        model: 'gemini-flash-lite-latest',
        generationConfig: {
            temperature: 0.1,
            maxOutputTokens: useAnalysisModel ? 2048 : 1024,
            responseMimeType: 'application/json',
        },
    });

    // 시스템 프롬프트와 사용자 메시지를 하나의 프롬프트로 결합
    const fullPrompt = `${systemPrompt}\n\n---\n\n${userMessage}`;

    // 최대 2회 시도 (Rate Limit 시 재시도)
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Gemini API 호출
            const result = await model.generateContent(fullPrompt);
            const response = result.response;
            const text = response.text();
            return text;
        } catch (error: unknown) {
            const apiError = error as { status?: number; statusText?: string };

            // Rate Limit(429) 또는 서버 과부하(503) 발생 시 재시도
            if ((apiError?.status === 429 || apiError?.status === 503) && attempt < maxRetries) {
                console.warn(`Gemini 오류 ${apiError.status}. ${attempt}회 시도 실패, 10초 후 재시도...`);
                // 10초 대기 후 재시도
                await new Promise((resolve) => setTimeout(resolve, 10000));
                continue;
            }

            // 그 외 오류 또는 재시도 초과
            console.error('Gemini API 호출 오류:', error);
            throw new Error('AI 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
        }
    }

    // 모든 재시도 실패 (도달 불가 코드이지만 TypeScript 만족)
    throw new Error('AI 서비스 연결에 실패했습니다.');
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
