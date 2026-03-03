/**
 * ChatMessage 컴포넌트
 * AI 메시지와 사용자 메시지를 각각 다른 스타일로 렌더링하는 버블 컴포넌트입니다.
 * 가장 최근 메시지(isLatest)에만 슬라이드-인 애니메이션을 적용합니다.
 */

'use client';

import { Bot, User } from 'lucide-react';
import { Message } from '@/hooks/useChat';

interface ChatMessageProps {
    message: Message;    // 메시지 데이터
    isLatest: boolean;   // 가장 최근 메시지 여부 (애니메이션 적용 여부)
}

/**
 * ChatMessage 컴포넌트
 * role에 따라 AI (왼쪽) 또는 사용자 (오른쪽) 버블로 렌더링합니다.
 */
export default function ChatMessage({ message, isLatest }: ChatMessageProps) {
    // AI 메시지인지 여부
    const isAI = message.role === 'ai';

    return (
        <div
            className={`flex items-end gap-2 ${isAI ? 'justify-start' : 'justify-end'}`}
            // 새 메시지에만 애니메이션 적용 (성능 최적화)
            style={{
                animation: isLatest
                    ? `${isAI ? 'slideInLeft' : 'slideInRight'} 0.25s ease-out`
                    : 'none',
            }}
        >
            {/* AI 아이콘 (왼쪽 정렬 메시지에만 표시) */}
            {isAI && (
                <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-primary-subtle)', border: '1px solid #BFDBFE' }}
                    aria-hidden="true"
                >
                    <Bot size={16} color="var(--color-primary)" />
                </div>
            )}

            {/* 메시지 버블 */}
            <div
                className={isAI ? 'chat-bubble-ai' : 'chat-bubble-user'}
                role="article"
                aria-label={isAI ? 'AI 메시지' : '내 메시지'}
            >
                {message.content}
            </div>

            {/* 사용자 아이콘 (오른쪽 정렬 메시지에만 표시) */}
            {!isAI && (
                <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--color-gray-200)', border: '1px solid var(--color-gray-300)' }}
                    aria-hidden="true"
                >
                    <User size={16} color="var(--color-gray-500)" />
                </div>
            )}
        </div>
    );
}
