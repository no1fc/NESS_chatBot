import { NextResponse } from 'next/server';
import { updateBranch, deleteBranch } from '@/lib/db';

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

// 특정 지점 정보 수정
export async function PUT(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: '유효하지 않은 지점 ID입니다.' }, { status: 400 });
        }

        const body = await request.json();

        // id와 created_at은 클라이언트에서 함부로 업데이트하지 못하도록 필터링
        const { id: _removedId, created_at: _removedCreatedAt, ...updateData } = body;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: '수정할 데이터가 없습니다.' }, { status: 400 });
        }

        const success = updateBranch(id, updateData);

        if (success) {
            return NextResponse.json({ success: true, message: '지점이 성공적으로 수정되었습니다.' }, { status: 200 });
        } else {
            return NextResponse.json({ error: '지점 정보를 수정하지 못했습니다. (존재하지 않는 ID 등)' }, { status: 404 });
        }

    } catch (error) {
        console.error('지점 수정 에러:', error);
        return NextResponse.json({ error: '지점 수정 중 오류가 발생했습니다.' }, { status: 500 });
    }
}

// 특정 지점 정보 삭제
export async function DELETE(
    request: Request,
    { params }: RouteContext
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: '유효하지 않은 지점 ID입니다.' }, { status: 400 });
        }

        const success = deleteBranch(id);

        if (success) {
            return NextResponse.json({ success: true, message: '지점이 성공적으로 삭제되었습니다.' }, { status: 200 });
        } else {
            return NextResponse.json({ error: '삭제할 지점을 찾지 못했습니다.' }, { status: 404 });
        }

    } catch (error) {
        console.error('지점 삭제 에러:', error);
        return NextResponse.json({ error: '지점 삭제 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
