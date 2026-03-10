'use client';

import { CheckCircle2, AlertTriangle, XCircle, Trophy, Lightbulb, MapPin } from 'lucide-react';
import { DiagnosisResult } from '@/hooks/useChat';

const TYPE_CONFIG = {
    '1유형_요건심사형': {
        icon: CheckCircle2,
        iconColor: '#34D399',
        borderColor: 'rgba(52, 211, 153, 0.2)',
        glow: 'shadow-[0_0_40px_rgba(52,211,153,0.1)]',
        label: '1유형 (요건심사형)',
        emoji: '🎉',
    },
    '1유형_선발형': {
        icon: Trophy,
        iconColor: '#2DD4BF',
        borderColor: 'rgba(45, 212, 191, 0.2)',
        glow: 'shadow-[0_0_40px_rgba(45,212,191,0.1)]',
        label: '1유형 (선발형)',
        emoji: '🏆',
    },
    '2유형': {
        icon: AlertTriangle,
        iconColor: '#FBBF24',
        borderColor: 'rgba(251, 191, 36, 0.1)',
        glow: 'shadow-[0_0_40px_rgba(251,191,36,0.05)]',
        label: '2유형 (일반형)',
        emoji: '📋',
    },
    '제한': {
        icon: XCircle,
        iconColor: '#F87171',
        borderColor: 'rgba(248, 113, 113, 0.2)',
        glow: 'shadow-[0_0_40px_rgba(248,113,113,0.1)]',
        label: '참여 제한',
        emoji: '⚠️',
    },
};

export default function ResultCard({ result }: { result: DiagnosisResult }) {
    const config = TYPE_CONFIG[result.type] ?? TYPE_CONFIG['2유형'];
    const IconComponent = config.icon;
    const isRestricted = result.type === '제한';

    return (
        <div className="w-full h-full animate-reveal-up flex flex-col">
            <div
                className={`glass-panel rounded-[2.5rem] p-5 md:p-6 border-2 overflow-hidden relative flex flex-col h-full ${config.glow}`}
                style={{ borderColor: config.borderColor }}
            >
                {/* 배경 오로라 효과 */}
                <div
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none"
                    style={{ backgroundColor: config.iconColor }}
                />

                <div className="flex flex-col items-center text-center mb-4 relative z-10 shrink-0">
                    <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 backdrop-blur-3xl">
                        <IconComponent size={28} color={config.iconColor} />
                    </div>
                    <p className="text-[#2DD4BF] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Diagnosis Result</p>
                    <h2 className="text-white text-2xl md:text-3xl font-black tracking-tighter mb-1">{config.label}</h2>
                    {result.subType && <p className="text-white/40 text-xs md:text-sm font-medium">{result.subType}</p>}
                </div>

                {result.score !== null && result.score !== undefined && (
                    <div className="bg-white/5 rounded-[2rem] p-5 mb-5 border border-white/5 relative z-10 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Eligibility Score</p>
                                <p className="text-white/90 text-sm font-bold">종합 판정 점수</p>
                            </div>
                            <div className="text-right">
                                <span className="text-4xl font-black text-[#2DD4BF] tracking-tighter">{result.score}</span>
                                <span className="text-white/10 text-xl font-bold ml-1">/100</span>
                            </div>
                        </div>

                        {result.scoreDetails && result.scoreDetails.length > 0 && (
                            <div className="mt-5 pt-4 border-t border-white/5 space-y-2.5">
                                {result.scoreDetails.map((detail, idx) => (
                                    <div key={idx} className="flex items-start gap-3 text-xs text-white/40 leading-relaxed group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]/30 mt-1 transition-transform group-hover:scale-125" />
                                        <span className="group-hover:text-white/70 transition-colors">{detail}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 컨텐츠 (스크롤 여유 공간) */}
                <div className="flex-1 flex flex-col justify-center mb-4 relative z-10 shrink-0">
                    <div className="relative py-4 px-5 border border-[#2DD4BF]/30 rounded-[2rem] bg-gradient-to-br from-[#2DD4BF]/10 to-transparent shadow-[inset_0_0_30px_rgba(45,212,191,0.05)]">

                        <p className="text-white/90 text-sm leading-relaxed font-medium text-justify relative z-10">
                            {result.description.split('\n').map((line, i) => (
                                <span key={i}>{line}<br /></span>
                            ))}
                        </p>
                    </div>
                </div>

                {isRestricted && result.restrictReason && (
                    <div className="mb-4 p-4 md:p-5 rounded-[1.5rem] bg-red-500/5 border border-red-500/20 relative z-10 shrink-0">
                        <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">Restriction Reason</p>
                        <p className="text-red-200 text-sm font-bold leading-relaxed">{result.restrictReason}</p>
                    </div>
                )}

                {result.tips && result.tips.length > 0 && (
                    <div className="mb-4 space-y-2.5 relative z-10 shrink-0">
                        <div className="flex items-center gap-2 ml-1">
                            <Lightbulb size={14} className="text-[#FBBF24]" />
                            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">AI Mentor's Advice</span>
                        </div>
                        {result.tips.map((tip, idx) => (
                            <div key={idx} className="p-4 rounded-[1.5rem] bg-white/5 border border-white/5 text-xs md:text-sm text-white/60 font-medium leading-relaxed hover:bg-white/[0.08] transition-colors">
                                {tip}
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2.5 relative z-10 mt-auto pt-2 shrink-0">
                    {isRestricted && (
                        <a
                            href="https://www.work24.go.kr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-12 md:h-14 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-black text-xs md:text-sm flex items-center justify-center gap-3 transition-all hover:bg-white/10"
                        >
                            고용24 공식 사이트 방문
                        </a>
                    )}
                    <p className="text-center text-[10px] text-white/20 mt-2 leading-relaxed font-sans">
                        본 결과는 단순 참고용이며, 정확한 수급 자격은 관할 고용센터의 공식 심사를 통해 결정됩니다.
                    </p>
                </div>
            </div>
        </div>
    );
}
