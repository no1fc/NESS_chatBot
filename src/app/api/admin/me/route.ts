import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    // 1. 쿠키에서 관리자 세션 토큰 추출
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
        return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // 2. 토큰 검증
    const payload = await verifyToken(token);

    if (!payload) {
        return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    // 3. 토큰의 페이로드에서 유저 정보 반환
    return NextResponse.json({
        success: true,
        user: {
            username: payload.id as string,
            role: payload.role as string || 'admin'
        }
    });
}
