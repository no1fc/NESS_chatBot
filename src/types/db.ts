/**
 * 데이터베이스 모델 타입 정의
 * 클라이언트/서버 양쪽에서 안전하게 import 가능 (런타임 의존성 없음)
 */

// 지점 정보 타입 정의
export interface Branch {
    id: number;
    region_sido: string;    // 시/도
    region_sigungu: string; // 시/군/구
    branch_name: string;    // 지점명
    address: string;        // 주소
    phone: string;          // 연락처
    specific_url: string;   // 전용 상담 URL
    latitude?: number;      // 위도 (선택)
    longitude?: number;     // 경도 (선택)
    covered_regions?: string; // 관할 지역 (JSON string 배열 형태: ["시도 시군구", ...])
    created_at: string;     // 생성 일시
}

// 관리자 계정 타입 정의
export interface AdminUser {
    id?: number;
    username: string;
    password_hash: string;
    role?: string;
    created_at?: string;
}

// 시스템 설정 타입 정의
export interface SystemSetting {
    key: string;
    value: string;
    updated_at: string;
}

// API 사용량 로그 타입 정의
export interface ApiUsageLog {
    id: number;
    model_name: string;
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    result_type: string | null;
    created_at: string;
}
