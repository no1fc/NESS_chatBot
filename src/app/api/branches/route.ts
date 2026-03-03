/**
 * GET /api/branches - 지점 조회 API Route
 * 사용자 지역(시/도, 시/군/구)을 받아 잡모아 지점 정보를 반환합니다.
 * 매칭 지점이 없으면 null을 반환하여 고용24 안내를 유도합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBranchByRegion } from '@/lib/db';

/**
 * GET 요청 핸들러
 * @param request - URL 파라미터 sido, sigungu로 지점 조회
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        // URL 쿼리 파라미터 추출
        const { searchParams } = new URL(request.url);
        const sido = searchParams.get('sido');
        const sigungu = searchParams.get('sigungu');

        // 파라미터 유효성 검증
        if (!sido || !sigungu) {
            return NextResponse.json(
                { error: '시/도(sido)와 시/군/구(sigungu) 파라미터가 필요합니다.' },
                { status: 400 }
            );
        }

        // DB에서 지점 조회
        const branch = getBranchByRegion(sido, sigungu);

        // 결과 반환 (없으면 null → 프론트에서 고용24 안내 처리)
        return NextResponse.json({ branch }, { status: 200 });

    } catch (error) {
        // 서버 오류 처리
        console.error('/api/branches 오류:', error);
        return NextResponse.json(
            { error: '지점 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
