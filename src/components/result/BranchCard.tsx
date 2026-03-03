/**
 * BranchCard 컴포넌트
 * 지역 선택 후 잡모아 지점 정보 또는 고용24 안내를 표시하는 카드 컴포넌트입니다.
 * 지점이 있으면 지점명/주소/연락처와 CTA 버튼을, 없으면 고용24 안내를 표시합니다.
 */

'use client';

import { MapPin, Phone, ExternalLink, Building2 } from 'lucide-react';
import { Branch } from '@/lib/db';

interface BranchCardProps {
    branch: Branch | null;  // 지점 정보 (null이면 고용24 안내)
    diagnosisType: string;  // UTM 파라미터용 진단 유형
}

/**
 * BranchCard 컴포넌트
 * branch가 있을 때: 지점 상세 정보 + 잡모아 CTA 버튼
 * branch가 없을 때: 고용24 안내 + 고용24 URL 버튼
 */
export default function BranchCard({ branch, diagnosisType }: BranchCardProps) {
    // UTM 파라미터 생성 (진단 유형 및 소스 추적)
    const utmParams = new URLSearchParams({
        type: diagnosisType,
        source: 'chatbot',
    }).toString();

    // ==================== 지점 미보유 안내 ====================
    if (!branch) {
        return (
            <div
                className="result-card mx-auto w-full animate-fade-in-up"
                style={{ maxWidth: '480px', border: '1px solid var(--color-gray-300)' }}
            >
                {/* 안내 헤더 */}
                <div className="flex items-center gap-3 mb-4">
                    <span style={{ fontSize: '1.75rem' }} aria-hidden="true">🏢</span>
                    <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--color-gray-500)' }}>
                            지점 안내
                        </p>
                        <p className="font-bold" style={{ color: 'var(--color-gray-900)' }}>
                            해당 지역에 잡모아 지점이 없습니다
                        </p>
                    </div>
                </div>

                <hr style={{ borderColor: 'var(--color-gray-200)', marginBottom: '16px' }} />

                {/* 고용24 안내 메시지 */}
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-gray-700)' }}>
                    현재 선택한 지역에 잡모아 지점이 운영되지 않습니다.
                    고용24 공식 사이트를 통해 가까운 고용센터에서 국민취업지원제도를 신청하실 수 있습니다.
                </p>

                {/* 고용24 CTA 버튼 */}
                <a
                    href={`https://www.work24.go.kr/cm/c/d/cmCdPopup.do?cmCdDtlCd=SE002&${utmParams}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full"
                    aria-label="고용24 국민취업지원제도 신청 페이지 방문"
                >
                    <ExternalLink size={18} aria-hidden="true" />
                    고용24 국민취업지원제도 가입하기
                </a>

                {/* 고용24 URL 표시 */}
                <p className="text-xs text-center mt-3" style={{ color: 'var(--color-gray-500)' }}>
                    www.work24.go.kr → 국민취업지원제도 신청
                </p>
            </div>
        );
    }

    // ==================== 지점 보유 안내 ====================
    // 전용 URL에 UTM 파라미터 추가
    const branchUrl = branch.specific_url.includes('?')
        ? `${branch.specific_url}&${utmParams}`
        : `${branch.specific_url}?${utmParams}`;

    return (
        <div
            className="result-card mx-auto w-full animate-fade-in-up"
            style={{
                maxWidth: '480px',
                border: '2px solid #93C5FD', // 파란색 테두리 (잡모아 지점 있음)
            }}
        >
            {/* 지점 헤더 */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-primary-subtle)' }}
                    aria-hidden="true"
                >
                    <Building2 size={22} color="var(--color-primary)" />
                </div>
                <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                        🎯 가까운 잡모아 지점
                    </p>
                    <p className="font-bold text-base" style={{ color: 'var(--color-gray-900)' }}>
                        {branch.branch_name}
                    </p>
                </div>
            </div>

            <hr style={{ borderColor: 'var(--color-gray-200)', marginBottom: '16px' }} />

            {/* 지점 상세 정보 */}
            <div className="flex flex-col gap-3 mb-5">
                {/* 주소 */}
                <div className="flex items-start gap-3">
                    <MapPin
                        size={18}
                        color="#EF4444"
                        className="flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-gray-500)' }}>
                            주소
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-gray-900)' }}>
                            {branch.address}
                        </p>
                    </div>
                </div>

                {/* 연락처 */}
                <div className="flex items-start gap-3">
                    <Phone
                        size={18}
                        color="#10B981"
                        className="flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                    />
                    <div>
                        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-gray-500)' }}>
                            연락처
                        </p>
                        <a
                            href={`tel:${branch.phone}`}
                            className="text-sm font-medium"
                            style={{ color: 'var(--color-primary)' }}
                            aria-label={`전화하기 ${branch.phone}`}
                        >
                            {branch.phone}
                        </a>
                    </div>
                </div>
            </div>

            {/* 전화 상담 버튼 (보조) */}
            <a
                href={`tel:${branch.phone}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl py-3 mb-3 text-sm font-medium"
                style={{
                    border: '1.5px solid var(--color-gray-300)',
                    background: 'var(--color-gray-100)',
                    color: 'var(--color-gray-700)',
                }}
            >
                <Phone size={16} aria-hidden="true" />
                전화로 상담 예약하기
            </a>

            {/* 잡모아 지점 가입 CTA 버튼 (주요) */}
            <a
                href={branchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full"
                aria-label={`${branch.branch_name} 상담 신청 페이지 방문`}
            >
                <ExternalLink size={18} aria-hidden="true" />
                잡모아 지점 가입/상담 신청하기 →
            </a>

            {/* 안내 문구 */}
            <p className="text-xs text-center mt-3" style={{ color: 'var(--color-gray-500)' }}>
                모집 인원에 따라 지점 운영 상황이 변경될 수 있습니다.
            </p>
        </div>
    );
}
