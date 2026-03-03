/**
 * ChoiceChips 컴포넌트
 * 챗봇의 선택지(버튼)를 수직 리스트로 렌더링하는 컴포넌트입니다.
 * '기타' 선택지 클릭 시 TextInput 컴포넌트를 활성화합니다.
 */

'use client';

import { useState } from 'react';
import TextInput from './TextInput';
import { Choice } from '@/hooks/useChat';
import { ChevronRight } from 'lucide-react';

interface ChoiceChipsProps {
    choices: Choice[];                      // 선택지 목록
    onSelect: (choice: Choice) => void;     // 선택지 선택 콜백
    onTextSubmit: (text: string) => void;   // 텍스트 입력 제출 콜백
    disabled: boolean;                      // 로딩 중 비활성화 여부
}

/**
 * ChoiceChips 컴포넌트
 * 수직 리스트 형태의 선택지 버튼을 렌더링합니다.
 * '기타' 선택 시 텍스트 입력창으로 전환됩니다.
 */
export default function ChoiceChips({
    choices,
    onSelect,
    onTextSubmit,
    disabled,
}: ChoiceChipsProps) {
    // '기타' 선택지 활성화 여부
    const [showTextInput, setShowTextInput] = useState<boolean>(false);

    /**
     * 선택지 클릭 핸들러
     * '기타'인 경우 텍스트 입력창 표시, 아닌 경우 onSelect 호출
     */
    const handleChoiceClick = (choice: Choice) => {
        if (choice.isOther) {
            // '기타' 선택: 텍스트 입력창 토글
            setShowTextInput(true);
        } else {
            // 일반 선택지: 즉시 전송
            setShowTextInput(false);
            onSelect(choice);
        }
    };

    /**
     * 텍스트 제출 핸들러
     * 텍스트 입력창 숨기고 sendText 호출
     */
    const handleTextSubmit = (text: string) => {
        setShowTextInput(false);
        onTextSubmit(text);
    };

    return (
        <div className="flex flex-col gap-2">
            {/* '기타' 입력창 활성화 시 TextInput 표시 */}
            {showTextInput ? (
                <TextInput
                    onSubmit={handleTextSubmit}
                    onCancel={() => setShowTextInput(false)}
                    disabled={disabled}
                />
            ) : (
                /* 선택지 버튼 목록 */
                choices.map((choice) => (
                    <button
                        key={choice.id}
                        className="choice-chip"
                        onClick={() => handleChoiceClick(choice)}
                        disabled={disabled}
                        aria-label={choice.label}
                    >
                        {/* 선택지 텍스트 */}
                        <span className="flex-1">{choice.label}</span>
                        {/* 오른쪽 화살표 아이콘 */}
                        <ChevronRight size={16} color="var(--color-gray-500)" aria-hidden="true" />
                    </button>
                ))
            )}
        </div>
    );
}
