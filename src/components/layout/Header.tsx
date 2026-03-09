'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const isChatPage = pathname === '/chat';

    // 관리자 페이지에서는 상단 헤더 숨김
    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header className="sticky-header">
            <div className="wide-container h-[80px] flex justify-between items-center">
                <div className="flex items-center gap-3 md:gap-6">
                    {isChatPage && (
                        <Link
                            href="/"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all hover:-translate-x-1"
                            aria-label="홈으로 이동"
                        >
                            <ArrowLeft size={18} className="text-white/40" />
                        </Link>
                    )}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-2xl bg-[#2DD4BF]/10 flex items-center justify-center border border-[#2DD4BF]/20 transition-all group-hover:scale-110">
                            <Sparkles size={20} className="text-[#2DD4BF]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-white font-black text-lg leading-none tracking-tighter">NESS</h1>
                            <p className="text-[#2DD4BF] text-[9px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">AI MENTOR</p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">Partner</span>
                        <span className="text-white/60 text-[10px] font-bold">잡모아 국민취업지원제도</span>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white border border-white/10 flex items-center justify-center overflow-hidden">
                        <img src="/JobmoaLogo.svg" alt="JobmoaLogo" className="w-8 h-8 object-contain opacity-100" />
                    </div>
                </div>
            </div>
        </header>
    );
}
