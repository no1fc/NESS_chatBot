import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSetting } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const apiKey = body.apiKey;

        if (!apiKey) {
            return NextResponse.json(
                { success: false, message: 'API Key가 제공되지 않았습니다.' },
                { status: 400 }
            );
        }

        // 설정에서 모델명 불러오기 (기본값: gemini-2.5-flash)
        const configuredModel = getSetting('gemini_model_name') || 'gemini-2.5-flash';

        // Gemini API 초기화 및 테스트 요청 (단순 핑)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: configuredModel });

        // 아주 단순하고 짧은 프롬프트로 응답 속도 및 유효성 테스트
        const result = await model.generateContent('ping');
        const text = result.response.text();

        if (text) {
            return NextResponse.json({ success: true, message: 'Gemini API 연결 성공' }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: 'Gemini API 에서 올바른 응답을 받지 못했습니다.' }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Gemini API test error:', error);

        // 403, 400 등 구체적인 에러 메시지 반환
        const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';

        return NextResponse.json(
            { success: false, message: `Gemini API 연결 실패: ${errorMessage}` },
            { status: 500 }
        );
    }
}
