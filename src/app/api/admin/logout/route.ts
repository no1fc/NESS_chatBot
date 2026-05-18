import { NextResponse } from 'next/server';
import { apiError } from '@/lib/api-response';

export async function POST() {
    try {
        const response = NextResponse.json(
            { success: true as const, data: null, message: '로그아웃 됨' },
            { status: 200 }
        );

        response.cookies.delete('admin_session');
        return response;
    } catch {
        return apiError('로그아웃 중 내부 오류가 발생했습니다.');
    }
}
