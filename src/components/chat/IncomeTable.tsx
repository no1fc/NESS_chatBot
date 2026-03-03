'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Table } from 'lucide-react';

const INCOME_TABLE = [
    { 가구원수: '1인', '60%': '1,538,542원', '100%': '2,564,238원', '120%': '3,077,085원' },
    { 가구원수: '2인', '60%': '2,519,575원', '100%': '4,199,292원', '120%': '5,039,150원' },
    { 가구원수: '3인', '60%': '3,215,421원', '100%': '5,359,036원', '120%': '6,430,843원' },
    { 가구원수: '4인', '60%': '3,896,842원', '100%': '6,494,738원', '120%': '7,793,685원' },
    { 가구원수: '5인', '60%': '4,534,031원', '100%': '7,556,719원', '120%': '9,068,062원' },
    { 가구원수: '6인', '60%': '5,133,571원', '100%': '8,555,952원', '120%': '10,267,142원' },
];

export default function IncomeTable() {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    return (
        <div className="mx-auto w-full max-w-lg mb-8 animate-reveal-up">
            <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
                {/* 헤더 */}
                <button
                    className="w-full flex items-center justify-between px-8 py-6 transition-all hover:bg-white/[0.03] group"
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 flex items-center justify-center border border-[#2DD4BF]/20 group-hover:bg-[#2DD4BF]/20 transition-colors">
                            <Table size={18} className="text-[#2DD4BF]" />
                        </div>
                        <div className="text-left">
                            <p className="text-[#2DD4BF] text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">Reference Data</p>
                            <span className="text-white font-black text-sm tracking-tight">2026년 기준 중위소득 확인</span>
                        </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={14} className="text-white/40" />
                    </div>
                </button>

                {/* 본문 */}
                <div
                    className={`transition-all duration-500 ease-in-out border-t border-white/5 overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12px] border-collapse">
                            <thead>
                                <tr className="bg-white/[0.02]">
                                    <th className="px-6 py-4 text-left font-black text-white/30 uppercase tracking-widest text-[10px]">HH Size</th>
                                    <th className="px-6 py-4 text-right font-black text-[#34D399]">1유형 (60%)</th>
                                    <th className="px-6 py-4 text-right font-black text-[#FBBF24]">2유형 (100%)</th>
                                    <th className="px-6 py-4 text-right font-black text-[#2DD4BF]">청년 (120%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {INCOME_TABLE.map((row) => (
                                    <tr key={row.가구원수} className="hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-4 font-black text-white/40 group-hover:text-white/60 transition-colors">{row.가구원수}</td>
                                        <td className="px-6 py-4 text-right text-white/80 font-medium">{row['60%']}</td>
                                        <td className="px-6 py-4 text-right text-white/80 font-medium">{row['100%']}</td>
                                        <td className="px-6 py-4 text-right text-white font-black">{row['120%']}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-5 bg-black/20 border-t border-white/5">
                        <div className="flex gap-4 items-start">
                            <Info size={14} className="text-white/20 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-white/30 font-medium">
                                위 금액은 <strong>월 소득 인정액</strong>이며, 가구원 전체의 소득(근로, 사업, 재산, 이전소득 등)을 합산하여 판정합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
