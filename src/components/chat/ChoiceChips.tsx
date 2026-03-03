'use client';

import { useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import TextInput from './TextInput';

interface Choice {
    id: string;
    label: string;
    type?: 'text' | 'choice';
}

interface ChoiceChipsProps {
    choices: Choice[];
    onSelect: (choice: Choice) => void;
    onTextSubmit: (text: string) => void;
    disabled?: boolean;
}

export default function ChoiceChips({ choices, onSelect, onTextSubmit, disabled }: ChoiceChipsProps) {
    const [selectedTextChoice, setSelectedTextChoice] = useState<Choice | null>(null);

    const handleChoiceClick = (choice: Choice) => {
        if (disabled) return;
        if (choice.type === 'text') {
            setSelectedTextChoice(choice);
        } else {
            onSelect(choice);
        }
    };

    if (selectedTextChoice) {
        return (
            <TextInput
                placeholder={`${selectedTextChoice.label} 입력...`}
                onSubmit={(text) => {
                    onTextSubmit(text);
                    setSelectedTextChoice(null);
                }}
                onCancel={() => setSelectedTextChoice(null)}
                disabled={disabled}
            />
        );
    }

    return (
        <div className="flex flex-wrap gap-2 justify-center items-center">
            {choices.map((choice) => (
                <button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={disabled}
                    className="group relative flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {choice.type === 'text' && <Sparkles size={14} className="text-[#2DD4BF]" />}
                    <span className="text-sm font-bold text-white/70 group-hover:text-[#2DD4BF] transition-colors">
                        {choice.label}
                    </span>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
                </button>
            ))}
        </div>
    );
}
