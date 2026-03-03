/**
 * Next.js 설정 파일
 * pdfjs-dist를 서버 외부 패키지로 등록하여 canvas 모듈 오류 방지.
 * better-sqlite3도 외부 패키지로 등록하여 네이티브 모듈 문제 방지.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack 명시적 활성화 (Next.js 16 기본값)
  turbopack: {},

  // 서버 사이드에서 번들링하지 않고 외부 패키지로 처리할 모듈 목록
  // pdfjs-dist는 canvas 모듈 의존성 때문에 외부 패키지로 처리
  serverExternalPackages: ['pdfjs-dist', 'better-sqlite3', 'canvas'],
};

export default nextConfig;
