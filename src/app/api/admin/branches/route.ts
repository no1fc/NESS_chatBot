import { getAllBranches, insertBranches } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

// 지점 전체 목록 조회
export async function GET() {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('admin');
        if (authResult instanceof Response) return authResult;

        const branches = await getAllBranches();
        return apiSuccess({ branches });
    } catch {
        return apiError('지점 정보를 불러오는 데 실패했습니다.');
    }
}

// 신규 지점 등록
export async function POST(request: Request) {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('superadmin');
        if (authResult instanceof Response) return authResult;

        const { createBranchSchema, formatZodError } = await import('@/lib/validations');
        const body = await request.json();
        const parsed = createBranchSchema.safeParse(body);
        if (!parsed.success) {
            return apiError(formatZodError(parsed.error), 400);
        }

        await insertBranches([parsed.data]);

        return apiSuccess(null, '지점이 등록되었습니다.', 201);
    } catch {
        return apiError('지점 등록 중 오류가 발생했습니다.');
    }
}
