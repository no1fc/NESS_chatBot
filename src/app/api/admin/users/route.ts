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
