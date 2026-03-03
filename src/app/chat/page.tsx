'use client';

import ChatContainer from '@/components/chat/ChatContainer';

export default function ChatPage() {
    return (
        <div className="h-screen bg-[#0B1120] overflow-hidden">
            {/* 메인 채팅 영역 */}
            <main className="h-full flex flex-col relative overflow-hidden">
                <ChatContainer />
            </main>
        </div>
    );
}
