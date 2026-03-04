import { NextResponse } from 'next/server';
import { updateAdminPassword, updateAdminRole, deleteAdmin } from '@/lib/db';
import bcrypt from 'bcryptjs';

interface RouteContext {
    params: {
        id: string;
    };
}

// 특정 관리자 계정 권한/비밀번호 변경
export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    try {
        const id = parseInt(params.id, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: '유효하지 않은 관리자 ID입니다.' }, { status: 400 });
        }

        const body = await request.json();
        const { password, role } = body;

        if (!password && !role) {
            return NextResponse.json({ error: '변경할 정보(비밀번호 또는 권한)를 입력해주세요.' }, { status: 400 });
        }

        let successRole = false;
        let successPw = false;

        // 권한 변경
        if (role) {
            successRole = updateAdminRole(id, role);
        }

        // 비밀번호 변경
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const new_password_hash = await bcrypt.hash(password, salt);
            successPw = updateAdminPassword(id, new_password_hash);
        }

        if (successRole || successPw) {
            return NextResponse.json({ success: true, message: '관리자 정보가 성공적으로 변경되었습니다.' }, { status: 200 });
        } else {
            return NextResponse.json({ error: '관리자 정보를 수정하지 못했습니다. (존재하지 않는 ID)' }, { status: 404 });
        }

    } catch (error) {
        console.error('관리자 정보 변경 에러:', error);
        return NextResponse.json({ error: '관리자 정보 수정 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 특정 관리자 계정 삭제
export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const id = parseInt(params.id, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: '유효하지 않은 관리자 ID입니다.' }, { status: 400 });
        }

        // 최소 관리자 1명은 남겨두는 로직 등 추가적인 방어선이 있으면 좋지만 여기선 간단히 구현
        const success = deleteAdmin(id);

        if (success) {
            return NextResponse.json({ success: true, message: '관리자 계정이 삭제되었습니다.' }, { status: 200 });
        } else {
            return NextResponse.json({ error: '삭제할 관리자 계정을 찾지 못했습니다.' }, { status: 404 });
        }

    } catch (error) {
        console.error('관리자 계정 삭제 에러:', error);
        return NextResponse.json({ error: '관리자 계정 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
