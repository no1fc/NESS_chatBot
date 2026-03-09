import { NextResponse } from 'next/server';
import { getAllBranches, insertBranches } from '@/lib/db';

// 지점 전체 목록 조회
export async function GET() {
    try {
        const branches = getAllBranches();
        return NextResponse.json({ success: true, branches }, { status: 200 });
    } catch (error) {
        console.error('지점 정보 조회 에러:', error);
        return NextResponse.json({ error: '지점 정보를 불러오는 데 실패했습니다.' }, { status: 500 });
    }
}

// 신규 지점 등록
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { region_sido, region_sigungu, branch_name, address, phone, specific_url, latitude, longitude } = body;

        // 기초적인 검증 로직 추가 (Phase 2)
        if (!region_sido || !region_sigungu || !branch_name || !address || !phone || !specific_url) {
            return NextResponse.json({ error: '모든 필수 입력 값을 채워주세요.' }, { status: 400 });
        }

        // DB Insert 유틸리티 함수 호출 (배열 형태로 받는 기존 유틸)
        insertBranches([
            {
                region_sido,
                region_sigungu,
                branch_name,
                address,
                phone,
                specific_url,
                latitude: latitude ? parseFloat(latitude) : undefined,
                longitude: longitude ? parseFloat(longitude) : undefined
            }
        ]);

        return NextResponse.json({ success: true, message: '지점이 등록되었습니다.' }, { status: 201 });

    } catch (error) {
        console.error('신규 지점 등록 에러:', error);
        return NextResponse.json({ error: '지점 등록 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
