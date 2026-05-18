'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const isChatPage = pathname === '/chat';

    if (pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <header className="sticky-header">
            <div className="wide-container h-[60px] flex justify-between items-center">
                <div className="flex items-center gap-3 md:gap-6">
                    {isChatPage && (
                        <Link
                            href="/"
                            className="w-8 h-8 rounded-[4px] bg-bg-elevated flex items-center justify-center border border-[rgba(15,0,0,0.12)] hover:border-border-strong transition-colors"
                            aria-label="홈으로 이동"
                        >
                            <ArrowLeft size={16} className="text-text-secondary" />
                        </Link>
                    )}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-[4px] bg-bg-elevated flex items-center justify-center border border-[rgba(15,0,0,0.12)]">
                            <Sparkles size={16} className="text-accent" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-text font-bold text-base leading-none tracking-tight">NESS</h1>
                            <p className="text-text-muted text-[9px] font-medium uppercase tracking-[0.2em] mt-0.5">AI Mentor</p>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-text-muted text-[9px] font-medium uppercase tracking-[0.2em]">Company</span>
                        <span className="text-text-secondary text-[10px] font-medium">잡모아 국민취업지원제도</span>
                    </div>
                    <div className="w-8 h-8 rounded-[4px] bg-white border border-[rgba(15,0,0,0.12)] flex items-center justify-center overflow-hidden">
                        <a href="http://www.jobmoa.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/JobmoaLogo.svg" alt="JobmoaLogo" className="w-6 h-6 object-contain" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
