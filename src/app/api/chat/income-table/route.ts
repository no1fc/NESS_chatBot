import { NextResponse } from 'next/server';
import { getMedianIncomeTable } from '@/lib/prompts';

// 이 API는 DB(전역 설정)를 실시간 반영해야 하므로 캐싱을 끄고 동적 생성하도록 합니다.
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const markdown = getMedianIncomeTable();
        
        // 마크다운 형식의 텍스트 표 파싱 로직
        // 예: | 1인가구 | 2,564,238원 | 1,538,542원 | 3,077,085원 |
        const lines = markdown.split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
        const rows = [];
        
        // lines[0] = 헤더, lines[1] = 구분선, lines[2...] = 데이터
        if (lines.length > 2) {
            for (let i = 2; i < lines.length; i++) {
                // 맨 앞, 맨 뒤의 '|' 로 인해 생기는 빈 문자열 요소 제거
                const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
                
                // 가구원 수, 100%, 60%, 120% 순의 컬럼이라고 가정
                if (cells.length >= 4) {
                    rows.push({
                        가구원수: cells[0],
                        '100%': cells[1],
                        '60%': cells[2],
                        '120%': cells[3]
                    });
                }
            }
        }
        
        return NextResponse.json({ success: true, data: rows }, { status: 200 });

    } catch (error) {
        console.error('Failed to parse median income table from DB:', error);
        return NextResponse.json({ success: false, error: '내부 파싱 에러' }, { status: 500 });
    }
}
