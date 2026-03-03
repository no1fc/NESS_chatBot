'use client';

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-white/5 overflow-hidden">
            <div
                style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: 'linear-gradient(90deg, #2DD4BF, #34D399)',
                    boxShadow: '0 0 10px rgba(45, 212, 191, 0.4)',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                role="progressbar"
                aria-valuenow={Math.round(percentage)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`진행률 ${Math.round(percentage)}%`}
            />
        </div>
    );
}
