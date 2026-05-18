'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Info, Table, Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

export default function IncomeTable() {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [tableData, setTableData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        fetch('/api/chat/income-table')
            .then(res => res.json())
            .then(data => {
                if (isMounted && data.success && data.data && data.data.length > 0) {
                    setTableData(data.data);
                }
            })
            .catch(err => logger.error('Failed to load income table:', err))
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => { isMounted = false; };
    }, []);

    return (
        <div className="mx-auto w-full max-w-2xl mb-8 animate-reveal-up">
            <div className="rounded-[4px] overflow-hidden border border-[rgba(15,0,0,0.12)] bg-bg-elevated">
                {/* 헤더 */}
                <button
                    className="w-full flex items-center justify-between px-8 py-6 transition-colors hover:bg-bg group"
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[4px] bg-bg flex items-center justify-center border border-[rgba(15,0,0,0.12)] group-hover:border-border-strong transition-colors">
                            <Table size={18} className="text-accent" />
                        </div>
                        <div className="text-left">
                            <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Reference Data</p>
                            <span className="text-text font-black text-base md:text-lg tracking-tight">2026년 기준 중위소득 확인</span>
                        </div>
                    </div>
                    <div className={`w-8 h-8 rounded-[4px] bg-bg flex items-center justify-center border border-[rgba(15,0,0,0.12)] transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={14} className="text-text-muted" />
                    </div>
                </button>

                {/* 본문 */}
                <div
                    className={`transition-all duration-500 ease-in-out border-t border-[rgba(15,0,0,0.12)] overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm md:text-base border-collapse">
                            <thead>
                                <tr className="bg-bg">
                                    <th className="px-6 py-4 text-left font-black text-text-muted uppercase tracking-widest text-[10px]">HH Size</th>
                                    <th className="px-6 py-4 text-right font-black text-success">1유형 (60%)</th>
                                    <th className="px-6 py-4 text-right font-black text-warning">2유형 (100%)</th>
                                    <th className="px-6 py-4 text-right font-black text-accent">청년 (120%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[rgba(15,0,0,0.12)]">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                                            <div className="flex bg-transparent justify-center items-center gap-2">
                                                <Loader2 size={16} className="animate-spin" /> 로딩 중...
                                            </div>
                                        </td>
                                    </tr>
                                ) : (tableData.map((row) => (
                                    <tr key={row.가구원수} className="hover:bg-bg transition-colors group">
                                        <td className="px-6 py-4 font-black text-text-muted group-hover:text-text-secondary transition-colors">{row.가구원수}</td>
                                        <td className="px-6 py-4 text-right text-text-secondary font-medium">{row['60%']}</td>
                                        <td className="px-6 py-4 text-right text-text-secondary font-medium">{row['100%']}</td>
                                        <td className="px-6 py-4 text-right text-text font-black">{row['120%']}</td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-5 bg-bg border-t border-[rgba(15,0,0,0.12)]">
                        <div className="flex gap-4 items-start">
                            <Info size={14} className="text-text-muted mt-0.5" />
                            <p className="text-xs md:text-sm leading-relaxed text-text-secondary font-medium">
                                위 금액은 <strong>월 소득 인정액</strong>이며, 가구원 전체의 소득(근로, 사업, 재산, 이전소득 등)을 합산하여 판정합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
