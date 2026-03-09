"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const DUMMY_MESSAGES = [
    { sender: 'user', text: "안녕하세요, NESS. 구직촉진수당 대상자인지 확인하고 싶어요." },
    { sender: 'ness', text: "네, 안녕하세요! 정확한 진단을 위해 몇 가지 질문을 드리겠습니다. 현재 연령대가 어떻게 되시나요?" },
    { sender: 'user', text: "만 26세입니다. 독립해서 혼자 살고 있어요." },
    { sender: 'ness', text: "알겠습니다. 청년층에 해당하시네요. 2026년 기준 1인 가구 중위소득 60%를 만족한다면 1유형 혜택을 받으실 수 있습니다." },
    { sender: 'system', text: "분석 중: 98% 확률로 [1유형] 대상자 매칭..." }
];

export default function VirtualChatDemo() {
    const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (currentIndex < DUMMY_MESSAGES.length) {
            timer = setTimeout(() => {
                setMessages(prev => [...prev, DUMMY_MESSAGES[currentIndex]]);
                setCurrentIndex(prev => prev + 1);
            }, currentIndex === 0 ? 500 : 2500);
        } else {
            timer = setTimeout(() => {
                setMessages([]);
                setCurrentIndex(0);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [currentIndex]);

    return (
        <div className="relative w-full max-w-md aspect-[4/5] md:aspect-[4/5] max-h-[50vh] md:max-h-none mx-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2DD4BF] to-[#2563EB] flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">N.</span>
                </div>
                <div>
                    <h3 className="text-white text-sm font-bold">NESS</h3>
                    <p className="text-[#2DD4BF] text-[10px]">AI 멘토 접속 중</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col justify-end gap-4">
                <div className="flex flex-col gap-4 max-h-full overflow-y-auto no-scrollbar pb-2">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`max-w-[85%] p-3 text-sm rounded-2xl ${msg.sender === 'user'
                                ? 'bg-white/10 text-white self-end rounded-tr-sm'
                                : msg.sender === 'system'
                                    ? 'bg-transparent text-[#2DD4BF] text-xs font-mono self-center text-center'
                                    : 'bg-gradient-to-br from-[#2DD4BF]/20 to-[#2563EB]/20 border border-white/5 text-white self-start rounded-tl-sm'
                                }`}
                        >
                            {msg.text}
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {currentIndex < DUMMY_MESSAGES.length && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="bg-white/5 p-3 rounded-2xl rounded-tl-sm self-start flex gap-1 items-center"
                        >
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom Input Mock */}
            <div className="p-4 border-t border-white/10 mt-auto bg-black/20">
                <div className="h-10 rounded-full bg-white/5 border border-white/10 flex items-center px-4">
                    <span className="text-white/20 text-xs">메시지를 입력하세요...</span>
                </div>
            </div>
        </div>
    );
}
