/**
 * PDF 텍스트 추출 유틸리티
 * 국취유형별자가진단.pdf 파일을 파싱하여 텍스트를 추출하고 캐싱합니다.
 * 서버 사이드 전용 (Node.js 환경)
 */

import path from 'path';
import fs from 'fs';

// PDF 텍스트 메모리 캐시 (서버 재시작 전까지 유지)
let pdfTextCache: string | null = null;

/**
 * PDF 파일에서 텍스트를 추출하는 함수 (최초 1회 파싱 후 캐싱)
 * @returns 추출된 PDF 텍스트 문자열
 */
export async function getPDFContent(): Promise<string> {
    // 캐시가 있으면 즉시 반환 (반복 파싱 방지)
    if (pdfTextCache) {
        return pdfTextCache;
    }

    try {
        // PDF 파일 경로 설정 (환경변수 또는 기본값 사용)
        const pdfPath = process.env.PDF_PATH
            ? path.resolve(process.cwd(), process.env.PDF_PATH)
            : path.resolve(process.cwd(), '국취유형별자가진단.pdf');

        // PDF 파일 존재 여부 확인
        if (!fs.existsSync(pdfPath)) {
            console.warn(`PDF 파일을 찾을 수 없습니다: ${pdfPath}`);
            // PDF가 없는 경우 기본 규정 텍스트 사용
            pdfTextCache = getFallbackContent();
            return pdfTextCache;
        }

        // pdfjs-dist 동적 임포트 (서버 사이드 전용, v3.x 경로)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');


        // PDF.js 워커 비활성화 (Node.js 환경에서 불필요)
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';

        // PDF 파일 로드 및 파싱
        const fileBuffer = fs.readFileSync(pdfPath);
        const uint8Array = new Uint8Array(fileBuffer);

        const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        const totalPages = pdfDocument.numPages;
        const textParts: string[] = [];

        // 각 페이지에서 텍스트 추출
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();

            // 텍스트 아이템을 하나의 문자열로 합치기
            const pageText = textContent.items
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .map((item: any) => item.str)
                .join(' ');

            textParts.push(pageText);
        }

        // 전체 텍스트 합치기 및 캐싱
        pdfTextCache = textParts.join('\n\n');
        console.log(`PDF 파싱 완료: 총 ${totalPages}페이지, ${pdfTextCache.length}자 추출`);

        return pdfTextCache;
    } catch (error) {
        // PDF 파싱 실패 시 기본 규정 텍스트 사용
        console.error('PDF 파싱 오류:', error);
        pdfTextCache = getFallbackContent();
        return pdfTextCache;
    }
}

/**
 * PDF 파싱 실패 시 사용할 기본 국취제 규정 텍스트
 * 핵심 요건 정보만 포함한 간략 버전
 */
function getFallbackContent(): string {
    return `
[국민취업지원제도 주요 요건]

1. 신청 자격 (공통)
- 연령: 15세 이상 69세 이하
- 근로능력 및 구직의사 보유자
- 재학생, 군복무자, 수형자 제외

2. 1유형 (요건심사형) 요건
- 가구단위 중위소득 60% 이하
- 가구단위 재산 4억원 이하 (청년: 5억원 이하)
- 아래 중 하나 해당:
  a) 최근 2년 이내 취업경험 100일 또는 800시간 이상
  b) 최근 2년 이내 취업경험 없음
  c) 폐업 후 1년 미경과 자영업자
  d) 위기청소년, 북한이탈주민 등 특정 계층

3. 1유형 (선발형) 요건
- 요건심사형 기준에는 미달하지만 아래 조건 충족:
- 가구단위 재산 4억원 이하
- 취업경험 없거나 제한적인 경우
- 선발형 점수 기준 이상

4. 2유형 요건
- 특정 계층: 중위소득 100% 이하
- 청년 (15~34세): 중위소득 120% 이하, 취업경험 관계없음
- 중장년 (35~69세): 중위소득 100% 이하, 다양한 취업 취약 계층

5. 지원 내용
- 구직촉진수당: 1유형 월 50만원 × 6개월
- 취업활동비용: 2유형 최대 195.4만원
- 취업지원서비스 공통 제공
  `;
}
