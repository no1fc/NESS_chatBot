'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface RetryButtonProps {
    onRetry: () => void;
    cooldownSeconds?: number;
}

export default function RetryButton({ onRetry, cooldownSeconds = 30 }: RetryButtonProps) {
    const [timeLeft, setTimeLeft] = useState(cooldownSeconds);
    const [isCounting, setIsCounting] = useState(true);

    useEffect(() => {
        if (!isCounting || timeLeft <= 0) {
            setIsCounting(false);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isCounting, timeLeft]);

    const handleRetry = () => {
        if (timeLeft > 0) return;
        onRetry();
        // 리트라이 클릭 시 다시 쿨다운 시작 (필요한 경우)
        setTimeLeft(cooldownSeconds);
        setIsCounting(true);
    };

    return (
        <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
                onClick={handleRetry}
                disabled={timeLeft > 0}
                className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all
                    ${timeLeft > 0
                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 active:scale-95 shadow-lg shadow-white/5'
                    }
                `}
            >
                <RefreshCw size={16} className={`${timeLeft > 0 ? '' : 'animate-spin-once'}`} />
                <span>
                    {timeLeft > 0 ? `재시도 (${timeLeft}s)` : '재시도'}
                </span>
            </button>
        </div>
    );
}

// Tailwind 전용 애니메이션 추가가 필요할 수 있음 (또는 인라인)
