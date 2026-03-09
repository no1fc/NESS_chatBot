import Link from 'next/link';
import { ArrowRight, Sparkles, MoveRight, Coins, BookOpen, Compass } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import VirtualChatDemo from '../components/VirtualChatDemo';

export default function HomePage() {
    return (
        <div className="flex flex-col w-full bg-[#0B1120] h-[100dvh] overflow-y-scroll snap-y snap-proximity md:snap-mandatory font-sans selection:bg-[#2DD4BF] selection:text-[#0B1120]">
            {/* 1. 네비게이션 (톰오카다 스타일) */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-8 py-6 md:py-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <span className="text-white font-black tracking-tighter text-2xl">NESS</span>
                </div>
                <div className="flex flex-col items-end gap-1 pointer-events-auto">
                    <button className="text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Menu</button>
                    <div className="w-8 h-[1px] bg-white/20"></div>
                </div>
            </nav>

            <main className="w-full">
                {/* 2. 히어로 섹션 - 그리드 기반 미니멀리즘 */}
                <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-center pt-20 pb-10">
                    <div className="wide-container minimal-grid items-center w-full">
                        <ScrollReveal className="col-span-12 lg:col-span-6">
                            <div className="inline-flex items-center gap-2 mb-12 opacity-50">
                                <Sparkles size={14} className="text-[#2DD4BF]" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AI National Support 2026</span>
                            </div>

                            <h1 className="text-white font-black leading-[0.9] tracking-tighter mb-10 md:mb-16 text-6xl md:text-8xl xl:text-[9rem]">
                                SMART<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#2563EB] text-flow">
                                    FUTURE
                                </span>
                            </h1>

                            <p className="max-w-xl text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-10 md:mb-16">
                                당신의 복잡한 내일을 AI 멘토 NESS가 단 3분 만에 설계합니다. 국취제 진단부터 예상 수당까지, 가장 정확한 데이터를 경험하세요.
                            </p>

                            <Link
                                href="/chat"
                                className="group inline-flex items-center gap-6 text-white text-xl font-bold transition-all hover:gap-10"
                            >
                                <span>진단 시작하기</span>
                                <MoveRight size={32} className="text-[#2DD4BF]" />
                            </Link>
                        </ScrollReveal>

                        {/* 우측 가상 챗봇 데모 영역 */}
                        <ScrollReveal className="col-span-12 lg:col-span-5 lg:col-start-8 mt-20 lg:mt-0" delay={0.3}>
                            <div className="relative">
                                {/* 데모를 감싸는 장식용 글로우 효과 */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#2DD4BF]/20 to-[#2563EB]/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
                                <VirtualChatDemo />
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* 3. 섹션: 정보 요약 (그리드 레이아웃) */}
                <section className="w-full min-h-[100dvh] h-auto snap-start flex flex-col justify-center py-20 relative z-10">
                    <ScrollReveal className="wide-container minimal-grid w-full" delay={0.1}>
                        <div className="col-span-12 lg:col-span-4 mb-12 flex flex-col justify-center lg:mb-0">
                            <div className="inline-flex items-center gap-2 mb-10">
                                <Compass size={14} className="text-[#2DD4BF]" />
                                <p className="text-white/20 text-[10px] uppercase font-black tracking-widest">01 / Guide</p>
                            </div>
                            <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-8">국민취업지원제도.</h2>
                            <p className="text-white/40 text-lg leading-relaxed mb-10 pr-10 font-medium">취업을 원하는 사람에게 취업지원서비스를 제공하고, 저소득 구직자에게는 생계 안정을 지원하는 한국형 실업부조입니다.</p>
                            <div className="w-10 h-[1px] bg-gradient-to-r from-[#2DD4BF] to-[#2563EB]"></div>
                        </div>

                        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                            {/* Type 1 Card */}
                            <div className="relative p-6 md:p-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#2DD4BF]/30 transition-all duration-500 overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2DD4BF]/5 blur-[50px] rounded-full group-hover:bg-[#2DD4BF]/10 transition-colors"></div>

                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#2DD4BF]/10 flex items-center justify-center mb-6 md:mb-8">
                                    <Coins size={24} className="text-[#2DD4BF] md:w-6 md:h-6 w-5 h-5" />
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2 py-1 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] text-[10px] font-black uppercase tracking-widest">Type 1</span>
                                    <h3 className="text-white text-2xl font-black tracking-tight">구직촉진수당</h3>
                                </div>

                                <p className="text-white/50 text-base font-medium leading-relaxed mb-12">월 60만원씩 최대 6개월간 총 360만원의 생계 지원금을 지급하여 온전히 구직에만 집중할 수 있게 돕습니다.</p>
                            </div>

                            {/* Type 2 Card */}
                            <div className="relative p-6 md:p-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#2563EB]/30 transition-all duration-500 overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/5 blur-[50px] rounded-full group-hover:bg-[#2563EB]/10 transition-colors"></div>

                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center mb-6 md:mb-8">
                                    <BookOpen size={24} className="text-[#2563EB] md:w-6 md:h-6 w-5 h-5" />
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2 py-1 rounded bg-[#2563EB]/20 text-[#2563EB] text-[10px] font-black uppercase tracking-widest">Type 2</span>
                                    <h3 className="text-white text-2xl font-black tracking-tight">취업활동비용</h3>
                                </div>

                                <p className="text-white/50 text-base font-medium leading-relaxed mb-12">직업훈련 참여 시 최대 195만원의 수당과 함께 이력서 클리닉, 면접 코칭 등 전문적인 취업 지원을 제공합니다.</p>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>

                {/* 4. 섹션: AI Strength */}
                <section className="w-full min-h-[100dvh] h-auto snap-start flex flex-col justify-center py-20 relative z-10 bg-[#0B1120]">
                    <ScrollReveal className="wide-container minimal-grid w-full" delay={0.1}>
                        <div className="col-span-12">
                            <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-10">02 / Technology</p>
                            <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-12 md:mb-20 leading-[1.1]">
                                프라이버시를 존중하는<br />
                                정교한 인공지능.
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-16">
                                {[
                                    { title: 'Security', desc: '데이터는 저장되지 않고 즉시 파기됩니다.' },
                                    { title: 'Accurate', desc: '2026년 중위소득 기준을 완벽하게 학습했습니다.' },
                                    { title: 'Empathy', desc: '단순 코드 분석이 아닌 따뜻한 조언을 건넵니다.' }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <h4 className="text-white font-bold mb-4">{item.title}</h4>
                                        <p className="text-white/30 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </section>

                {/* 5. CTA + Footer */}
                <section className="w-full min-h-[100dvh] snap-start flex flex-col justify-end pt-20 pb-12 relative z-10 bg-[#0B1120]">
                    <div className="flex-1 flex flex-col justify-center">
                        <ScrollReveal className="wide-container w-full" delay={0.1}>
                            <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-0 lg:text-left lg:mx-0">
                                <h2 className="text-white text-5xl md:text-7xl font-black mb-12 tracking-tighter">
                                    국민취업지원제도 진단하기
                                </h2>
                                <Link
                                    href="/chat"
                                    className="group inline-flex items-center gap-6 text-white text-3xl md:text-5xl font-black transition-all hover:gap-10"
                                >
                                    <span className="border-b-4 border-[#2DD4BF] pb-2 text-flow">국취제 진단하기</span>
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                    {/* Footer - 하단 고정 영역 */}
                    <ScrollReveal className="wide-container w-full pt-8 pb-4 border-t border-white/10" delay={0.2}>
                        <div className="flex flex-col md:flex-row justify-between relative gap-8 mt-8">
                            {/* 좌측 정보 영역 */}
                            <div className="flex flex-col gap-3">
                                <div className="text-white font-black tracking-tighter text-2xl">NESS</div>
                                <p className="text-white/40 text-xs leading-relaxed">
                                    본 서비스는 국민취업지원제도 안내를 돕기 위한 챗봇 서비스로,<br className="hidden md:block" />
                                    정부 기관의 공식 입장을 대변하지 않습니다.
                                </p>
                                <div className="mt-4 flex flex-col gap-1 text-white/30 text-[10px] uppercase font-bold tracking-wider">
                                    <p>Contact | namsd@jobmoa.com</p>
                                    <p>Version | 1.0.0 (Beta)</p>
                                </div>
                            </div>

                            {/* 우측 링크 및 저작권 영역 */}
                            <div className="flex flex-col items-start md:items-end justify-between">
                                <div className="flex flex-wrap gap-4 text-[11px] font-bold text-white/50">
                                    <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
                                    <span className="text-white/10">|</span>
                                    <Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
                                    <span className="text-white/10">|</span>
                                    <Link href="/disclaimer" className="hover:text-white transition-colors">면책공고</Link>
                                </div>
                                <p className="text-[#2DD4BF]/50 text-[10px] uppercase font-bold tracking-wider mt-12 md:mt-0">
                                    © 2026 NESS AI SYSTEM. ALL RIGHTS RESERVED.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>
            </main>

            {/* 배경 미세 글로우 */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#2DD4BF]/[0.03] blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/[0.03] blur-[150px] rounded-full"></div>
                <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-purple-500/[0.02] blur-[120px] rounded-full"></div>
            </div>
        </div>
    );
}
