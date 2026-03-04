'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Building2,
    Users,
    KeyRound,
    MessageSquareText,
    FileText,
    LogOut,
    Menu,
    X,
    LayoutDashboard
} from 'lucide-react';

const SIDEBAR_ITEMS = [
    { name: '대시보드', href: '/admin', icon: LayoutDashboard },
    { name: '지점 등록', href: '/admin/branches', icon: Building2 },
    { name: '관리자 지정', href: '/admin/users', icon: Users },
    { name: 'API 설정', href: '/admin/settings/api', icon: KeyRound },
    { name: '프롬프트 관리', href: '/admin/settings/prompts', icon: MessageSquareText },
    { name: 'PDF 설정', href: '/admin/settings/pdf', icon: FileText },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // 로그인 페이지 등에서는 레이아웃을 씌우지 않음
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('로그아웃 실패', error);
            alert('로그아웃에 실패했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
                className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-md text-gray-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 사이드바 */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col
      `}>
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <Link href="/admin" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <span className="text-blue-400">NESS</span> <span className="text-gray-300 text-lg font-medium">관리자</span>
                    </Link>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {SIDEBAR_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                            || (item.href !== '/admin' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        <LogOut size={18} />
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-16rem)] overflow-hidden">
                {/* 모바일 헤더용 여백 */}
                <div className="h-16 lg:h-0 bg-white lg:bg-transparent shadow-sm lg:shadow-none flex items-center px-6 lg:p-0">
                    <span className="font-semibold text-gray-800 lg:hidden">NESS Admin</span>
                </div>

                <div className="flex-1 p-6 lg:p-8 overflow-auto">
                    {children}
                </div>
            </main>

            {/* 모바일 오버레이 */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
}
