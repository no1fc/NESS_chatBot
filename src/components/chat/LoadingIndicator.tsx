/**
 * LoadingIndicator 컴포넌트
 * 두 가지 모드로 로딩 상태를 표시합니다:
 * - 'bubble' 모드: 채팅 버블 자리에 스켈레톤 UI 표시 (일반 응답 대기)
 * - 'analyzing' 모드: 중앙 오버레이 UI 표시 (최종 AI 분석 중)
 */

'use client';

interface LoadingIndicatorProps {
    mode: 'bubble' | 'analyzing'; // 로딩 모드
}

/**
 * LoadingIndicator 컴포넌트
 * 로딩 모드에 따라 스켈레톤 또는 분석 중 오버레이를 렌더링합니다.
 */
export default function LoadingIndicator({ mode }: LoadingIndicatorProps) {
    // ==================== 'bubble' 모드 ====================
    // 챗 버블 자리에 스켈레톤 UI 표시
    if (mode === 'bubble') {
        return (
            <div className="flex items-end gap-2 justify-start" aria-live="polite" aria-busy="true">
                {/* AI 아이콘 자리 - 스켈레톤 */}
                <div
                    className="skeleton flex-shrink-0 w-8 h-8 rounded-full"
                    aria-hidden="true"
                />

                {/* 메시지 버블 자리 - 스켈레톤 */}
                <div
                    className="flex flex-col gap-2"
                    style={{ maxWidth: '65%' }}
                >
                    {/* 첫 번째 줄 */}
                    <div className="skeleton rounded-2xl" style={{ width: '240px', height: '18px' }} />
                    {/* 두 번째 줄 (더 짧음) */}
                    <div className="skeleton rounded-2xl" style={{ width: '160px', height: '18px' }} />
                    {/* 로딩 점 애니메이션 */}
                    <div className="flex items-center gap-1 mt-1">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                style={{
                                    display: 'inline-block',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: 'var(--color-primary)',
                                    animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                                }}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                </div>

                {/* 스크린리더용 안내 문구 */}
                <span className="sr-only">AI가 응답을 생성하고 있습니다</span>
            </div>
        );
    }

    // ==================== 'analyzing' 모드 ====================
    // 최종 AI 분석 중 화면 전체 오버레이
    return (
        <div
            className="flex flex-col items-center justify-center gap-4 py-8"
            aria-live="assertive"
            aria-busy="true"
        >
            {/* 로딩 스피너 (원형) */}
            <div
                style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: '4px solid var(--color-primary-subtle)',
                    borderTopColor: 'var(--color-primary)',
                    animation: 'spin 0.8s linear infinite',
                }}
                aria-hidden="true"
            />

            {/* 안내 텍스트 */}
            <div className="text-center">
                <p
                    className="font-semibold mb-1"
                    style={{ color: 'var(--color-gray-900)', fontSize: '1rem' }}
                >
                    AI가 요건을 검토 중입니다
                </p>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
                    입력하신 정보를 바탕으로 유형을 분석하고 있어요...
                </p>
            </div>

            {/* 진행 점 애니메이션 */}
            <div className="flex items-center gap-2" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            animation: `dotBounce 1.2s ease-in-out ${i * 0.25}s infinite`,
                        }}
                    />
                ))}
            </div>

            <span className="sr-only">AI가 요건을 분석하고 있습니다. 잠시만 기다려 주세요.</span>
        </div>
    );
}
