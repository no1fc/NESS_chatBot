/**
 * 챗봇 메인 페이지 (/chat)
 * ChatContainer를 포함하는 챗봇 인터페이스 페이지입니다.
 * 상단에 헤더(로고, 뒤로가기)를 포함하고 나머지 공간을 ChatContainer에 할당합니다.
 */

'use client';

import Link from 'next/link';
import { ArrowLeft, BotIcon } from 'lucide-react';
import ChatContainer from '@/components/chat/ChatContainer';

/**
 * 챗봇 페이지 컴포넌트
 * 헤더 + 챗 인터페이스(ChatContainer)로 구성됩니다.
 */
export default function ChatPage() {
    return (
        <div className="flex flex-col chat-page-height max-w-lg mx-auto">
            {/* ============================
          상단 헤더
      * 뒤로가기, 로고, 서비스명
      ============================ */}
            <header
                className="flex items-center gap-3 px-4 py-3 sticky top-0 z-20"
                style={{
                    background: 'white',
                    borderBottom: '1px solid var(--color-gray-200)',
                    boxShadow: 'var(--shadow-sm)',
                }}
            >
                {/* 뒤로가기 버튼 */}
                <Link
                    href="/"
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                        background: 'var(--color-gray-100)',
                        color: 'var(--color-gray-600)',
                        transition: 'var(--transition-fast)',
                    }}
                    aria-label="메인 페이지로 돌아가기"
                >
                    <ArrowLeft size={18} />
                </Link>

                {/* 로고 및 서비스명 */}
                <div className="flex items-center gap-2 flex-1">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--color-primary)' }}
                        aria-hidden="true"
                    >
                        <BotIcon size={16} color="white" />
                    </div>
                    <div>
                        <p
                            className="text-sm font-bold leading-tight"
                            style={{ color: 'var(--color-gray-900)' }}
                        >
                            NESS 자가진단 챗봇
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>
                            ● 상담 가능
                        </p>
                    </div>
                </div>

                {/* 잡모아 브랜드 태그 */}
                <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                        background: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                    }}
                >
                    잡모아
                </span>
            </header>

            {/* ============================
          ChatContainer (챗봇 핵심 UI)
      ============================ */}
            <div className="flex-1 overflow-hidden">
                <ChatContainer />
            </div>
        </div>
    );
}
