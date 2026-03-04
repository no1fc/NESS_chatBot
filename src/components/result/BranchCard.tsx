'use client';

import { MapPin, Phone, ExternalLink, Building2 } from 'lucide-react';
import { Branch } from '@/lib/db';

interface BranchCardProps {
    branch: Branch | null;
    diagnosisType: string;
}

export default function BranchCard({ branch, diagnosisType }: BranchCardProps) {
    const utmParams = new URLSearchParams({
        type: diagnosisType,
        source: 'chatbot',
    }).toString();

    if (!branch) {
        return (
            <div className="mx-auto w-full max-w-lg animate-reveal-up my-8">
                <div className="glass-panel rounded-[2.5rem] p-10 border-2 border-white/5 relative overflow-hidden">
                    <div className="flex flex-col items-center text-center mb-10 relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                            <Building2 size={36} className="text-white/20" />
                        </div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Branch Information</p>
                        <h2 className="text-white text-3xl font-black tracking-tighter">상담 가능한 지점이 없습니다</h2>
                    </div>

                    <div className="bg-white/5 rounded-[1.5rem] p-6 mb-10 border border-white/5 relative z-10">
                        <p className="text-white/60 text-sm leading-relaxed text-center font-medium">
                            선택하신 지역에는 현재 잡모아 지점이 운영되고 있지 않습니다.<br />
                            공식 포털을 통해 온라인으로 신청하실 수 있습니다.
                        </p>
                    </div>

                    <a
                        href={`https://www.work24.go.kr/ua/z/z/1100/selectOperInst.do?currentPageNo=1&recordCountPerPage=10&srchType=&srchRegionCd=&srchBizSecd=K&srchRegionDetailCd=&srchKeyword=%EC%9E%A1%EB%AA%A8%EC%95%84`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-black text-sm flex items-center justify-center gap-3 transition-all hover:bg-white/10 group relative z-10"
                    >
                        <ExternalLink size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        고용24에서 바로 신청하기
                    </a>
                </div>
            </div>
        );
    }

    const branchUrl = branch.specific_url.includes('?')
        ? `${branch.specific_url}&${utmParams}`
        : `${branch.specific_url}?${utmParams}`;

    return (
        <div className="mx-auto w-full max-w-lg animate-reveal-up my-8">
            <div className="glass-panel rounded-[2.5rem] p-10 border-2 border-[#2DD4BF]/20 relative overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.1)]">
                {/* 배경 오로라 */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2DD4BF] rounded-full blur-[100px] opacity-10 pointer-events-none" />

                <div className="flex flex-col items-center text-center mb-10 relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-[#2DD4BF]/10 flex items-center justify-center mb-6 border border-[#2DD4BF]/20 backdrop-blur-3xl">
                        <Building2 size={36} className="text-[#2DD4BF]" />
                    </div>
                    <p className="text-[#2DD4BF] text-[10px] font-black uppercase tracking-[0.3em] mb-3">Nearby Branch</p>
                    <h2 className="text-white text-4xl font-black tracking-tighter">{branch.branch_name}</h2>
                </div>

                <div className="space-y-4 mb-10 relative z-10">
                    {/* 주소 */}
                    <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/5 flex gap-5 hover:bg-white/[0.08] transition-colors">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-500/20">
                            <MapPin size={20} className="text-red-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Address</p>
                            <p className="text-white/90 text-sm font-bold leading-relaxed">{branch.address}</p>
                        </div>
                    </div>

                    {/* 연락처 */}
                    <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/5 flex gap-5 hover:bg-white/[0.08] transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                            <Phone size={20} className="text-emerald-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-1">Phone</p>
                            <a href={`tel:${branch.phone}`} className="text-emerald-400 text-xl font-black tracking-tighter hover:underline decoration-2 underline-offset-4">
                                {branch.phone}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                    <a
                        href={branchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-[#2DD4BF] to-[#34D399] text-[#0B1120] font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] active:scale-[0.98]"
                    >
                        <ExternalLink size={20} />
                        지금 바로 신청하기
                    </a>

                    <a
                        href={`tel:${branch.phone}`}
                        className="w-full h-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-black text-sm flex items-center justify-center gap-3 transition-all hover:bg-white/10"
                    >
                        <Phone size={20} />
                        전화 상담 예약
                    </a>
                </div>

                <p className="text-center text-[10px] text-white/10 mt-10 leading-relaxed font-sans font-medium">
                    지점별 상황에 따라 대기 시간이 발생할 수 있습니다.<br />
                    전문 상담원의 안내는 전액 무료로 제공됩니다.
                </p>
            </div>
        </div>
    );
}
