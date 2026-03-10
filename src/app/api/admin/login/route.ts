import { NextResponse } from 'next/server';
import { getAdminByUsername, createAdmin } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic'; // 정적 렌더링 방지 및 빌드 시점 DB 접근 오류 회피

// 최초 환경 변수에서 기본 관리자 정보 가져오기 (DB 초기화용 폴백)
const FALLBACK_ADMIN_ID = process.env.NESS_ADMIN_ID;
const FALLBACK_ADMIN_PASSWORD = process.env.NESS_ADMIN_PASSWORD;

// 브라우저에서 직접 URL 입력(/api/admin/login) 시 405 에러 방지 및 리다이렉트
export async function GET(request: Request) {
    const url = new URL(request.url);
    return NextResponse.redirect(new URL('/admin/login', url.origin));
}

export async function POST(request: Request) {
    try {
        const { id: username, password } = await request.json();

        // 1. DB에서 사용자 찾기
        const adminUser = getAdminByUsername(username);

        // 사용자가 DB에 없을 경우 Fallback 확인 로직
        if (!adminUser) {
            // 만약 기본 하드코딩 계정 정보와 일치한다면, 최초 로그인으로 간주하고 DB에 계정 생성 후 토큰 발급
            if (username === FALLBACK_ADMIN_ID && password === FALLBACK_ADMIN_PASSWORD) {
                console.log('초기 최고 관리자 계정 생성 (DB 삽입)');
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                // DB에 관리자 생성
                const created = createAdmin(username, hashedPassword, 'superadmin');

                if (created) {
                    return handleLoginSuccess(username, 'superadmin', request);
                } else {
                    return NextResponse.json({ error: '초기 계정 생성 중 오류가 발생했습니다. DB를 확인하세요.' }, { status: 500 });
                }
            }

            // DB에도 없고 Fallback과도 불일치
            return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        // 2. 패스워드 검증 (비밀번호 해시 대조)
        const isMatch = await bcrypt.compare(password, adminUser.password_hash);

        if (!isMatch) {
            return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
        }

        // 3. 검증 성공 시 토큰 생성 로직 호출
        return handleLoginSuccess(adminUser.username, adminUser.role || 'admin', request);

    } catch (error) {
        console.error('로그인 처리 중 오류 발생:', error);
        return NextResponse.json(
            { error: '서버 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// 중복 사용되는 토큰 생성 및 쿠키 셋팅 함수 추출
async function handleLoginSuccess(username: string, role: string, request: Request) {
    // JWT 토큰 생성
    const token = await signToken({ role, id: username }, '1d');

    const response = NextResponse.json(
        { success: true, message: '로그인 성공' },
        { status: 200 }
    );

    // 요청이 HTTPS인지 확인 (리버스 프록시 헤더 또는 URL)
    const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://');

    // 보안 쿠키 설정
    response.cookies.set({
        name: 'admin_session',
        value: token,
        httpOnly: true,
        // HTTP 배포 환경 문제를 해결하기 위해 프로덕션이면서 HTTPS인 경우에만 secure 쿠키를 발급하도록 수정
        secure: process.env.NODE_ENV === 'production' && isHttps,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24
    });

    return response;
}
