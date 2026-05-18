'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { BarChart3, Loader2, Calendar, Filter } from 'lucide-react';
import { logger } from '@/lib/logger';

interface UsageStat {
    log_date: string;
    model_name: string;
    total_input_tokens: number;
    total_output_tokens: number;
    total_tokens_used: number;
    request_count: number;
}

type Period = 'day' | 'month' | 'year';

export default function UsageStatsPage() {
    const [stats, setStats] = useState<UsageStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<Period>('day');
    const [dateFilter, setDateFilter] = useState<string>('');

    const fetchStats = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('period', period);
            if (dateFilter) {
                params.append('date', dateFilter);
            }

            const res = await fetch(`/api/admin/usage?${params.toString()}`);
            const data = await res.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (err) {
            logger.error('Failed to fetch usage stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [period, dateFilter]);

    // 차트용 데이터 가공 (날짜별 총 토큰량 합산. 오름차순 정렬)
    const chartData = useMemo(() => {
        const grouped = stats.reduce((acc, curr) => {
            if (!acc[curr.log_date]) {
                acc[curr.log_date] = 0;
            }
            // 모델이 여러개일 수도 있으므로, 해당 일자의 모든 모델 토큰을 합산합니다.
            acc[curr.log_date] += curr.total_tokens_used;
            return acc;
        }, {} as Record<string, number>);

        // 날짜가 역순(DESC)으로 오기 때문에 차트는 과거부터 나오게 오름차순(ASC) 정렬
        const sortedDates = Object.keys(grouped).sort();
        return sortedDates.map(date => ({
            date,
            value: grouped[date]
        }));
    }, [stats]);

    const maxChartValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
                        <BarChart3 className="text-[var(--color-accent)]" /> API 사용량 통계
                    </h1>
                    <p className="text-[var(--color-text-muted)]">기간별 통계를 바탕으로 챗봇 진단 횟수와 토큰 사용량을 확인할 수 있습니다.</p>
                </div>

                {/* 필터 조작 패널 */}
                <div className="flex items-center bg-[var(--color-bg-elevated)] p-2 rounded-[4px] border border-[var(--color-border)] whitespace-nowrap max-w-full overflow-x-auto">
                    <div className="flex items-center gap-2 px-3 border-r border-[var(--color-border)]">
                        <Filter size={16} className="text-[var(--color-text-muted)]" />
                        <select
                            value={period}
                            onChange={(e) => {
                                setPeriod(e.target.value as Period);
                                setDateFilter(''); // 구분 단위 변경 시 날짜 텍스트 초기화
                            }}
                            className="text-sm border-none bg-transparent focus:ring-0 text-[var(--color-text-secondary)] font-medium cursor-pointer outline-none"
                        >
                            <option value="day">일별 (Day)</option>
                            <option value="month">월별 (Month)</option>
                            <option value="year">연도별 (Year)</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2 px-3">
                        <Calendar size={16} className="text-[var(--color-text-muted)]" />
                        <input
                            type={period === 'year' ? 'number' : period === 'month' ? 'month' : 'date'}
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            placeholder={period === 'year' ? '예: 2026' : '선택 해제'}
                            className="text-sm border-none bg-transparent focus:ring-0 text-[var(--color-text-secondary)] cursor-pointer min-w-[120px] outline-none"
                            min={period === 'year' ? "2024" : undefined}
                            max={period === 'year' ? "2030" : undefined}
                        />
                    </div>
                    <div className="px-2">
                        <button
                            onClick={() => { setPeriod('day'); setDateFilter(''); }}
                            className="hover:bg-[var(--color-bg)] px-2 py-1 rounded-[4px] text-xs text-[var(--color-text-muted)] transition-colors"
                        >
                            초기화
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* CSS 애니메이션 차트 아일랜드 */}
                    <div className="bg-[var(--color-bg-elevated)] p-6 rounded-[4px] border border-[var(--color-border)] overflow-hidden">
                        <h2 className="text-base font-semibold text-[var(--color-text)] mb-6 flex items-center justify-between">
                            <span>토큰 사용량 분포 차트</span>
                            <span className="text-xs font-normal bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2 py-1 rounded-[4px]">
                                {period === 'year' ? '연도별' : period === 'month' ? '월별' : '일별'} 합산치
                            </span>
                        </h2>

                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center py-16 text-[var(--color-text-muted)] text-sm bg-[var(--color-bg)] rounded-[4px] border border-dashed border-[var(--color-border)]">
                                해당 조건의 데이터가 없습니다.
                            </div>
                        ) : (
                            <div className="relative h-64 flex items-end overflow-x-auto overflow-y-hidden pb-8 pt-4 px-2 custom-scrollbar">
                                {/* y축 라인 및 스케일 텍스트 */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4 border-b border-[var(--color-border)]">
                                    {[1, 0.75, 0.5, 0.25, 0].map(multiplier => (
                                        <div key={multiplier} className="w-full flex items-center border-t border-dashed border-[var(--color-border)] h-0 z-0">
                                            <span className="absolute left-0 -translate-y-1/2 text-[10px] text-[var(--color-text-muted)] bg-[var(--color-bg-elevated)] pr-2 rounded tracking-tighter">
                                                {Math.round(maxChartValue * multiplier).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="ml-12 flex items-end gap-3 sm:gap-6 h-full min-w-max relative z-10 pt-4">
                                    {chartData.map((d, i) => {
                                        const heightPercent = maxChartValue > 0 ? (d.value / maxChartValue) * 100 : 0;
                                        return (
                                            <div key={i} className="flex flex-col items-center group flex-1 min-w-[36px] max-w-[56px] relative h-full justify-end">
                                                {/* 호버 툴팁 */}
                                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-bg)] text-[var(--color-text)] text-xs py-1.5 px-2.5 rounded-[4px] whitespace-nowrap z-20 pointer-events-none transform -translate-x-1/2 left-1/2">
                                                    <span className="font-semibold">{d.value.toLocaleString()}</span> Tokens
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--color-bg)]" />
                                                </div>

                                                {/* 막대 그래프 */}
                                                <div
                                                    className="w-full bg-gradient-to-t from-[var(--color-accent)] to-[var(--color-accent)]/60 rounded-t-[4px] transition-all duration-700 ease-out group-hover:brightness-110 border border-[var(--color-accent)]/20"
                                                    style={{ height: `${Math.max(heightPercent, 2)}%` }} // 최소 2% 높이 보장 (0이어도 클릭 가능하도록)
                                                />

                                                {/* X축 날짜 라벨 */}
                                                <div className="absolute -bottom-6 text-[11px] text-[var(--color-text-muted)] whitespace-nowrap font-medium text-center truncate w-full" title={d.date}>
                                                    {period === 'day' ? d.date.split('-').slice(1).join('/') : d.date}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 통계 상세 표 (Table) */}
                    <div className="bg-[var(--color-bg-elevated)] rounded-[4px] border border-[var(--color-border)] overflow-hidden text-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[var(--color-text-secondary)]">
                                <thead className="bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">날짜 ({period === 'year' ? 'Year' : period === 'month' ? 'Month' : 'Date'})</th>
                                        <th className="px-6 py-4 font-semibold">사용된 모델명</th>
                                        <th className="px-6 py-4 font-semibold text-right">진단(요청) 횟수</th>
                                        <th className="px-6 py-4 font-semibold text-right">입력 토큰(Input)</th>
                                        <th className="px-6 py-4 font-semibold text-right">출력 토큰(Output)</th>
                                        <th className="px-6 py-4 font-semibold text-right text-[var(--color-text)] border-l border-[var(--color-border)]">합계 토큰(Total)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border)]">
                                    {stats.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-[var(--color-text-muted)]">
                                                해당 기간의 통계 데이터가 검색되지 않습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.map((stat, idx) => (
                                            <tr key={idx} className="hover:bg-[var(--color-bg)] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--color-text)]">
                                                    {stat.log_date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                                                        {stat.model_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-medium text-[var(--color-text-secondary)]">{stat.request_count.toLocaleString()}</span>건
                                                </td>
                                                <td className="px-6 py-4 text-right">{stat.total_input_tokens.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right text-[var(--color-success)]">{stat.total_output_tokens.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right font-bold text-[var(--color-accent)] bg-[var(--color-accent)]/5 border-l border-[var(--color-border)]">
                                                    {stat.total_tokens_used.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: var(--color-border-strong);
                    border-radius: 4px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: var(--color-text-secondary);
                }
            `}</style>
        </div>
    );
}
