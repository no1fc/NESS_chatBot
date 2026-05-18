import { getAllAdmins, createAdmin } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

// 관리자 전체 목록 조회
export async function GET() {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('superadmin');
        if (authResult instanceof Response) return authResult;

        const admins = await getAllAdmins();
        return apiSuccess({ admins });
    } catch {
        return apiError('관리자 목록을 불러오는 데 실패했습니다.');
    }
}

// 신규 관리자 생성
export async function POST(request: Request) {
    try {
        const { requireRole } = await import('@/lib/auth');
        const authResult = await requireRole('superadmin');
        if (authResult instanceof Response) return authResult;

        const { createAdminSchema, formatZodError } = await import('@/lib/validations');
        const body = await request.json();
        const parsed = createAdminSchema.safeParse(body);
        if (!parsed.success) {
            return apiError(formatZodError(parsed.error), 400);
        }
        const { username, password, role: assignRole } = parsed.data;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const success = await createAdmin(username, hashedPassword, assignRole);
        if (success) {
            return apiSuccess(null, '새 관리자 계정이 생성되었습니다.', 201);
        }
        return apiError('계정 생성 실패. 이미 존재하는 아이디일 수 있습니다.', 400);
    } catch {
        return apiError('관리자 계정 생성 중 내부 오류가 발생했습니다.');
    }
}
