import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const response = NextResponse.json(
            { success: true, message: '로그아웃 됨' },
            { status: 200 }
        );

        // 로그아웃은 쿠키 삭제로 처리
        response.cookies.delete('admin_session');

        return response;
    } catch (error) {
        console.error('로그아웃 처리 중 오류 발생:', error);
        return NextResponse.json(
            { error: '로그아웃 중 내부 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
