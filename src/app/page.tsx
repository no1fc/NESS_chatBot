import Link from 'next/link';
import { ArrowRight, Sparkles, MoveRight, Coins, BookOpen, Compass, Shield, Database, HeartHandshake, ClipboardList, UserSearch, BrainCircuit, CheckCircle } from 'lucide-react';
import VirtualChatDemo from '../components/VirtualChatDemo';

export default function HomePage() {
    return (
        <div className="flex flex-col w-full bg-bg h-[100dvh] overflow-y-scroll snap-y snap-mandatory">
            {/* 1. Hero Section */}
            <section className="hero-glow w-full h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex flex-col justify-center pt-16 md:pt-20 pb-6 md:pb-10">
                <div className="wide-container flex flex-col lg:flex-row items-center gap-6 lg:gap-16 w-full relative z-10">
                    <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center gap-2 mb-6 md:mb-12">
                            <Sparkles size={14} className="text-accent" />
                            <span className="text-text-muted text-[10px] font-medium uppercase tracking-[0.3em]">AI National Support 2026</span>
                        </div>

                        <h1 className="text-text font-bold leading-[1.1] tracking-tight mb-6 md:mb-16 text-4xl md:text-7xl" style={{ fontSize: 'clamp(2rem, 5vw, 4.75rem)' }}>
                            SMART<br />
                            FUTURE
                        </h1>

                        <p className="max-w-xl text-text-secondary text-sm md:text-lg font-normal leading-relaxed mb-6 md:mb-16">
                            당신의 복잡한 내일을<br />
                            AI 멘토 NESS가 단 3분 만에 설계합니다.<br /><br />
                            국취제 진단부터 예상 수당까지,<br />
                            가장 정확한 데이터를 경험하세요.
                        </p>

                        <Link
                            href="/chat"
                            className="group inline-flex items-center gap-4 text-text font-bold text-base md:text-lg transition-colors hover:text-accent"
                        >
                            <span className="underline underline-offset-4 decoration-1">진단 시작하기</span>
                            <MoveRight size={20} className="text-accent" />
                        </Link>

                        {/* Stats Banner */}
                        <div className="mt-8 md:mt-16 flex items-center gap-5 md:gap-10">
                            {[
                                { value: '360만원', label: '최대 지원금' },
                                { value: '6개월', label: '지급 기간' },
                                { value: '3분', label: '진단 소요' },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-accent text-lg md:text-3xl font-bold tracking-tight">{stat.value}</span>
                                    <span className="text-text-muted text-[9px] md:text-xs font-medium uppercase tracking-wider mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VirtualChatDemo — 모바일에서 숨김 */}
                    <div className="hidden lg:block w-[400px] shrink-0">
                        <VirtualChatDemo />
                    </div>
                </div>
            </section>

            {/* 2. Info Section — 모바일에서 min-h-auto로 콘텐츠 맞춤 */}
            <section className="w-full min-h-[100dvh] shrink-0 snap-start snap-always flex flex-col justify-center py-12 md:py-20">
                <div className="wide-container minimal-grid w-full">
                    <div className="col-span-12 lg:col-span-4 mb-8 md:mb-12 flex flex-col justify-center lg:mb-0">
                        <div className="inline-flex items-center gap-2 mb-6 md:mb-10">
                            <Compass size={14} className="text-accent" />
                            <p className="text-text-muted text-[10px] uppercase font-medium tracking-widest">01 / Guide</p>
                        </div>
                        <h2 className="text-text text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-8">국민취업지원제도.</h2>
                        <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6 md:mb-10">
                            취업을 원하는 사람에게<br />
                            취업지원서비스를 제공하고,<br />
                            저소득 구직자에게는 생계 안정을 지원하는<br />
                            한국형 실업부조입니다.
                        </p>
                        <div className="w-10 h-[1px] bg-border-strong"></div>
                    </div>

                    <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                        {/* Type 1 Card */}
                        <div className="relative p-5 md:p-10 rounded-[4px] border border-[rgba(15,0,0,0.12)] bg-bg-elevated hover:border-border-strong transition-colors overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-success" />
                            <div className="w-11 h-11 md:w-14 md:h-14 rounded-[4px] bg-success/[0.08] flex items-center justify-center mb-4 md:mb-8">
                                <Coins size={22} className="text-success md:hidden" />
                                <Coins size={26} className="text-success hidden md:block" />
                            </div>
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <span className="px-2 py-1 rounded-[4px] bg-bg text-success text-[10px] font-bold uppercase tracking-widest border border-[rgba(15,0,0,0.12)]">Type 1</span>
                                <h3 className="text-text text-lg md:text-xl font-bold tracking-tight">구직촉진수당</h3>
                            </div>
                            <p className="text-text-secondary text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                                월 60만원씩 최대 6개월간<br />
                                총 <span className="text-text font-bold">360만원</span>의 생계 지원금을 지급하여<br />
                                온전히 구직에만 집중할 수 있게 돕습니다.
                            </p>
                            <div className="flex items-baseline gap-2 pt-3 md:pt-4 border-t border-[rgba(15,0,0,0.12)]">
                                <span className="text-success text-2xl md:text-3xl font-bold tracking-tight">360</span>
                                <span className="text-text-muted text-xs md:text-sm font-medium">만원 / 최대</span>
                            </div>
                        </div>

                        {/* Type 2 Card */}
                        <div className="relative p-5 md:p-10 rounded-[4px] border border-[rgba(15,0,0,0.12)] bg-bg-elevated hover:border-border-strong transition-colors overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-accent" />
                            <div className="w-11 h-11 md:w-14 md:h-14 rounded-[4px] bg-accent/[0.08] flex items-center justify-center mb-4 md:mb-8">
                                <BookOpen size={22} className="text-accent md:hidden" />
                                <BookOpen size={26} className="text-accent hidden md:block" />
                            </div>
                            <div className="flex items-center gap-3 mb-3 md:mb-4">
                                <span className="px-2 py-1 rounded-[4px] bg-bg text-accent text-[10px] font-bold uppercase tracking-widest border border-[rgba(15,0,0,0.12)]">Type 2</span>
                                <h3 className="text-text text-lg md:text-xl font-bold tracking-tight">취업활동비용</h3>
                            </div>
                            <p className="text-text-secondary text-xs md:text-sm leading-relaxed mb-4 md:mb-6">
                                직업훈련 참여 시 최대 <span className="text-text font-bold">195만원</span>의 수당과 함께<br />
                                이력서 클리닉, 면접 코칭 등<br />
                                전문적인 취업 지원을 제공합니다.
                            </p>
                            <div className="flex items-baseline gap-2 pt-3 md:pt-4 border-t border-[rgba(15,0,0,0.12)]">
                                <span className="text-accent text-2xl md:text-3xl font-bold tracking-tight">195</span>
                                <span className="text-text-muted text-xs md:text-sm font-medium">만원 / 최대</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Technology Section */}
            <section className="grid-pattern w-full min-h-[100dvh] shrink-0 snap-start snap-always flex flex-col justify-center py-12 md:py-20">
                <div className="wide-container minimal-grid w-full">
                    <div className="col-span-12">
                        <p className="text-text-muted text-[10px] uppercase font-medium tracking-widest mb-6 md:mb-10">02 / Technology</p>
                        <h2 className="text-text text-3xl md:text-6xl font-bold tracking-tight mb-8 md:mb-20 leading-[1.1]">
                            프라이버시를 존중하는<br />
                            정교한 인공지능.
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-t border-[rgba(15,0,0,0.12)] pt-8 md:pt-16">
                            {[
                                {
                                    icon: Shield,
                                    iconColor: 'text-accent',
                                    iconBg: 'bg-accent/[0.08]',
                                    title: 'Security',
                                    stat: '0건',
                                    statLabel: '데이터 보관',
                                    desc: '데이터는 저장되지 않고 즉시 파기됩니다.',
                                },
                                {
                                    icon: Database,
                                    iconColor: 'text-success',
                                    iconBg: 'bg-success/[0.08]',
                                    title: 'Accurate',
                                    stat: '2026',
                                    statLabel: '최신 기준 적용',
                                    desc: '2026년 중위소득 기준을 완벽하게 학습했습니다.',
                                },
                                {
                                    icon: HeartHandshake,
                                    iconColor: 'text-warning',
                                    iconBg: 'bg-warning/[0.08]',
                                    title: 'Empathy',
                                    stat: '1:1',
                                    statLabel: '맞춤 조언',
                                    desc: '단순 코드 분석이 아닌 따뜻한 조언을 건넵니다.',
                                },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-[4px] ${item.iconBg} flex items-center justify-center mb-4 md:mb-6`}>
                                        <item.icon size={20} className={`${item.iconColor} md:hidden`} />
                                        <item.icon size={24} className={`${item.iconColor} hidden md:block`} />
                                    </div>
                                    <h4 className="text-text font-bold text-sm md:text-base mb-1 md:mb-2">{item.title}</h4>
                                    <div className="flex items-baseline gap-2 mb-2 md:mb-4">
                                        <span className={`text-xl md:text-2xl font-bold tracking-tight ${item.iconColor}`}>{item.stat}</span>
                                        <span className="text-text-muted text-[10px] md:text-xs font-medium">{item.statLabel}</span>
                                    </div>
                                    <p className="text-text-muted text-xs md:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. CTA + Footer */}
            <section className="w-full min-h-[100dvh] shrink-0 snap-start snap-always flex flex-col justify-end pt-12 md:pt-20 pb-6 md:pb-12">
                <div className="flex-1 flex flex-col justify-center">
                    <div className="wide-container w-full">
                        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-0 lg:text-left lg:mx-0">
                            {/* Step Indicator */}
                            <div className="grid grid-cols-2 md:flex md:flex-row items-start md:items-center gap-4 md:gap-0 mb-8 md:mb-16">
                                {[
                                    { icon: ClipboardList, label: '기본 정보', time: '1분' },
                                    { icon: UserSearch, label: '소득·재산', time: '1분' },
                                    { icon: BrainCircuit, label: 'AI 분석', time: '즉시' },
                                    { icon: CheckCircle, label: '결과 확인', time: '바로' },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-2 md:gap-0">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-[4px] bg-bg-elevated border border-[rgba(15,0,0,0.12)] flex items-center justify-center shrink-0">
                                                <step.icon size={14} className="text-accent md:hidden" />
                                                <step.icon size={18} className="text-accent hidden md:block" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-text text-[11px] md:text-xs font-bold">{step.label}</span>
                                                <span className="text-text-muted text-[9px] md:text-[10px] font-medium">{step.time}</span>
                                            </div>
                                        </div>
                                        {i < 3 && (
                                            <div className="hidden md:block w-6 lg:w-12 h-[1px] bg-border-strong mx-3 md:mx-4" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-text text-2xl md:text-6xl font-bold mb-8 md:mb-12 tracking-tight">
                                국민취업지원제도<br className="md:hidden" /> 진단하기
                            </h2>

                            <Link
                                href="/chat"
                                className="group inline-flex items-center gap-3 md:gap-4 px-6 py-3 md:px-8 md:py-4 rounded-[4px] border-2 border-accent text-accent text-base md:text-2xl font-bold transition-all hover:bg-accent hover:text-white"
                            >
                                <span>지금 바로 진단 시작하기</span>
                                <ArrowRight size={20} className="md:hidden" />
                                <ArrowRight size={24} className="hidden md:block" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="wide-container w-full pt-6 md:pt-8 pb-4 border-t border-[rgba(15,0,0,0.12)]">
                    <div className="flex flex-col md:flex-row justify-between relative gap-6 md:gap-8 mt-4 md:mt-8">
                        <div className="flex flex-col gap-2 md:gap-3">
                            <div className="text-text font-bold tracking-tight text-lg md:text-xl">NESS</div>
                            <p className="text-text-muted text-[11px] md:text-xs leading-relaxed">
                                본 서비스는 국민취업지원제도 안내를 돕기 위한 챗봇 서비스로,<br className="hidden md:block" />
                                정부 기관의 공식 입장을 대변하지 않습니다.
                            </p>
                            <div className="flex flex-col gap-1 text-text-muted text-[10px] uppercase font-medium tracking-wider">
                                <p>Contact | namsd@jobmoa.com</p>
                                <p>Version | 1.0.0 (Beta)</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-between gap-3 md:gap-0">
                            <div className="flex flex-wrap gap-3 md:gap-4 text-[11px] font-medium text-text-secondary">
                                <Link href="/terms" className="hover:text-text underline transition-colors">이용약관</Link>
                                <span className="text-text-muted">|</span>
                                <Link href="/privacy" className="hover:text-text underline transition-colors">개인정보처리방침</Link>
                                <span className="text-text-muted">|</span>
                                <Link href="/disclaimer" className="hover:text-text underline transition-colors">면책공고</Link>
                            </div>
                            <p className="text-text-muted text-[10px] uppercase font-medium tracking-wider">
                                &copy; 2026 NESS AI SYSTEM. ALL RIGHTS RESERVED.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
