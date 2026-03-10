import { NextResponse, NextRequest } from 'next/server';
import { getApiUsageStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const period = (searchParams.get('period') as 'day' | 'month' | 'year') || 'day';
        const dateFilter = searchParams.get('date') || undefined;

        const stats = getApiUsageStats(period, dateFilter);
        return NextResponse.json({ success: true, stats }, { status: 200 });
    } catch (error) {
        console.error('API 사용량 조회 오류:', error);
        return NextResponse.json({ success: false, error: '서버 에러가 발생했습니다.' }, { status: 500 });
    }
}
