"use client";

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
        <div className="relative w-full aspect-[4/5] max-h-[60vh] lg:max-h-[70vh] rounded-[4px] border border-[rgba(15,0,0,0.12)] bg-bg-elevated overflow-hidden flex flex-col">
            {/* Top Bar */}
            <div className="flex items-center gap-3 p-4 border-b border-[rgba(15,0,0,0.12)]">
                <div className="w-8 h-8 rounded-[4px] bg-accent flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">N.</span>
                </div>
                <div>
                    <h3 className="text-text text-sm font-bold">NESS</h3>
                    <p className="text-accent text-[10px]">AI 멘토 접속 중</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col justify-end gap-3">
                <div className="flex flex-col gap-3 max-h-full overflow-y-auto no-scrollbar pb-2">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`max-w-[85%] p-3 text-sm rounded-[4px] animate-fade-in ${msg.sender === 'user'
                                ? 'bg-bg text-text self-end border border-[rgba(15,0,0,0.12)]'
                                : msg.sender === 'system'
                                    ? 'text-accent text-xs font-mono self-center text-center'
                                    : 'bg-bg border border-[rgba(15,0,0,0.12)] text-text self-start'
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}

                    {currentIndex < DUMMY_MESSAGES.length && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                        <div className="bg-bg border border-[rgba(15,0,0,0.12)] p-3 rounded-[4px] self-start flex gap-1 items-center animate-fade-in">
                            <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Input Mock */}
            <div className="p-4 border-t border-[rgba(15,0,0,0.12)] mt-auto">
                <div className="h-10 rounded-[6px] bg-bg border border-[rgba(15,0,0,0.12)] flex items-center px-4">
                    <span className="text-text-muted text-xs">메시지를 입력하세요...</span>
                </div>
            </div>
        </div>
    );
}
