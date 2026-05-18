/**
 * 환경별 로깅 유틸리티
 * - error/warn: 항상 출력 (프로덕션 포함)
 * - info/debug: 개발 환경에서만 출력
 *
 * 프로덕션에서는 pino 등 구조화된 로거로 교체 권장.
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    error: (message: string, ...args: unknown[]) => {
        console.error(`[ERROR] ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]) => {
        console.warn(`[WARN] ${message}`, ...args);
    },
    info: (message: string, ...args: unknown[]) => {
        if (isDev) console.log(`[INFO] ${message}`, ...args);
    },
};
