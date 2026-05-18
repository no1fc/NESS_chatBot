import { updateBranch, deleteBranch } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

// 특정 지점 정보 수정
export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('superadmin');
        if (authResult instanceof Response) return authResult;

        const { id: idParam } = await params;
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
            return apiError('유효하지 않은 지점 ID입니다.', 400);
        }

        const { updateBranchSchema, formatZodError } = await import('@/lib/validations');
        const body = await request.json();
        const parsed = updateBranchSchema.safeParse(body);
        if (!parsed.success) {
            return apiError(formatZodError(parsed.error), 400);
        }
        if (Object.keys(parsed.data).length === 0) {
            return apiError('수정할 데이터가 없습니다.', 400);
        }

        const success = await updateBranch(id, parsed.data);
        if (success) {
            return apiSuccess(null, '지점이 성공적으로 수정되었습니다.');
        }
        return apiError('지점 정보를 수정하지 못했습니다. (존재하지 않는 ID)', 404);
    } catch {
        return apiError('지점 수정 중 오류가 발생했습니다.');
    }
}

// 특정 지점 정보 삭제
export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('superadmin');
        if (authResult instanceof Response) return authResult;

        const { id: idParam } = await params;
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
            return apiError('유효하지 않은 지점 ID입니다.', 400);
        }

        const success = await deleteBranch(id);
        if (success) {
            return apiSuccess(null, '지점이 성공적으로 삭제되었습니다.');
        }
        return apiError('삭제할 지점을 찾지 못했습니다.', 404);
    } catch {
        return apiError('지점 삭제 중 오류가 발생했습니다.');
    }
}
