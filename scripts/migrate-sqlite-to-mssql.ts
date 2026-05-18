/**
 * SQLite → MSSQL 데이터 마이그레이션 스크립트
 *
 * 사용법: npx tsx scripts/migrate-sqlite-to-mssql.ts
 *
 * 사전 조건:
 * 1. MSSQL 서버가 실행 중이어야 함
 * 2. .env.local에 MSSQL 연결 정보가 설정되어 있어야 함
 * 3. MSSQL에 스키마가 생성되어 있어야 함 (create-mssql-schema.sql 먼저 실행)
 * 4. better-sqlite3 패키지가 아직 설치되어 있어야 함
 */

import Database from 'better-sqlite3';
import sql from 'mssql';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// .env.local 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SQLITE_PATH = process.env.DATABASE_PATH
    ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
    : path.resolve(process.cwd(), 'data', 'mainDB.db');

const mssqlConfig: sql.config = {
    server: process.env.MSSQL_HOST || 'localhost',
    port: parseInt(process.env.MSSQL_PORT || '1433'),
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    database: process.env.MSSQL_DATABASE,
    options: {
        encrypt: process.env.MSSQL_ENCRYPT === 'true',
        trustServerCertificate: process.env.MSSQL_TRUST_SERVER_CERTIFICATE === 'true',
    },
};

async function migrate() {
    // SQLite 연결
    if (!fs.existsSync(SQLITE_PATH)) {
        console.error(`SQLite DB 파일을 찾을 수 없습니다: ${SQLITE_PATH}`);
        process.exit(1);
    }

    const sqlite = new Database(SQLITE_PATH, { readonly: true });
    console.log(`[SQLite] 연결 완료: ${SQLITE_PATH}`);

    // MSSQL 연결
    let pool: sql.ConnectionPool;
    try {
        pool = await sql.connect(mssqlConfig);
        console.log(`[MSSQL] 연결 완료: ${mssqlConfig.server}/${mssqlConfig.database}`);
    } catch (err) {
        console.error('[MSSQL] 연결 실패:', err);
        sqlite.close();
        process.exit(1);
    }

    try {
        // 1. branches 마이그레이션
        await migrateBranches(sqlite, pool);

        // 2. admin_users 마이그레이션
        await migrateAdminUsers(sqlite, pool);

        // 3. system_settings 마이그레이션
        await migrateSystemSettings(sqlite, pool);

        // 4. api_usage_logs 마이그레이션
        await migrateApiUsageLogs(sqlite, pool);

        // 검증: 행 수 비교
        await verifyMigration(sqlite, pool);

        console.log('\n=== 마이그레이션 완료 ===');
    } catch (err) {
        console.error('마이그레이션 중 오류 발생:', err);
    } finally {
        sqlite.close();
        await pool.close();
    }
}

