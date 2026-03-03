/**
 * 잡모아 지점 초기 데이터 시드 스크립트
 * 최초 1회 실행하여 SQLite DB에 지점 데이터를 삽입합니다.
 * 실행: npx tsx src/lib/seed.ts
 */

import { insertBranches, getDB } from './db';

// 잡모아 지점 초기 데이터 목록
// 실제 운영 시 잡모아 지점 정보로 업데이트 필요
const branchData = [
    // 서울특별시
    {
        region_sido: '서울특별시',
        region_sigungu: '강남구',
        branch_name: '잡모아 강남지점',
        address: '서울특별시 강남구 테헤란로 123, 2층 201호',
        phone: '02-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/gangnam?source=chatbot',
    },
    {
        region_sido: '서울특별시',
        region_sigungu: '송파구',
        branch_name: '잡모아 송파지점',
        address: '서울특별시 송파구 올림픽로 456, 3층',
        phone: '02-2345-6789',
        specific_url: 'https://jobmoa.co.kr/branch/songpa?source=chatbot',
    },
    {
        region_sido: '서울특별시',
        region_sigungu: '마포구',
        branch_name: '잡모아 마포지점',
        address: '서울특별시 마포구 홍익로 78, 1층',
        phone: '02-3456-7890',
        specific_url: 'https://jobmoa.co.kr/branch/mapo?source=chatbot',
    },
    {
        region_sido: '서울특별시',
        region_sigungu: '노원구',
        branch_name: '잡모아 노원지점',
        address: '서울특별시 노원구 동일로 890, 2층',
        phone: '02-4567-8901',
        specific_url: 'https://jobmoa.co.kr/branch/nowon?source=chatbot',
    },
    // 경기도
    {
        region_sido: '경기도',
        region_sigungu: '수원시',
        branch_name: '잡모아 수원지점',
        address: '경기도 수원시 영통구 월드컵로 123, 4층',
        phone: '031-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/suwon?source=chatbot',
    },
    {
        region_sido: '경기도',
        region_sigungu: '성남시',
        branch_name: '잡모아 성남지점',
        address: '경기도 성남시 분당구 판교역로 456',
        phone: '031-2345-6789',
        specific_url: 'https://jobmoa.co.kr/branch/seongnam?source=chatbot',
    },
    {
        region_sido: '경기도',
        region_sigungu: '고양시',
        branch_name: '잡모아 고양지점',
        address: '경기도 고양시 일산동구 중앙로 789',
        phone: '031-3456-7890',
        specific_url: 'https://jobmoa.co.kr/branch/goyang?source=chatbot',
    },
    {
        region_sido: '경기도',
        region_sigungu: '부천시',
        branch_name: '잡모아 부천지점',
        address: '경기도 부천시 중동 원미구 길주로 101',
        phone: '032-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/bucheon?source=chatbot',
    },
    // 인천광역시
    {
        region_sido: '인천광역시',
        region_sigungu: '남동구',
        branch_name: '잡모아 인천남동지점',
        address: '인천광역시 남동구 구월로 234, 5층',
        phone: '032-2345-6789',
        specific_url: 'https://jobmoa.co.kr/branch/incheon-namdong?source=chatbot',
    },
    // 부산광역시
    {
        region_sido: '부산광역시',
        region_sigungu: '해운대구',
        branch_name: '잡모아 해운대지점',
        address: '부산광역시 해운대구 해운대로 567, 2층',
        phone: '051-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/haeundae?source=chatbot',
    },
    {
        region_sido: '부산광역시',
        region_sigungu: '부산진구',
        branch_name: '잡모아 부산진지점',
        address: '부산광역시 부산진구 서면로 890',
        phone: '051-2345-6789',
        specific_url: 'https://jobmoa.co.kr/branch/busanjin?source=chatbot',
    },
    // 대구광역시
    {
        region_sido: '대구광역시',
        region_sigungu: '달서구',
        branch_name: '잡모아 대구달서지점',
        address: '대구광역시 달서구 달구벌대로 123',
        phone: '053-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/daegu-dalseo?source=chatbot',
    },
    // 광주광역시
    {
        region_sido: '광주광역시',
        region_sigungu: '서구',
        branch_name: '잡모아 광주서구지점',
        address: '광주광역시 서구 상무중앙로 456',
        phone: '062-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/gwangju-seo?source=chatbot',
    },
    // 대전광역시
    {
        region_sido: '대전광역시',
        region_sigungu: '유성구',
        branch_name: '잡모아 대전유성지점',
        address: '대전광역시 유성구 대학로 789',
        phone: '042-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/daejeon-yuseong?source=chatbot',
    },
    // 경상남도
    {
        region_sido: '경상남도',
        region_sigungu: '창원시',
        branch_name: '잡모아 창원지점',
        address: '경상남도 창원시 성산구 창원대로 234',
        phone: '055-1234-5678',
        specific_url: 'https://jobmoa.co.kr/branch/changwon?source=chatbot',
    },
];

/**
 * 메인 시드 실행 함수
 * 중복 방지를 위해 기존 데이터 확인 후 삽입
 */
async function runSeed(): Promise<void> {
    console.log('🌱 지점 데이터 시드 시작...');

    try {
        // DB 연결 초기화 (테이블 생성 포함)
        const database = getDB();

        // 기존 데이터 개수 확인
        const countResult = database.prepare('SELECT COUNT(*) as count FROM branches').get() as { count: number };
        const existingCount = countResult.count;

        if (existingCount > 0) {
            console.log(`⚠️  이미 ${existingCount}개의 지점 데이터가 존재합니다. 중복 삽입을 건너뜁니다.`);
            console.log('✅ 시드 완료 (기존 데이터 유지)');
            return;
        }

        // 지점 데이터 일괄 삽입
        insertBranches(branchData);

        // 삽입 결과 확인
        const newCount = (database.prepare('SELECT COUNT(*) as count FROM branches').get() as { count: number }).count;
        console.log(`✅ 총 ${newCount}개 지점 데이터 삽입 완료!`);
    } catch (error) {
        console.error('❌ 시드 실행 오류:', error);
        process.exit(1);
    }
}

// 스크립트로 직접 실행 시 시드 실행
runSeed();
