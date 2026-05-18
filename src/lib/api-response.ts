/**
 * 통일된 API 응답 헬퍼
 * 모든 admin API 라우트에서 일관된 응답 형식을 사용합니다.
 *
 * 성공: { success: true, ...data, message?: string }
 * 에러: { success: false, error: string }
 *
 * data 객체의 프로퍼티가 최상위에 스프레드되어 기존 클라이언트 호환성을 유지합니다.
 * 예: apiSuccess({ branches: [...] }) → { success: true, branches: [...] }
 */

import { NextResponse } from 'next/server';

interface ErrorResponse {
    success: false;
    error: string;
}

export function apiSuccess<T extends Record<string, unknown> | null>(
    data: T,
    message?: string,
    status: number = 200,
): NextResponse {
    return NextResponse.json(
        { success: true, ...(data && data), ...(message && { message }) },
        { status },
    );
}

export function apiError(error: string, status: number = 500): NextResponse<ErrorResponse> {
    return NextResponse.json({ success: false as const, error }, { status });
}
