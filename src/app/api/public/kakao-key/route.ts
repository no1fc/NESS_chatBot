import { NextRequest, NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

/**
 * GET: 클라이언트 사이드 지도 렌더링을 위해 카카오 API 키를 제공하는 엔드포인트.
 * Origin/Referer 검증으로 외부 도메인에서의 키 탈취를 방지합니다.
 */
export async function GET(req: NextRequest) {
    try {
        // Origin/Referer 검증: 같은 사이트에서의 요청만 허용
        const origin = req.headers.get('origin');
        const referer = req.headers.get('referer');
        const host = req.headers.get('host');

        // 서버사이드 렌더링(origin 없음)이 아니면서, origin이 host와 불일치하면 차단
        if (origin && host) {
            const originHost = new URL(origin).host;
            if (originHost !== host) {
                return NextResponse.json(
                    { success: false, error: '허가되지 않은 요청입니다.' },
                    { status: 403 }
                );
            }
        }

        // Referer도 검증 (origin이 없는 경우 referer로 대체)
        if (!origin && referer && host) {
            const refererHost = new URL(referer).host;
            if (refererHost !== host) {
                return NextResponse.json(
                    { success: false, error: '허가되지 않은 요청입니다.' },
                    { status: 403 }
                );
            }
        }

        const currentVal = await getSetting('kakao_map_api_keys');
        let keys: string[] = [];

        if (currentVal) {
            try {
                keys = JSON.parse(currentVal);
                if (!Array.isArray(keys)) keys = [];
            } catch {
                keys = [];
            }
        }

        // 첫 번째 키만 반환 (전체 키 목록 노출 방지)
        const firstKey = keys.length > 0 ? keys[0] : '';
        const response = NextResponse.json({
            success: true,
            apiKeys: firstKey ? [firstKey] : [],
            apiKey: firstKey,
        });

        // 캐시 방지
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

        return response;

    } catch {
        return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
