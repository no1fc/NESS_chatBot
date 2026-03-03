/**
 * ResultCard 컴포넌트
 * AI 유형 판별 결과를 시각적으로 표시하는 카드 컴포넌트입니다.
 * 유형에 따라 다른 색상과 아이콘을 적용하며, AI 팁과 지역 선택 버튼을 포함합니다.
 */

'use client';

import { CheckCircle2, AlertTriangle, XCircle, Trophy, Lightbulb, MapPin } from 'lucide-react';
import { DiagnosisResult } from '@/hooks/useChat';

interface ResultCardProps {
    result: DiagnosisResult;            // 진단 결과 데이터
    onSelectRegion: () => void;         // 지역 선택 단계 진행 콜백
}

// 유형별 디자인 설정 맵
const TYPE_CONFIG = {
    '1유형_요건심사형': {
        // 1유형 요건심사형: 초록색 (의무 참여 가능)
        icon: CheckCircle2,
        iconColor: '#10B981',
        borderColor: '#6EE7B7',
        badgeBackground: '#ECFDF5',
        badgeColor: '#065F46',
        label: '1유형 (요건심사형)',
        emoji: '🎉',
    },
    '1유형_선발형': {
        // 1유형 선발형: 파란색 (점수 기반 선발)
        icon: Trophy,
        iconColor: '#2563EB',
        borderColor: '#93C5FD',
        badgeBackground: '#EFF6FF',
        badgeColor: '#1E40AF',
        label: '1유형 (선발형)',
        emoji: '🏆',
    },
    '2유형': {
        // 2유형: 노란색 (지원 가능하나 조건 다름)
        icon: AlertTriangle,
        iconColor: '#F59E0B',
        borderColor: '#FCD34D',
        badgeBackground: '#FFFBEB',
        badgeColor: '#92400E',
        label: '2유형',
        emoji: '📋',
    },
    '제한': {
        // 참여 제한: 빨간색
        icon: XCircle,
        iconColor: '#EF4444',
        borderColor: '#FCA5A5',
        badgeBackground: '#FEF2F2',
        badgeColor: '#991B1B',
        label: '참여 제한',
        emoji: '⚠️',
    },
};

/**
 * ResultCard 컴포넌트
 * 진단 유형, 설명, AI 팁, 지역 선택 버튼을 포함하는 결과 카드를 렌더링합니다.
 */
export default function ResultCard({ result, onSelectRegion }: ResultCardProps) {
    // 유형별 설정 가져오기 (없으면 기본값 사용)
    const config = TYPE_CONFIG[result.type] ?? TYPE_CONFIG['2유형'];
    const IconComponent = config.icon;

    // 참여 제한 여부 (지역 선택 버튼 숨김)
    const isRestricted = result.type === '제한';

    return (
        <div
            className="result-card mx-auto w-full"
            style={{
                // 유형별 테두리 색상 적용
                border: `2px solid ${config.borderColor}`,
                maxWidth: '480px',
            }}
        >
            {/* 헤더: 이모지 + 유형 배지 + 아이콘 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* 유형 이모지 */}
                    <span style={{ fontSize: '1.75rem' }} aria-hidden="true">
                        {config.emoji}
                    </span>

                    {/* 유형 배지 */}
                    <div>
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-gray-500)' }}>
                            예상 진단 결과
                        </p>
                        <span
                            className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{
                                background: config.badgeBackground,
                                color: config.badgeColor,
                            }}
                        >
                            {config.label}
                            {result.subType && ` · ${result.subType}`}
                        </span>
                    </div>
                </div>

                {/* 유형 아이콘 */}
                <IconComponent size={32} color={config.iconColor} aria-hidden="true" />
            </div>

            {/* 구분선 */}
            <hr style={{ borderColor: 'var(--color-gray-200)', marginBottom: '16px' }} />

            {/* 선발형 점수 표시 (해당 시만) */}
            {result.type === '1유형_선발형' && result.score !== null && result.score !== undefined && (
                <div
                    className="flex items-center justify-between rounded-xl p-3 mb-4"
                    style={{ background: 'var(--color-primary-subtle)' }}
                >
                    <span className="text-sm font-medium" style={{ color: 'var(--color-primary-dark)' }}>
                        예상 선발형 점수
                    </span>
                    <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {result.score}점
                    </span>
                </div>
            )}

            {/* 결과 설명 */}
            <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--color-gray-700)' }}
            >
                {result.description}
            </p>

            {/* 참여 제한 사유 (해당 시만) */}
            {isRestricted && result.restrictReason && (
                <div
                    className="rounded-xl p-3 mb-4"
                    style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
                >
                    <p className="text-sm font-medium" style={{ color: '#991B1B' }}>
                        제한 사유: {result.restrictReason}
                    </p>
                </div>
            )}

            {/* AI 팁 (있을 경우만) */}
            {result.tips && result.tips.length > 0 && (
                <div
                    className="rounded-xl p-3 mb-5"
                    style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={14} color="#D97706" aria-hidden="true" />
                        <span className="text-xs font-semibold" style={{ color: '#92400E' }}>
                            AI 팁
                        </span>
                    </div>
                    {result.tips.map((tip, idx) => (
                        <p key={idx} className="text-sm" style={{ color: '#78350F' }}>
                            {tip}
                        </p>
                    ))}
                </div>
            )}

            {/* 면책 문구 */}
            <div className="disclaimer-box mb-5">
                <span aria-hidden="true">ℹ️</span>
                <p>
                    이 결과는 자가진단 보조 용도이며, 실제 참여 여부는 고용센터 심사에 따라 달라질 수 있습니다.
                </p>
            </div>

            {/* 지역 선택 CTA (참여 제한이 아닌 경우만) */}
            {!isRestricted && (
                <button
                    className="btn-primary w-full"
                    onClick={onSelectRegion}
                    aria-label="가까운 잡모아 지점 찾기"
                >
                    <MapPin size={18} aria-hidden="true" />
                    가까운 잡모아 지점 찾기
                </button>
            )}

            {/* 참여 제한인 경우: 고용24 바로 안내 */}
            {isRestricted && (
                <a
                    href="https://www.work24.go.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary w-full"
                    aria-label="고용24 공식 사이트 방문"
                >
                    고용24에서 더 자세히 확인하기 →
                </a>
            )}
        </div>
    );
}
