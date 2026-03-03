import Link from 'next/link';
import { ArrowRight, Sparkles, MoveRight } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="flex flex-col w-full bg-[#0B1120] min-h-screen font-sans selection:bg-[#2DD4BF] selection:text-[#0B1120]">
            {/* 1. 네비게이션 (톰오카다 스타일) */}
            <nav className="fixed top-0 left-0 w-full z-50 px-8 py-10 flex justify-between items-start pointer-events-none">
                <div className="pointer-events-auto">
                    <span className="text-white font-black tracking-tighter text-2xl">NESS</span>
                </div>
                <div className="flex flex-col items-end gap-1 pointer-events-auto">
                    <button className="text-white/40 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">Menu</button>
                    <div className="w-8 h-[1px] bg-white/20"></div>
                </div>
            </nav>

            <main className="wide-container pt-40 pb-20">
                {/* 2. 히어로 섹션 - 그리드 기반 미니멀리즘 */}
                <section className="minimal-grid mb-40">
                    <div className="col-span-12 lg:col-span-8 animate-reveal-up">
                        <div className="inline-flex items-center gap-2 mb-12 opacity-50">
                            <Sparkles size={14} className="text-[#2DD4BF]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">AI National Support 2026</span>
                        </div>

                        <h1 className="text-white font-black leading-[0.9] tracking-tighter mb-16 text-7xl md:text-8xl lg:text-[10rem]">
                            SMART<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2DD4BF] to-[#2563EB] text-flow">
                                FUTURE
                            </span>
                        </h1>

                        <p className="max-w-xl text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-16">
                            당신의 복잡한 내일을 AI 멘토 NESS가 단 3분 만에 설계합니다. 국취제 자격 진단부터 예상 수당까지, 가장 정확한 데이터를 경험하세요.
                        </p>

                        <Link
                            href="/chat"
                            className="group inline-flex items-center gap-6 text-white text-xl font-bold transition-all hover:gap-10"
                        >
                            <span>진단 시작하기</span>
                            <MoveRight size={32} className="text-[#2DD4BF]" />
                        </Link>
                    </div>

                    <div className="hidden lg:flex col-span-4 flex-col justify-end items-end pb-2 animate-reveal-up" style={{ animationDelay: '0.2s' }}>
                        <div className="text-right">
                            <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-4">Current Status</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white text-5xl font-black tabular-nums">12.4K</span>
                                <span className="text-[#2DD4BF] text-xs font-bold">+</span>
                            </div>
                            <p className="text-white/40 text-xs mt-2 uppercase tracking-tight">Diagnostics Completed</p>
                        </div>
                    </div>
                </section>

                {/* 3. 섹션: 정보 요약 (그리드 레이아웃) */}
                <section className="minimal-grid mb-60 opacity-0 animate-reveal-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    <div className="col-span-12 lg:col-span-4 mb-20 lg:mb-0">
                        <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-10">01 / Guide</p>
                        <h2 className="text-white text-4xl font-black tracking-tight mb-8">국민취업지원제도.</h2>
                        <p className="text-white/40 leading-relaxed mb-10 pr-10">취업을 원하는 사람에게 취업지원서비스를 제공하고, 저소득 구직자에게는 생계 안정을 지원하는 한국형 실업부조입니다.</p>
                        <div className="w-10 h-[1px] bg-[#2DD4BF]"></div>
                    </div>

                    <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                            <p className="text-[#2DD4BF] text-[10px] font-black mb-6 uppercase tracking-widest">Type 1</p>
                            <h3 className="text-white text-2xl font-bold mb-4">구직촉진수당</h3>
                            <p className="text-white/30 text-sm leading-relaxed mb-10">월 50만원씩 6개월간 총 300만원의 생계 지원금을 지급받으실 수 있습니다.</p>
                            <ArrowRight size={20} className="text-white/10 group-hover:text-[#2DD3BF] transition-colors" />
                        </div>
                        <div className="p-10 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group">
                            <p className="text-[#2563EB] text-[10px] font-black mb-6 uppercase tracking-widest">Type 2</p>
                            <h3 className="text-white text-2xl font-bold mb-4">취업활동비용</h3>
                            <p className="text-white/30 text-sm leading-relaxed mb-10">직업훈련 참여 시 최대 195만원의 수당과 전문적인 취업 지원을 제공합니다.</p>
                            <ArrowRight size={20} className="text-white/10 group-hover:text-[#2563EB] transition-colors" />
                        </div>
                    </div>
                </section>

                {/* 4. 섹션: AI Strength */}
                <section className="minimal-grid mb-60 opacity-0 animate-reveal-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                    <div className="col-span-12 lg:col-start-5 lg:col-span-8">
                        <p className="text-white/20 text-[10px] uppercase font-black tracking-widest mb-10">02 / Technology</p>
                        <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter mb-20 leading-[1.1]">
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
                </section>

                {/* 5. CTA + Footer */}
                <section className="py-40 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-20">
                        <div className="max-w-2xl">
                            <h2 className="text-white text-5xl md:text-6xl font-black mb-12 tracking-tighter">
                                NEXT STEP.
                            </h2>
                            <Link
                                href="/chat"
                                className="group inline-flex items-center gap-6 text-white text-3xl font-black transition-all hover:gap-10"
                            >
                                <span className="border-b-4 border-[#2DD4BF] pb-2 text-flow">Start Diagnosis</span>
                            </Link>
                        </div>

                        <div className="text-right">
                            <p className="text-white/40 text-xs font-medium mb-4">© 2026 NESS AI SYSTEM</p>
                            <div className="flex justify-end gap-6 text-[10px] font-black uppercase tracking-widest text-white/20">
                                <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
                                <span className="cursor-pointer hover:text-white transition-colors">Contact</span>
                                <span className="cursor-pointer hover:text-white transition-colors">Privacy</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 배경 미세 글로우 */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2DD4BF]/[0.02] blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2563EB]/[0.02] blur-[150px] rounded-full"></div>
            </div>
        </div>
    );
}
