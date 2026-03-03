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
            className={`flex items-start gap-4 mb-8 ${isLatest ? 'animate-reveal-up' : ''}`}
            style={{ animationDuration: '0.6s' }}
        >
            {/* 아이콘 영역 */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                {isAI ? (
                    <div className="w-full h-full bg-[#1F2937] flex items-center justify-center border border-white/5">
                        <Sparkles size={16} className="text-[#2DD4BF]" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                        <User size={14} className="text-white/40" />
                    </div>
                )}
            </div>

            {/* 메시지 내용 영역 */}
            <div className="flex-1 flex flex-col pt-1">
                <div className={`text-[10px] font-black tracking-[0.2em] uppercase mb-2 ${isAI ? 'text-[#2DD4BF] text-flow bg-clip-text text-transparent bg-gradient-to-r from-[#2DD4BF] via-[#34D399] to-[#2DD4BF]' : 'text-white/20'}`}>
                    {isAI ? 'Ness AI Mentor' : 'User'}
                </div>

                <div className={`text-[15px] leading-[1.7] tracking-tight ${isAI ? 'text-white/80 font-medium' : 'bg-white/[0.03] border border-white/[0.05] px-5 py-4 rounded-[1.5rem] rounded-tl-none text-white/70 self-start max-w-[90%]'}`}>
                    {message.content}
                </div>
            </div>
        </div>
    );
}
