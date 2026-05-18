import { verifyToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
        return apiError('인증되지 않은 요청입니다.', 401);
    }

    const payload = await verifyToken(token);

    if (!payload) {
        return apiError('세션이 만료되었습니다.', 401);
    }

    return apiSuccess({
        user: {
            username: payload.id,
            role: payload.role || 'admin',
        }
    });
}
