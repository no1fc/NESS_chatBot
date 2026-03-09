import { jwtVerify, SignJWT } from 'jose';

// JWT 비밀키 (환경변수 또는 폴백 문자열)
// 프로덕션 환경에서는 반드시 강력한 비밀키를 환경변수로 설정해야 합니다.
const secretKey = process.env.JWT_SECRET_KEY || 'ness-chatbot-admin-secret-key-development';
const key = new TextEncoder().encode(secretKey);

/**
 * JWT 토큰 생성 함수
 * @param payload 토큰에 담을 정보 (예: 사용자 ID)
 * @param expiresIn 만료 시간 (예: '1h', '1d', '2h')
 * @returns 생성된 JWT 토큰 문자열
 */
export async function signToken(payload: any, expiresIn: string = '1d') {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

/**
 * JWT 토큰 검증 함수
 * @param token 검증할 JWT 문자열
 * @returns 디코딩된 payload 또는 에러 발생 시 null
 */
export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        console.error('JWT Verification failed:', error);
        return null;
    }
}
