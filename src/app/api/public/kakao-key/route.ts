import { NextRequest, NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

/**
 * GET: 클라이언트 사이드 지도 렌더링을 위해 평문 카카오 API 키 1개를 제공하는 엔드포인트
 * - 주의: 실제 운영 환경에서는 referer 체크 등 최소한의 보안 로직이 들어가는 것이 좋습니다.
 */
export async function GET(req: NextRequest) {
    try {
        const currentVal = getSetting('kakao_map_api_keys');
        let keys: string[] = [];

        if (currentVal) {
            try {
                keys = JSON.parse(currentVal);
                if (!Array.isArray(keys)) keys = [];
            } catch (e) {
                keys = [];
            }
        }

        // 전체 키 배열 반환
        return NextResponse.json({
            success: true,
            apiKeys: keys,
            apiKey: keys.length > 0 ? keys[0] : '' // 하위 호환성 유지용 (근데 클라이언트도 뜯어 고칠 예정이므로 사실상 불필요)
        });

    } catch (error) {
        console.error('API Key Fetch 오류:', error);
        return NextResponse.json({ success: false, error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}
