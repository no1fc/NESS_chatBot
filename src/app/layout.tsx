import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';

// SEO 메타데이터 설정
export const metadata: Metadata = {
  title: 'NESS 챗봇 | 국민취업지원제도 AI 자가진단',
  description:
    '간단한 질문으로 국민취업지원제도 참여 유형(1유형, 2유형)과 예상 수당을 확인해보세요. AI가 PDF 규정을 분석하여 맞춤형 진단 결과를 제공합니다.',
  keywords: [
    '국민취업지원제도',
    '자가진단',
    'AI 챗봇',
    '1유형',
    '2유형',
    '구직촉진수당',
    '잡모아',
  ],
  openGraph: {
    title: 'NESS 챗봇 | 국민취업지원제도 AI 자가진단',
    description: '3~5분 만에 확인하는 나의 국민취업지원제도 참여 유형',
    type: 'website',
    locale: 'ko_KR',
  },
};

/**
 * 루트 레이아웃 컴포넌트
 * 모든 페이지를 감싸는 최상위 HTML 구조
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-bg text-text">
        <div className="app-container">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
