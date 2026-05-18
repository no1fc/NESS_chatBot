import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

// JWT 비밀키 — 런타임에 환경변수에서 로드. 지연 초기화로 빌드 시점 에러 방지.
let _key: Uint8Array | null = null;

function getKey(): Uint8Array {
    if (!_key) {
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            throw new Error('JWT_SECRET_KEY 환경변수가 설정되지 않았습니다. .env.local에 설정해주세요.');
        }
        _key = new TextEncoder().encode(secretKey);
    }
    return _key;
}

export interface TokenPayload extends JWTPayload {
    id: string;
    role: string;
}

/**
 * JWT 토큰 생성 함수
 */
export async function signToken(payload: Omit<TokenPayload, keyof JWTPayload>, expiresIn: string = '1d') {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(getKey());
}

/**
 * JWT 토큰 검증 함수
 * @returns 디코딩된 payload 또는 에러 발생 시 null
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getKey());
        return payload as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * API 라우트에서 쿠키 기반 인증 + 역할 검사를 수행하는 헬퍼.
 * 인증 실패 시 NextResponse를 반환하고, 성공 시 TokenPayload를 반환한다.
 */
export async function requireRole(
    requiredRole: 'admin' | 'superadmin'
): Promise<TokenPayload | Response> {
    const { cookies } = await import('next/headers');
    const { NextResponse } = await import('next/server');

    const token = (await cookies()).get('admin_session')?.value;
    if (!token) {
        return NextResponse.json({ error: '인증되지 않은 요청입니다.' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
        return NextResponse.json({ error: '세션이 만료되었습니다. 다시 로그인해주세요.' }, { status: 401 });
    }

    // superadmin은 모든 권한 포함
    if (requiredRole === 'superadmin' && payload.role !== 'superadmin') {
        return NextResponse.json({ error: '최고 관리자(Super Admin) 권한이 필요합니다.' }, { status: 403 });
    }

    // admin은 admin + superadmin 모두 허용
    if (requiredRole === 'admin' && payload.role !== 'admin' && payload.role !== 'superadmin') {
        return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    return payload;
}
