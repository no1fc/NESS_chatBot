import { NextResponse } from 'next/server';
import { getAllAdmins, createAdmin } from '@/lib/db';
import bcrypt from 'bcryptjs';

// 관리자 전체 목록 조회
export async function GET() {
    try {
        const admins = getAllAdmins();
        return NextResponse.json({ success: true, admins }, { status: 200 });
    } catch (error) {
        console.error('관리자 목록 조회 에러:', error);
        return NextResponse.json({ error: '관리자 목록을 불러오는 데 실패했습니다.' }, { status: 500 });
    }
}

// 신규 관리자 생성
export async function POST(request: Request) {
    try {
        // --- 1. 권한 체크 (쿠키 기반) ---
        // (NextRequest가 아닌 Request 타입이므로 headers.get('cookie') 등에서 추출해야 하나
        // NextAppRouter 방식의 API 라우트에서는 cookies() 훅 이용이 권장됨)
        const { cookies } = await import('next/headers');
        const token = (await cookies()).get('admin_session')?.value;
        if (!token) {
            return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
        }
        const { verifyToken } = await import('@/lib/auth');
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'superadmin') {
            return NextResponse.json({ error: '최고 관리자(Super Admin) 권한이 필요합니다.' }, { status: 403 });
        }
        // ---------------------------------

        const body = await request.json();
        const { username, password, role } = body;

        // 기초적인 검증 로직
        if (!username || !password) {
            return NextResponse.json({ error: '관리자 아이디와 비밀번호를 모두 입력해주세요.' }, { status: 400 });
        }

        // 비밀번호 해싱 처리
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 기본 역할은 'admin'
        const assignRole = role || 'admin';

        // DB Insert
        const success = createAdmin(username, hashedPassword, assignRole);

        if (success) {
            return NextResponse.json({ success: true, message: '새 관리자 계정이 생성되었습니다.' }, { status: 201 });
        } else {
            // UNIQUE 제약 조건(중복 아이디) 등에 걸렸을 가능성 확인
            return NextResponse.json({ error: '계정 생성 실패. 이미 존재하는 아이디일 수 있습니다.' }, { status: 400 });
        }

    } catch (error) {
        console.error('신규 관리자 생성 에러:', error);
        return NextResponse.json({ error: '관리자 계정 생성 중 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