async function migrateBranches(sqlite: Database.Database, pool: sql.ConnectionPool) {
    const rows = sqlite.prepare('SELECT * FROM branches').all() as any[];
    if (rows.length === 0) {
        console.log('[branches] 데이터 없음, 건너뜀');
        return;
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        for (const row of rows) {
            // latitude/longitude: 빈 문자열, undefined, NaN 등 유효하지 않은 값은 null 처리
            const lat = row.latitude != null && row.latitude !== '' && !isNaN(Number(row.latitude))
                ? Number(row.latitude) : null;
            const lng = row.longitude != null && row.longitude !== '' && !isNaN(Number(row.longitude))
                ? Number(row.longitude) : null;

            const request = new sql.Request(transaction);
            request.input('id', sql.Int, row.id);
            request.input('region_sido', sql.NVarChar(50), row.region_sido);
            request.input('region_sigungu', sql.NVarChar(50), row.region_sigungu);
            request.input('branch_name', sql.NVarChar(100), row.branch_name);
            request.input('address', sql.NVarChar(255), row.address);
            request.input('phone', sql.NVarChar(50), row.phone);
            request.input('specific_url', sql.NVarChar(500), row.specific_url);
            request.input('latitude', sql.Float, lat);
            request.input('longitude', sql.Float, lng);
            request.input('covered_regions', sql.NVarChar(sql.MAX), row.covered_regions ?? '[]');
            request.input('created_at', sql.DateTime, row.created_at ? new Date(row.created_at) : new Date());

            await request.query(`
                SET IDENTITY_INSERT branches ON;
                INSERT INTO branches (id, region_sido, region_sigungu, branch_name, address, phone, specific_url, latitude, longitude, covered_regions, created_at)
                VALUES (@id, @region_sido, @region_sigungu, @branch_name, @address, @phone, @specific_url, @latitude, @longitude, @covered_regions, @created_at);
                SET IDENTITY_INSERT branches OFF;
            `);
        }

        // IDENTITY 시드 리셋 (다음 INSERT가 올바른 ID를 사용하도록)
        const maxId = Math.max(...rows.map((r: any) => r.id));
        await new sql.Request(transaction).query(`DBCC CHECKIDENT('branches', RESEED, ${maxId})`);

        await transaction.commit();
        console.log(`[branches] ${rows.length}건 마이그레이션 완료`);
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

async function migrateAdminUsers(sqlite: Database.Database, pool: sql.ConnectionPool) {
    const rows = sqlite.prepare('SELECT * FROM admin_users').all() as any[];
    if (rows.length === 0) {
        console.log('[admin_users] 데이터 없음, 건너뜀');
        return;
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        for (const row of rows) {
            const request = new sql.Request(transaction);
            request.input('id', sql.Int, row.id);
            request.input('username', sql.NVarChar(100), row.username);
            request.input('password_hash', sql.NVarChar(255), row.password_hash);
            request.input('role', sql.NVarChar(50), row.role || 'admin');
            request.input('created_at', sql.DateTime, row.created_at ? new Date(row.created_at) : new Date());

            await request.query(`
                SET IDENTITY_INSERT admin_users ON;
                INSERT INTO admin_users (id, username, password_hash, role, created_at)
                VALUES (@id, @username, @password_hash, @role, @created_at);
                SET IDENTITY_INSERT admin_users OFF;
            `);
        }

        const maxId = Math.max(...rows.map((r: any) => r.id));
        await new sql.Request(transaction).query(`DBCC CHECKIDENT('admin_users', RESEED, ${maxId})`);

        await transaction.commit();
        console.log(`[admin_users] ${rows.length}건 마이그레이션 완료`);
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

async function migrateSystemSettings(sqlite: Database.Database, pool: sql.ConnectionPool) {
    const rows = sqlite.prepare('SELECT * FROM system_settings').all() as any[];
    if (rows.length === 0) {
        console.log('[system_settings] 데이터 없음, 건너뜀');
        return;
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        for (const row of rows) {
            const request = new sql.Request(transaction);
            request.input('key', sql.NVarChar(255), row.key);
            request.input('value', sql.NVarChar(sql.MAX), row.value);
            request.input('updated_at', sql.DateTime, row.updated_at ? new Date(row.updated_at) : new Date());

            await request.query(`
                INSERT INTO system_settings ([key], value, updated_at)
                VALUES (@key, @value, @updated_at)
            `);
        }

        await transaction.commit();
        console.log(`[system_settings] ${rows.length}건 마이그레이션 완료`);
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

async function migrateApiUsageLogs(sqlite: Database.Database, pool: sql.ConnectionPool) {
    const rows = sqlite.prepare('SELECT * FROM api_usage_logs').all() as any[];
    if (rows.length === 0) {
        console.log('[api_usage_logs] 데이터 없음, 건너뜀');
        return;
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        // 배치 처리 (100건씩)
        const batchSize = 100;
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            for (const row of batch) {
                const request = new sql.Request(transaction);
                request.input('id', sql.Int, row.id);
                request.input('model_name', sql.NVarChar(100), row.model_name);
                request.input('input_tokens', sql.Int, row.input_tokens || 0);
                request.input('output_tokens', sql.Int, row.output_tokens || 0);
                request.input('total_tokens', sql.Int, row.total_tokens || 0);
                request.input('result_type', sql.NVarChar(100), row.result_type ?? null);
                request.input('created_at', sql.DateTime, row.created_at ? new Date(row.created_at) : new Date());

                await request.query(`
                    SET IDENTITY_INSERT api_usage_logs ON;
                    INSERT INTO api_usage_logs (id, model_name, input_tokens, output_tokens, total_tokens, result_type, created_at)
                    VALUES (@id, @model_name, @input_tokens, @output_tokens, @total_tokens, @result_type, @created_at);
                    SET IDENTITY_INSERT api_usage_logs OFF;
                `);
            }
        }

        if (rows.length > 0) {
            const maxId = Math.max(...rows.map((r: any) => r.id));
            await new sql.Request(transaction).query(`DBCC CHECKIDENT('api_usage_logs', RESEED, ${maxId})`);
        }

        await transaction.commit();
        console.log(`[api_usage_logs] ${rows.length}건 마이그레이션 완료`);
    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

async function verifyMigration(sqlite: Database.Database, pool: sql.ConnectionPool) {
    console.log('\n--- 마이그레이션 검증 ---');

    const tables = ['branches', 'admin_users', 'system_settings', 'api_usage_logs'];

    for (const table of tables) {
        const sqliteCount = (sqlite.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as any).count;
        const mssqlResult = await pool.request().query(`SELECT COUNT(*) as count FROM ${table}`);
        const mssqlCount = mssqlResult.recordset[0].count;

        const status = sqliteCount === mssqlCount ? 'OK' : 'MISMATCH';
        console.log(`[${table}] SQLite: ${sqliteCount}건, MSSQL: ${mssqlCount}건 - ${status}`);
    }
}

migrate().catch(console.error);
