import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth'; // auth.ts 경로에 맞게 변경 (보통 src/lib/auth.ts)

export async function middleware(request: NextRequest) {
    // 사용자가 접근하려는 예: /admin, /admin/branches
    const path = request.nextUrl.pathname;

    // 1. 보호할 경로: /admin 으로 시작하는 모든 경로
    const isAdminRoute = path.startsWith('/admin');

    // 2. 예외 경로: 로그인 페이지는 보호 제외
    const isLoginRoute = path === '/admin/login';

    // 3. /admin 하위 경로가 아니면 미들웨어 통과
    if (!isAdminRoute) {
        return NextResponse.next();
    }

    // 4. 쿠키에서 'admin_session' 이름의 토큰 추출
    const token = request.cookies.get('admin_session')?.value;

    // 5. 로그인 경로 접근 시 리다이렉션 로직
    if (isLoginRoute) {
        // 이미 로그인된 상태(토큰 유효)라면 대시보드로 이동
        if (token) {
            const payload = await verifyToken(token);
            if (payload) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }
        // 로그인 되지 않은 상태면 무사 통과 (로그인 페이지 렌더링)
        return NextResponse.next();
    }

    // 6. 로그인되지 않은 상태(또는 토큰 무효)로 보호된 /admin/* 접근 시 차단
    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
        // 토큰이 있지만 유효하지 않은 경우 (만료 등)
        // 기존 쿠키 삭제 및 로그인 페이지로 리다이렉트
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
    }

    // 7. 정상적인 로그인 상태면 요청 통과
    return NextResponse.next();
}

// 미들웨어가 실행될 경로 (Matcher) 지정
export const config = {
    matcher: [
        /*
         * 모든 /admin/... 하위 경로에 적용
         * api 경로(/api/admin/...)는 api 쪽 로직에서 권한을 다루는 것이 보통 더 안전할 수 있지만,
         * 원한다면 아래 배열에 추가할 수 있습니다.
         */
        '/admin/:path*',
    ],
};
