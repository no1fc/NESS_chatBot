'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Send, X, CornerDownLeft } from 'lucide-react';

interface TextInputProps {
    onSubmit: (text: string) => void;
    onCancel?: () => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function TextInput({ onSubmit, onCancel, placeholder, disabled }: TextInputProps) {
    const [text, setText] = useState('');

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (trimmed && !disabled) {
            onSubmit(trimmed);
            setText('');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 500) {
            setText(e.target.value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const canSubmit = text.trim().length > 0 && !disabled;

    return (
        <div className="w-full flex flex-col gap-2">
            <div className={`relative flex items-center transition-all duration-300 ${disabled ? 'opacity-50' : ''}`}>
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || '메시지를 입력하세요...'}
                    disabled={disabled}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-32 text-sm text-white focus:outline-none focus:border-[#2DD4BF]/30 transition-all placeholder:text-white/20"
                />

                <div className="absolute right-2 flex items-center gap-2">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            disabled={disabled}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-white/40 transition-colors"
                            aria-label="취소"
                        >
                            <X size={18} />
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || disabled}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${canSubmit ? 'bg-[#2DD4BF] text-[#0B1120] hover:scale-105 shadow-lg shadow-[#2DD4BF]/10' : 'bg-white/5 text-white/10'}`}
                        aria-label="전송"
                    >
                        <Send size={18} fill={canSubmit ? 'currentColor' : 'none'} />
                    </button>
                    <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/5 ml-1">
                        <CornerDownLeft size={10} className="text-white/20" />
                        <span className="text-[9px] font-black text-white/20 tracking-tighter">ENTER</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-end px-2">
                <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${text.length > 450 ? 'text-[#F87171]' : 'text-white/10'}`}>
                    {text.length} / 500
                </span>
            </div>
        </div>
    );
}
