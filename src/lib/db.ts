/**
 * SQLite 데이터베이스 초기화 및 쿼리 유틸리티
 * 지점(branches) 테이블 관리 및 지역별 지점 조회 기능 제공.
 * 서버 사이드 전용 (Node.js 환경)
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// DB 싱글톤 인스턴스 (서버 재시작 전까지 동일 연결 재사용)
let db: Database.Database | null = null;

// 지점 정보 타입 정의
export interface Branch {
    id: number;
    region_sido: string;    // 시/도
    region_sigungu: string; // 시/군/구
    branch_name: string;    // 지점명
    address: string;        // 주소
    phone: string;          // 연락처
    specific_url: string;   // 전용 상담 URL
    created_at: string;     // 생성 일시
}

/**
 * SQLite 데이터베이스 연결 초기화 함수
 * 최초 1회 실행 시 DB 파일 생성 및 테이블 초기화
 * @returns Database 인스턴스
 */
export function getDB(): Database.Database {
    // 이미 연결된 DB가 있으면 재사용
    if (db) return db;

    // DB 파일 경로 설정 (환경변수 또는 기본값)
    const dbPath = process.env.DATABASE_PATH
        ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
        : path.resolve(process.cwd(), 'data', 'branches.db');

    // DB 파일 디렉토리 자동 생성
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    // SQLite DB 연결 (파일 없으면 자동 생성)
    db = new Database(dbPath);

    // WAL 모드 활성화 (읽기 성능 최적화)
    db.pragma('journal_mode = WAL');

    // 지점 테이블 초기화 (없으면 생성)
    initSchema(db);

    return db;
}

/**
 * 데이터베이스 스키마 초기화 함수
 * branches 테이블과 인덱스 생성
 * @param database - SQLite Database 인스턴스
 */
function initSchema(database: Database.Database): void {
    // 지점 정보 테이블 생성
    database.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      region_sido TEXT NOT NULL,
      region_sigungu TEXT NOT NULL,
      branch_name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      specific_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 지역 검색 성능 최적화 인덱스
    CREATE INDEX IF NOT EXISTS idx_region
    ON branches(region_sido, region_sigungu);
  `);
}

/**
 * 지역(시/도, 시/군/구)으로 잡모아 지점 조회
 * @param sido - 시/도 명칭 (예: '서울특별시', '경기도')
 * @param sigungu - 시/군/구 명칭 (예: '강남구', '수원시')
 * @returns 매칭 지점 정보 또는 null (지점 없음)
 */
export function getBranchByRegion(sido: string, sigungu: string): Branch | null {
    const database = getDB();

    // 파라미터화 쿼리로 SQL Injection 방지
    const stmt = database.prepare(`
    SELECT * FROM branches
    WHERE region_sido = ? AND region_sigungu = ?
    LIMIT 1
  `);

    const result = stmt.get(sido, sigungu) as Branch | undefined;
    return result ?? null;
}

/**
 * 전체 지점 목록 조회 (관리자용, 지역순 정렬)
 * @returns 전체 지점 배열
 */
export function getAllBranches(): Branch[] {
    const database = getDB();

    const stmt = database.prepare(`
    SELECT * FROM branches
    ORDER BY region_sido, region_sigungu
  `);

    return stmt.all() as Branch[];
}

/**
 * 지점 데이터 삽입 함수 (시드 스크립트에서 사용)
 * @param branches - 삽입할 지점 데이터 배열
 */
export function insertBranches(branches: Omit<Branch, 'id' | 'created_at'>[]): void {
    const database = getDB();

    // 트랜잭션으로 일괄 삽입 (성능 최적화)
    const insert = database.prepare(`
    INSERT OR IGNORE INTO branches
    (region_sido, region_sigungu, branch_name, address, phone, specific_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

    const insertMany = database.transaction((branchList: Omit<Branch, 'id' | 'created_at'>[]) => {
        for (const branch of branchList) {
            insert.run(
                branch.region_sido,
                branch.region_sigungu,
                branch.branch_name,
                branch.address,
                branch.phone,
                branch.specific_url
            );
        }
    });

    insertMany(branches);
    console.log(`${branches.length}개 지점 데이터 삽입 완료`);
}
