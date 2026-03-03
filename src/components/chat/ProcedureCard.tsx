'use client';

import { ClipboardList, UserCheck, Calculator, PieChart } from 'lucide-react';

export default function ProcedureCard() {
    const procedures = [
        { id: 1, text: '기본 정보 입력', icon: ClipboardList },
        { id: 2, text: '취업 상태 확인', icon: UserCheck },
        { id: 3, text: '소득 및 자산 검증', icon: Calculator },
        { id: 4, text: '최종 결과 진단', icon: PieChart }
    ];

    return (
        <div className="glass-panel rounded-[2rem] p-8 my-6 animate-reveal-up max-w-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-gradient-to-b from-[#2DD4BF] to-[#34D399] rounded-full" />
                <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] opacity-50">
                    Diagnosis Workflow
                </h3>
            </div>

            <div className="space-y-6">
                {procedures.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-5 group">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                            <p.icon size={20} className="text-white/30 group-hover:text-[#2DD4BF] transition-colors" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-0.5">Step 0{p.id}</p>
                            <p className="text-white/80 text-sm font-bold group-hover:text-white transition-colors">{p.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
