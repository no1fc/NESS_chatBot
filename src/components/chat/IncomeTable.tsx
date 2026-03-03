/**
 * IncomeTable 컴포넌트
 * 중위소득 기준표를 카드 형태로 표시합니다.
 * 가구원수별 기준 중위소득 60%, 100%, 120% 금액을 안내합니다.
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

// 2026년 기준 중위소득 데이터
const INCOME_TABLE = [
    { 가구원수: '1인', '60%': '1,538,542원', '100%': '2,564,238원', '120%': '3,077,085원' },
    { 가구원수: '2인', '60%': '2,519,575원', '100%': '4,199,292원', '120%': '5,039,150원' },
    { 가구원수: '3인', '60%': '3,215,421원', '100%': '5,359,036원', '120%': '6,430,843원' },
    { 가구원수: '4인', '60%': '3,896,842원', '100%': '6,494,738원', '120%': '7,793,685원' },
    { 가구원수: '5인', '60%': '4,534,031원', '100%': '7,556,719원', '120%': '9,068,062원' },
    { 가구원수: '6인', '60%': '5,133,571원', '100%': '8,555,952원', '120%': '10,267,142원' },
];

/**
 * IncomeTable 컴포넌트
 * 접기/펼치기 기능이 있는 중위소득 기준표를 렌더링합니다.
 */
export default function IncomeTable() {
    // 테이블 접기/펼치기 상태
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    return (
        <div
            className="mx-auto w-full rounded-2xl overflow-hidden animate-fade-in-up"
            style={{
                maxWidth: '480px',
                border: '1px solid #BFDBFE',
                background: 'white',
                boxShadow: 'var(--shadow-sm)',
                animation: 'fadeInUp 0.3s ease-out',
            }}
        >
            {/* 헤더 (클릭으로 접기/펼치기) */}
            <button
                className="w-full flex items-center justify-between px-4 py-3"
                style={{ background: 'var(--color-primary-subtle)' }}
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
                aria-controls="income-table-body"
                aria-label="기준 중위소득 표 열기/닫기"
            >
                <div className="flex items-center gap-2">
                    <Info size={15} color="var(--color-primary)" aria-hidden="true" />
                    <span
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-primary-dark)' }}
                    >
                        📊 2026년 기준 중위소득 참고표
                    </span>
                </div>
                {/* 접기/펼치기 아이콘 */}
                {isExpanded ? (
                    <ChevronUp size={16} color="var(--color-primary)" aria-hidden="true" />
                ) : (
                    <ChevronDown size={16} color="var(--color-primary)" aria-hidden="true" />
                )}
            </button>

            {/* 테이블 본문 (isExpanded 시만 표시) */}
            {isExpanded && (
                <div id="income-table-body" className="overflow-x-auto">
                    <table
                        className="w-full text-xs"
                        style={{ borderCollapse: 'collapse' }}
                        aria-label="2026년 기준 중위소득 표"
                    >
                        {/* 테이블 헤더 */}
                        <thead>
                            <tr style={{ background: '#EFF6FF', borderBottom: '1px solid #BFDBFE' }}>
                                <th
                                    className="px-3 py-2 text-left font-semibold"
                                    style={{ color: 'var(--color-gray-700)' }}
                                >
                                    가구원수
                                </th>
                                <th
                                    className="px-3 py-2 text-right font-semibold"
                                    style={{ color: '#10B981' }} // 초록: 1유형 기준
                                >
                                    60%
                                    <br />
                                    <span className="font-normal opacity-70">(1유형 기준)</span>
                                </th>
                                <th
                                    className="px-3 py-2 text-right font-semibold"
                                    style={{ color: '#F59E0B' }} // 노랑: 2유형 기준
                                >
                                    100%
                                    <br />
                                    <span className="font-normal opacity-70">(2유형 기준)</span>
                                </th>
                                <th
                                    className="px-3 py-2 text-right font-semibold"
                                    style={{ color: 'var(--color-primary)' }} // 파랑: 청년 2유형
                                >
                                    120%
                                    <br />
                                    <span className="font-normal opacity-70">(청년 기준)</span>
                                </th>
                            </tr>
                        </thead>
                        {/* 테이블 데이터 행 */}
                        <tbody>
                            {INCOME_TABLE.map((row, idx) => (
                                <tr
                                    key={row.가구원수}
                                    style={{
                                        // 짝수/홀수 행 배경색 교차
                                        background: idx % 2 === 0 ? 'white' : '#F8FAFC',
                                        borderBottom: '1px solid #E2E8F0',
                                    }}
                                >
                                    {/* 가구원수 */}
                                    <td
                                        className="px-3 py-2 font-medium"
                                        style={{ color: 'var(--color-gray-900)' }}
                                    >
                                        {row.가구원수}
                                    </td>
                                    {/* 60% */}
                                    <td
                                        className="px-3 py-2 text-right"
                                        style={{ color: '#065F46' }}
                                    >
                                        {row['60%']}
                                    </td>
                                    {/* 100% */}
                                    <td
                                        className="px-3 py-2 text-right"
                                        style={{ color: '#92400E' }}
                                    >
                                        {row['100%']}
                                    </td>
                                    {/* 120% */}
                                    <td
                                        className="px-3 py-2 text-right"
                                        style={{ color: '#1E40AF' }}
                                    >
                                        {row['120%']}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 안내 문구 */}
                    <div className="px-3 py-2" style={{ background: '#FFFBEB', borderTop: '1px solid #FDE68A' }}>
                        <p className="text-xs" style={{ color: '#92400E' }}>
                            ⚠️ 위 금액은 <strong>월 소득</strong> 기준이며, 가구 전체 소득 합산 금액과 비교합니다.
                            소득에는 근로소득, 사업소득, 재산소득, 이전소득 등이 포함됩니다.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
