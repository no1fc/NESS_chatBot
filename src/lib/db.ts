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

// 관리자 계정 타입 정의 (Phase 2)
export interface AdminUser {
    id?: number;
    username: string;
    password_hash: string;
    role?: string;
    created_at?: string;
}

// 시스템 설정 타입 정의 (Phase 3)
export interface SystemSetting {
    key: string;
    value: string;
    updated_at: string;
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
    // 1. 지점 정보 테이블 생성
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

    // 2. 관리자 계정 테이블 생성 (Phase 2)
    database.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    // 3. 시스템 설정 테이블 생성 (Phase 3)
    database.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
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

// ==========================================
// Branches CRUD 보강 (Phase 2)
// ==========================================

export function updateBranch(id: number, branchData: Partial<Omit<Branch, 'id' | 'created_at'>>): boolean {
    const database = getDB();
    const setFields = Object.keys(branchData).map(key => `${key} = @${key}`).join(', ');

    if (!setFields) return false;

    const stmt = database.prepare(`
        UPDATE branches 
        SET ${setFields}
        WHERE id = @id
    `);

    const result = stmt.run({ ...branchData, id });
    return result.changes > 0;
}

export function deleteBranch(id: number): boolean {
    const database = getDB();
    const stmt = database.prepare('DELETE FROM branches WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

// ==========================================
// Admin Users CRUD (Phase 2)
// ==========================================

export function getAdminByUsername(username: string): AdminUser | null {
    const database = getDB();
    const stmt = database.prepare('SELECT * FROM admin_users WHERE username = ?');
    const result = stmt.get(username) as AdminUser | undefined;
    return result ?? null;
}

export function getAllAdmins(): AdminUser[] {
    const database = getDB();
    // 보안을 위해 비밀번호 해시는 제외하고 반환하는 것이 좋음 
    // 여기서는 패스워드를 뺀 객체로 캐스팅하거나 쿼리 레벨에서 제외
    const stmt = database.prepare('SELECT id, username, role, created_at FROM admin_users ORDER BY id DESC');
    return stmt.all() as AdminUser[];
}

export function createAdmin(username: string, password_hash: string, role: string = 'admin'): boolean {
    try {
        const database = getDB();
        const stmt = database.prepare(`
            INSERT INTO admin_users (username, password_hash, role)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(username, password_hash, role);
        return result.changes > 0;
    } catch (error) {
        console.error('관리자 생성 에러:', error);
        return false;
    }
}

export function updateAdminPassword(id: number, new_password_hash: string): boolean {
    const database = getDB();
    const stmt = database.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?');
    const result = stmt.run(new_password_hash, id);
    return result.changes > 0;
}

export function updateAdminRole(id: number, role: string): boolean {
    const database = getDB();
    const stmt = database.prepare('UPDATE admin_users SET role = ? WHERE id = ?');
    const result = stmt.run(role, id);
    return result.changes > 0;
}

export function deleteAdmin(id: number): boolean {
    const database = getDB();
    const stmt = database.prepare('DELETE FROM admin_users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
}

// ==========================================
// System Settings CRUD (Phase 3)
// ==========================================

export function getSetting(key: string): string | null {
    const database = getDB();
    const stmt = database.prepare('SELECT value FROM system_settings WHERE key = ?');
    const result = stmt.get(key) as { value: string } | undefined;
    return result ? result.value : null;
}

export function getAllSettings(): Record<string, string> {
    const database = getDB();
    const stmt = database.prepare('SELECT key, value FROM system_settings');
    const results = stmt.all() as { key: string; value: string }[];

    return results.reduce((acc, current) => {
        acc[current.key] = current.value;
        return acc;
    }, {} as Record<string, string>);
}

export function updateSetting(key: string, value: string): boolean {
    const database = getDB();
    const stmt = database.prepare(`
        INSERT INTO system_settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET 
        value = excluded.value, 
        updated_at = CURRENT_TIMESTAMP
    `);
    const result = stmt.run(key, value);
    return result.changes > 0;
}
