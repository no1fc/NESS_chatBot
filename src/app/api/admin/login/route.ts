import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

// 환경 변수에서 관리자 정보 가져오기 (없을 경우 기본값 사용 - 실제 환경에선 강력한 비밀번호 권장)
const ADMIN_ID = process.env.ADMIN_ID || 'nessadmin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ness1234!';

export async function POST(request: Request) {
    try {
        const { id, password } = await request.json();

        // 1. ID/PW 검증
        if (id !== ADMIN_ID || password !== ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
                { status: 401 }
            );
        }

        // 2. JWT 토큰 생성 (페이로드에 사용자 ID 또는 역할 추가)
        const token = await signToken({ role: 'admin', id: ADMIN_ID }, '1d');

        // 3. 성공 응답 생성 (루트 경로로 리다이렉트가 아닌, JSON 응답 반환 및 쿠키 설정)
        const response = NextResponse.json(
            { success: true, message: '로그인 성공' },
            { status: 200 }
        );

        // 4. 보안 쿠키 설정
        response.cookies.set({
            name: 'admin_session',
            value: token,
            httpOnly: true,     // JS에서 접근 불가
            secure: process.env.NODE_ENV === 'production', // 프로덕션에서는 HTTPS 필수
            sameSite: 'lax',    // CSRF 방지
            path: '/',          // 모든 라우트 쿠키 전송
            maxAge: 60 * 60 * 24 // 1일 유지 (초 단위)
        });

        return response;
    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        return NextResponse.json(
            { error: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
