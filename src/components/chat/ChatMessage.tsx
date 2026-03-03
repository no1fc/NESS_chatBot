'use client';

import { Message } from '@/hooks/useChat';
import { Sparkles, User } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
    isLatest: boolean;
}

export default function ChatMessage({ message, isLatest }: ChatMessageProps) {
    const isAI = message.role === 'ai';

    return (
        <div
            className={`flex flex-col w-full mb-12 ${isLatest ? 'animate-reveal-up' : ''}`}
            style={{ animationDuration: '0.6s' }}
        >
            {isAI ? (
                /* AI 메시지 - 가운데 정렬 레이아웃 */
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto w-full">
                    {/* 아이콘 상단 중앙 */}
                    <div className="w-10 h-10 rounded-full bg-[#1F2937] flex items-center justify-center border border-white/5 mb-4 shadow-xl shadow-black/20">
                        <Sparkles size={18} className="text-[#2DD4BF]" />
                    </div>

                    <div className="text-[10px] font-black tracking-[0.2em] uppercase mb-3 text-[#2DD4BF] text-flow bg-clip-text text-transparent bg-gradient-to-r from-[#2DD4BF] via-[#34D399] to-[#2DD4BF]">
                        Ness AI Mentor
                    </div>

                    <div className="text-[16px] leading-[1.8] tracking-tight text-white/90 font-medium whitespace-pre-wrap">
                        {message.content}
                    </div>
                </div>
            ) : (
                /* 사용자 메시지 - 우측 정렬 또는 강조형 레이아웃 */
                <div className="flex flex-col items-end w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="text-[10px] font-black tracking-[0.1em] uppercase text-white/20">
                            You
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                            <User size={12} className="text-white/40" />
                        </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.05] px-6 py-4 rounded-[2rem] rounded-tr-none text-white/80 text-[15px] max-w-[85%] shadow-lg">
                        {message.content}
                    </div>
                </div>
            )}
        </div>
    );
}
