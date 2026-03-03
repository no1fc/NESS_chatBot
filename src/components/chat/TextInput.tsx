/**
 * TextInput 컴포넌트
 * '기타' 선택 시 활성화되는 자유 텍스트 입력 폼입니다.
 * Enter 키 또는 전송 버튼으로 제출하며, 취소 버튼으로 선택지 화면으로 돌아갑니다.
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

interface TextInputProps {
    onSubmit: (text: string) => void;  // 텍스트 제출 콜백
    onCancel: () => void;              // 취소 (선택지 화면으로 돌아가기) 콜백
    disabled: boolean;                 // 로딩 중 비활성화 여부
    placeholder?: string;             // 입력창 플레이스홀더 텍스트
}

/**
 * TextInput 컴포넌트
 * 자유 텍스트 입력 폼. 자동 포커스, Shift+Enter 줄바꿈, Enter 제출 지원.
 */
export default function TextInput({
    onSubmit,
    onCancel,
    disabled,
    placeholder = '상황을 자세히 설명해 주세요... (예: 군 복무를 마치고 3개월째 구직 중입니다)',
}: TextInputProps) {
    // 입력 텍스트 상태
    const [text, setText] = useState<string>('');
    // 텍스트영역 ref (자동 포커스 및 높이 조절)
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 컴포넌트 마운트 시 자동 포커스
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    /**
     * 키보드 이벤트 핸들러
     * Enter: 제출 (Shift+Enter는 줄바꿈)
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Enter 단독: 제출 (기본 줄바꿈 방지)
            e.preventDefault();
            handleSubmit();
        }
        // Shift+Enter: 줄바꿈 허용 (기본 동작)
    };

    /**
     * 제출 핸들러
     * 빈 텍스트 제출 방지 및 길이 제한 적용
     */
    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;

        // 최대 500자 제한 (보안 및 API 비용 절감)
        if (trimmed.length > 500) {
            alert('입력 내용은 500자를 초과할 수 없습니다.');
            return;
        }

        onSubmit(trimmed);
        setText(''); // 입력창 초기화
    };

    // 제출 버튼 활성화 여부
    const canSubmit = text.trim().length > 0 && !disabled;

    return (
        <div
            className="flex flex-col gap-2 animate-fade-in-up"
            style={{ animation: 'fadeInUp 0.2s ease-out' }}
        >
            {/* 취소 버튼 (선택지 화면으로 돌아가기) */}
            <button
                onClick={onCancel}
                className="flex items-center gap-1.5 text-sm self-start"
                style={{ color: 'var(--color-gray-500)' }}
                disabled={disabled}
                aria-label="취소하고 선택지로 돌아가기"
            >
                <X size={14} />
                <span>이전 선택지로 돌아가기</span>
            </button>

            {/* 텍스트 입력 영역 + 전송 버튼 */}
            <div
                className="flex items-end gap-2 rounded-xl p-3"
                style={{
                    border: '2px solid var(--color-primary)',
                    background: 'white',
                }}
            >
                {/* 텍스트 입력 창 */}
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={500}
                    rows={3}
                    className="flex-1 resize-none border-none outline-none text-sm leading-relaxed"
                    style={{
                        fontFamily: 'var(--font-sans)',
                        color: 'var(--color-gray-900)',
                        background: 'transparent',
                    }}
                    aria-label="기타 상황 설명 입력"
                />

                {/* 전송 버튼 */}
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                        background: canSubmit ? 'var(--color-primary)' : 'var(--color-gray-200)',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        transition: 'var(--transition-fast)',
                    }}
                    aria-label="메시지 전송"
                >
                    <Send size={16} color={canSubmit ? 'white' : 'var(--color-gray-400)'} />
                </button>
            </div>

            {/* 글자 수 표시 */}
            <span className="text-xs text-right" style={{ color: 'var(--color-gray-500)' }}>
                {text.length} / 500
            </span>
        </div>
    );
}
