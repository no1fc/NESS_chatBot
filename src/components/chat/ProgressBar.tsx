/**
 * ProgressBar 컴포넌트
 * 챗봇 진행 상황을 시각적으로 표시하는 상단 프로그레스 바입니다.
 * 현재 단계 / 전체 단계를 퍼센트로 계산하여 애니메이션으로 표시합니다.
 */

'use client';

interface ProgressBarProps {
    current: number;  // 현재 진행 단계 번호
    total: number;    // 전체 단계 수
}

/**
 * ProgressBar 컴포넌트
 * 단계 진행률을 그라데이션 바로 시각화합니다.
 */
export default function ProgressBar({ current, total }: ProgressBarProps) {
    // 진행률 퍼센트 계산 (0~100)
    const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

    return (
        <div className="px-4 py-3 bg-white border-b border-gray-200">
            {/* 단계 텍스트 표시 */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                    {current > 0 ? `질문 ${current} / ${total}` : '준비 중'}
                </span>
                <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {Math.round(percentage)}%
                </span>
            </div>

            {/* 프로그레스 바 트랙 */}
            <div
                className="w-full rounded-full overflow-hidden"
                style={{
                    height: '6px',
                    backgroundColor: 'var(--color-gray-200)',
                }}
                role="progressbar"
                aria-valuenow={Math.round(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`진행률 ${Math.round(percentage)}%`}
            >
                {/* 프로그레스 바 활성 영역 (그라데이션) */}
                <div
                    style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(90deg, #2563EB, #10B981)',
                        borderRadius: '999px',
                        // 트랜지션으로 부드러운 진행률 업데이트
                        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                />
            </div>
        </div>
    );
}
