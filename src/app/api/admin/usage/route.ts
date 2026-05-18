import { type NextRequest } from 'next/server';
import { getApiUsageStats } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('admin');
        if (authResult instanceof Response) return authResult;

        const searchParams = request.nextUrl.searchParams;
        const period = (searchParams.get('period') as 'day' | 'month' | 'year') || 'day';
        const dateFilter = searchParams.get('date') || undefined;

        const stats = await getApiUsageStats(period, dateFilter);
        return apiSuccess({ stats });
    } catch {
        return apiError('서버 에러가 발생했습니다.');
    }
}
