import { updateAdminPassword, updateAdminRole, deleteAdmin } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

// 특정 관리자 계정 권한/비밀번호 변경
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
            return apiError('유효하지 않은 관리자 ID입니다.', 400);
        }

        const { updateAdminSchema, formatZodError } = await import('@/lib/validations');
        const body = await request.json();
        const parsed = updateAdminSchema.safeParse(body);
        if (!parsed.success) {
            return apiError(formatZodError(parsed.error), 400);
        }
        const { password, role } = parsed.data;

        let successRole = false;
        let successPw = false;

        if (role) {
            successRole = await updateAdminRole(id, role);
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(password, salt);
            successPw = await updateAdminPassword(id, newHash);
        }

        if (successRole || successPw) {
            return apiSuccess(null, '관리자 정보가 성공적으로 변경되었습니다.');
        }
        return apiError('관리자 정보를 수정하지 못했습니다. (존재하지 않는 ID)', 404);
    } catch {
        return apiError('관리자 정보 수정 중 오류가 발생했습니다.');
    }
}

// 특정 관리자 계정 삭제
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
            return apiError('유효하지 않은 관리자 ID입니다.', 400);
        }

        const success = await deleteAdmin(id);
        if (success) {
            return apiSuccess(null, '관리자 계정이 삭제되었습니다.');
        }
        return apiError('삭제할 관리자 계정을 찾지 못했습니다.', 404);
    } catch {
        return apiError('관리자 계정 삭제 중 오류가 발생했습니다.');
    }
}
