import { type NextRequest } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getSetting } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('superadmin');
        if (authResult instanceof Response) return authResult;

        const body = await request.json();
        const apiKey = body.apiKey;

        if (!apiKey) {
            return apiError('API Key가 제공되지 않았습니다.', 400);
        }

        const configuredModel = await getSetting('gemini_model_name') || 'gemini-2.5-flash';

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: configuredModel });

        const result = await model.generateContent('ping');
        const text = result.response.text();

        if (text) {
            return apiSuccess(null, 'Gemini API 연결 성공');
        }
        return apiError('Gemini API에서 올바른 응답을 받지 못했습니다.');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        return apiError(`Gemini API 연결 실패: ${errorMessage}`);
    }
}
