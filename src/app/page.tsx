/**
 * 랜딩 페이지 (/)
 * 서비스 소개 및 챗봇 시작 유도 페이지입니다.
 * 히어로 섹션, 주요 기능 소개, 주의사항을 포함합니다.
 */

import Link from 'next/link';
import { Bot, CheckCircle, MapPin, ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react';

/**
 * 랜딩 페이지 컴포넌트 (서버 컴포넌트)
 * 서비스 소개, CTA 버튼, 기능 카드, 주의사항 섹션으로 구성됩니다.
 */
export default function HomePage() {
    return (
        <main
            className="min-h-screen"
            style={{
                background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #ECFDF5 100%)',
            }}
        >
            {/* ============================
          네비게이션 헤더
      ============================ */}
            <header className="px-6 py-4 max-w-2xl mx-auto flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center gap-2">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--color-primary)' }}
                        aria-hidden="true"
                    >
                        <Bot size={18} color="white" />
                    </div>
                    <span className="font-bold text-base" style={{ color: 'var(--color-gray-900)' }}>
                        NESS 챗봇
                    </span>
                </div>

                {/* 잡모아 브랜드 */}
                <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(37, 99, 235, 0.2)',
                    }}
                >
                    powered by 잡모아
                </span>
            </header>

            {/* ============================
          히어로 섹션
      ============================ */}
            <section className="px-6 py-12 max-w-2xl mx-auto text-center">
                {/* 메인 뱃지 */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                >
                    <span className="text-xs font-semibold" style={{ color: '#065F46' }}>
                        🤖 AI 자동 유형 판별
                    </span>
                </div>

                {/* 메인 헤드라인 */}
                <h1
                    className="font-bold mb-4 leading-tight"
                    style={{
                        fontSize: 'clamp(1.625rem, 5vw, 2.25rem)',
                        color: 'var(--color-gray-900)',
                        lineHeight: '1.3',
                    }}
                >
                    내가 받을 수 있는
                    <br />
                    <span style={{ color: 'var(--color-primary)' }}>국민취업지원제도</span>
                    <br />
                    유형, 지금 확인하세요!
                </h1>

                {/* 서브텍스트 */}
                <p
                    className="mb-3"
                    style={{
                        color: 'var(--color-gray-500)',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                    }}
                >
                    복잡한 자격 요건을 AI가 분석해 드립니다.
                    <br />
                    1유형, 2유형, 선발형 점수까지 한 번에.
                </p>

                {/* 소요 시간 안내 */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Clock size={14} color="var(--color-gray-400)" aria-hidden="true" />
                    <span style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem' }}>
                        약 3~5분 소요
                    </span>
                </div>

                {/* 메인 CTA 버튼 */}
                <Link
                    href="/chat"
                    className="btn-primary"
                    style={{
                        display: 'inline-flex',
                        fontSize: '1.0625rem',
                        padding: '16px 32px',
                        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.35)',
                    }}
                    aria-label="자가진단 챗봇 시작하기"
                >
                    지금 바로 자가진단 시작하기
                    <ArrowRight size={20} aria-hidden="true" />
                </Link>

                {/* 보조 텍스트 */}
                <p className="mt-4 text-xs" style={{ color: 'var(--color-gray-400)' }}>
                    무료 · 개인정보 저장 없음 · 즉시 결과 확인
                </p>
            </section>

            {/* ============================
          주요 기능 소개 카드 (3개)
      ============================ */}
            <section className="px-6 pb-10 max-w-2xl mx-auto">
                <h2
                    className="text-center font-bold mb-6"
                    style={{ color: 'var(--color-gray-900)', fontSize: '1.125rem' }}
                >
                    이런 분들께 도움이 됩니다
                </h2>

                <div className="grid gap-4 sm:grid-cols-3">
                    {/* 카드 1: 간단한 질문 */}
                    <div
                        className="rounded-2xl p-5"
                        style={{
                            background: 'white',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--color-gray-200)',
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: 'var(--color-primary-subtle)' }}
                            aria-hidden="true"
                        >
                            <CheckCircle size={20} color="var(--color-primary)" />
                        </div>
                        <h3 className="font-semibold mb-2" style={{ fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>
                            5개 핵심 질문 분석
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', lineHeight: '1.6' }}>
                            나이, 소득, 재산, 취업경험 등 핵심 정보만 입력하면 OK
                        </p>
                    </div>

                    {/* 카드 2: AI 자동 판별 */}
                    <div
                        className="rounded-2xl p-5"
                        style={{
                            background: 'white',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--color-gray-200)',
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: '#ECFDF5' }}
                            aria-hidden="true"
                        >
                            <TrendingUp size={20} color="var(--color-secondary)" />
                        </div>
                        <h3 className="font-semibold mb-2" style={{ fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>
                            AI 자동 유형 판별
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', lineHeight: '1.6' }}>
                            PDF 규정서를 학습한 AI가 1·2유형, 선발형 점수까지 분석
                        </p>
                    </div>

                    {/* 카드 3: 맞춤 지점 연결 */}
                    <div
                        className="rounded-2xl p-5"
                        style={{
                            background: 'white',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--color-gray-200)',
                        }}
                    >
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: '#FEF2F2' }}
                            aria-hidden="true"
                        >
                            <MapPin size={20} color="#EF4444" />
                        </div>
                        <h3 className="font-semibold mb-2" style={{ fontSize: '0.9375rem', color: 'var(--color-gray-900)' }}>
                            가까운 지점 바로 연결
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)', lineHeight: '1.6' }}>
                            진단 완료 후 거주 지역의 잡모아 지점 또는 고용24 안내
                        </p>
                    </div>
                </div>
            </section>

            {/* ============================
          주요 수당 안내 배너
      ============================ */}
            <section
                className="mx-6 mb-10 rounded-2xl p-5 max-w-2xl sm:mx-auto"
                style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%)',
                    color: 'white',
                }}
            >
                <p className="font-bold mb-2">💰 지원 가능한 혜택</p>
                <div className="grid grid-cols-2 gap-3">
                    <div
                        className="rounded-xl p-3"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <p className="text-xs opacity-80 mb-1">1유형 구직촉진수당</p>
                        <p className="font-bold">월 최대 50만원</p>
                        <p className="text-xs opacity-70">× 최대 6개월</p>
                    </div>
                    <div
                        className="rounded-xl p-3"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <p className="text-xs opacity-80 mb-1">2유형 취업활동비용</p>
                        <p className="font-bold">최대 195만원</p>
                        <p className="text-xs opacity-70">취업활동비용 지원</p>
                    </div>
                </div>
            </section>

            {/* ============================
          면책 문구
      ============================ */}
            <section className="px-6 pb-10 max-w-2xl mx-auto">
                <div className="disclaimer-box rounded-xl">
                    <Shield size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p>
                        입력하신 정보는 자가진단 용도로만 사용되며 서버에 저장되지 않습니다.
                        실제 참여 여부는 고용센터의 최종 심사 결과에 따라 달라질 수 있습니다.
                    </p>
                </div>
            </section>

            {/* ============================
          하단 CTA (재강조)
      ============================ */}
            <section className="px-6 pb-14 max-w-2xl mx-auto text-center">
                <Link
                    href="/chat"
                    className="btn-primary"
                    style={{ display: 'inline-flex', fontSize: '1rem', padding: '14px 28px' }}
                >
                    자가진단 시작하기 →
                </Link>
            </section>

            {/* ============================
          푸터
      ============================ */}
            <footer
                className="px-6 py-5 text-center"
                style={{
                    borderTop: '1px solid var(--color-gray-200)',
                    background: 'rgba(255,255,255,0.6)',
                }}
            >
                <p className="text-xs" style={{ color: 'var(--color-gray-400)' }}>
                    © 2026 잡모아 · NESS 국취제 AI 자가진단 챗봇
                    <br />
                    본 서비스는 참고 목적으로 제공되며 법적 효력이 없습니다.
                </p>
            </footer>
        </main>
    );
}
