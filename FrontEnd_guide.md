# 🖥️ Frontend Guide: 국민취업지원제도 AI 자가진단 챗봇

> **작업 전 필수 확인 문서. Design_Guide.md를 먼저 읽은 후 이 문서를 참조하세요.**

---

## 1. 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js | 16.x (App Router) |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4.x |
| Animation | Framer Motion | ^12 |
| Icons | Lucide React | ^0.576 |
| Font | Google Fonts (Noto Sans KR, Inter) | - |
| HTTP Client | fetch (내장) | - |

---

## 2. 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx           # 루트 레이아웃 (폰트, 메타데이터)
│   ├── globals.css          # 전역 CSS (디자인 토큰, 기본 스타일)
│   ├── page.tsx             # 랜딩 페이지 (/)
│   ├── chat/
│   │   └── page.tsx         # 챗봇 메인 페이지 (/chat)
│   └── api/                 # API Routes (백엔드 참조)
├── components/
│   ├── chat/
│   │   ├── ChatContainer.tsx      # 전체 챗 UI 래퍼
│   │   ├── ChatMessage.tsx        # 개별 메시지 버블
│   │   ├── ChoiceChips.tsx        # 객관식 선택지 칩
│   │   ├── TextInput.tsx          # '기타' 자유입력 폼
│   │   ├── ProgressBar.tsx        # 상단 진행률 바
│   │   └── LoadingIndicator.tsx   # 스켈레톤/로딩 UI
│   └── result/
│       ├── ResultCard.tsx         # 진단 결과 카드
│       └── BranchCard.tsx         # 지점 정보 카드
├── hooks/
│   └── useChat.ts                 # 챗봇 상태 관리 커스텀 훅
└── lib/
    ├── gemini.ts                  # Gemini API 클라이언트
    ├── db.ts                      # SQLite DB 유틸리티
    ├── pdf-parser.ts              # PDF 텍스트 추출
    ├── prompts.ts                 # AI 시스템 프롬프트
    └── seed.ts                    # 지점 DB 시드 데이터
```

---

## 3. 페이지 명세

### 3.1 랜딩 페이지 (`/` - `src/app/page.tsx`)

**목적**: 서비스 소개 및 챗봇 시작 유도

**UI 구성**:

1. 상단 헤더 (로고 + 서비스명)
2. 히어로 섹션
   - 메인 헤드라인: "간단한 질문으로 나의 국민취업지원제도 유형을 확인해보세요!"
   - 서브텍스트: 소요시간 안내 (약 3~5분)
   - CTA 버튼: "지금 바로 자가진단 시작하기 →" → /chat으로 라우팅
3. 주요 기능 소개 (3개 카드)
   - 📋 5가지 핵심 질문 분석
   - 🤖 AI 자동 유형 판별
   - 📍 맞춤 지점 연결
4. 주의사항/면책 문구
5. 푸터

**구현 주의사항**:

- `'use client'` 불필요 (서버 컴포넌트)
- Link 컴포넌트로 /chat 라우팅
- 반응형: 모바일에서 카드 1열, 데스크탑 3열

---

### 3.2 챗봇 페이지 (`/chat` - `src/app/chat/page.tsx`)

**목적**: 실제 챗봇 인터랙션 진행

**UI 레이아웃 (Flex Column)**:

```
[헤더 영역 - sticky]
  ├── 뒤로가기 버튼 (← 아이콘)
  ├── 서비스명
  └── Progress Bar + 진행 단계 텍스트

[메시지 영역 - flex-1, overflow-y-auto, scroll snap]
  └── ChatMessage 목록 (AI / 사용자)

[입력 영역 - sticky bottom]
  └── ChoiceChips 또는 TextInput 컴포넌트
```

**구현 주의사항**:

- `'use client'` 필수 (상태 관리)
- `useChat` 훅에서 모든 상태 관리
- 새 메시지 추가 시 스크롤 맨 아래로 자동 이동 (`useEffect` + `ref`)
- 로딩 중 입력 영역 비활성화

---

## 4. 컴포넌트 명세

### 4.1 `useChat` 훅 (`src/hooks/useChat.ts`)

**상태(State)**:

```typescript
// 챗봇 상태 관리에 필요한 타입 정의
interface Message {
  id: string;          // 메시지 고유 ID
  role: 'ai' | 'user'; // 발신자 역할
  content: string;     // 메시지 내용
  choices?: Choice[];  // AI 메시지의 선택지 (있을 경우)
  timestamp: Date;     // 메시지 생성 시각
}

interface Choice {
  id: string;          // 선택지 ID
  label: string;       // 표시 텍스트
  value: string;       // 전달 값
  isOther?: boolean;   // '기타' 여부
}

interface ChatState {
  messages: Message[];       // 전체 메시지 목록
  isLoading: boolean;        // AI 응답 대기 상태
  currentStep: number;       // 현재 질문 단계 (0-based)
  totalSteps: number;        // 전체 단계 수
  phase: ChatPhase;          // 현재 진행 단계
  userAnswers: Record<string, string>; // 수집된 사용자 응답
  result: DiagnosisResult | null;      // AI 판별 결과
}

type ChatPhase = 'intro' | 'questioning' | 'analyzing' | 'location' | 'result';

interface DiagnosisResult {
  type: '1유형_요건심사형' | '1유형_선발형' | '2유형' | '제한';
  score?: number;       // 선발형 점수 (해당 시)
  description: string;  // 결과 설명
  tips?: string[];      // AI 팁 (PM 제안 2번)
}
```

**함수(Actions)**:

```typescript
// 사용자 선택지 전송
const sendChoice = async (choice: Choice) => { ... }

// 사용자 자유 텍스트 전송
const sendText = async (text: string) => { ... }

// 지역 선택 처리
const selectRegion = async (sido: string, sigungu: string) => { ... }

// 챗봇 초기화
const resetChat = () => { ... }
```

---

### 4.2 `ChatMessage` 컴포넌트

```typescript
// ChatMessage 컴포넌트 Props 타입
interface ChatMessageProps {
  message: Message;    // 메시지 데이터
  isLatest: boolean;  // 가장 최근 메시지 여부 (애니메이션 적용)
}
```

**렌더링 로직**:

- `role === 'ai'`: 왼쪽 정렬, 흰 배경 버블 + Bot 아이콘
- `role === 'user'`: 오른쪽 정렬, 파란 배경 버블
- `isLatest && role === 'ai'`: `slideInLeft` 애니메이션 적용
- `isLatest && role === 'user'`: `slideInRight` 애니메이션 적용

---

### 4.3 `ChoiceChips` 컴포넌트

```typescript
// ChoiceChips 컴포넌트 Props 타입
interface ChoiceChipsProps {
  choices: Choice[];              // 선택지 목록
  onSelect: (choice: Choice) => void;  // 선택 콜백
  disabled: boolean;              // 로딩 중 비활성화
}
```

**렌더링**:

- 수직 리스트 (`flex flex-col gap-2`)
- 각 칩은 전체 너비, 좌측 텍스트 정렬
- `isOther === true` 칩: 선택 시 `TextInput` 컴포넌트 렌더링

---

### 4.4 `ProgressBar` 컴포넌트

```typescript
// ProgressBar 컴포넌트 Props 타입
interface ProgressBarProps {
  current: number;    // 현재 단계 번호
  total: number;      // 전체 단계 수
}
```

- `percentage = (current / total) * 100`
- 트랜지션 애니메이션으로 진행률 업데이트

---

### 4.5 `LoadingIndicator` 컴포넌트

**두 가지 모드**:

1. `'bubble'` 모드: 챗 버블 자리에 스켈레톤 UI (일반 응답 대기)
2. `'analyzing'` 모드: 전체 화면 오버레이 (최종 AI 분석 중)

```typescript
// LoadingIndicator 컴포넌트 Props 타입
interface LoadingIndicatorProps {
  mode: 'bubble' | 'analyzing';  // 로딩 모드
}
```

**'analyzing' 모드 UI**:

- "AI가 요건을 검토 중입니다..." 텍스트
- 점 3개 애니메이션 (`animate-bounce` + delay)
- 반투명 오버레이 배경

---

### 4.6 `ResultCard` 컴포넌트

```typescript
// ResultCard 컴포넌트 Props 타입
interface ResultCardProps {
  result: DiagnosisResult;  // 진단 결과 데이터
  onSelectRegion: () => void; // 지역 선택 단계 진행 콜백
}
```

**유형별 디자인**:

- `1유형_요건심사형`: 초록색 테두리 + CheckCircle 아이콘
- `1유형_선발형`: 파란색 테두리 + 점수 표시
- `2유형`: 노란색 테두리 + AlertTriangle 아이콘
- `제한`: 빨간색 테두리 + XCircle 아이콘

---

### 4.7 `BranchCard` 컴포넌트

```typescript
// 지점 정보 타입
interface Branch {
  id: number;
  region_sido: string;    // 시/도
  region_sigungu: string; // 시/군/구
  branch_name: string;    // 지점명
  address: string;        // 주소
  phone: string;          // 연락처
  specific_url: string;   // 전용 URL
}

// BranchCard 컴포넌트 Props 타입
interface BranchCardProps {
  branch: Branch | null;   // null이면 고용24 안내
  diagnosisType: string;   // UTM 파라미터용 진단 유형
}
```

**Branch가 있을 때**: 지점명, 주소(MapPin), 전화번호, CTA 버튼 "잡모아 지점 상담 신청하기 →"
**Branch가 없을 때**: "현재 지역에 잡모아 지점이 없습니다" 안내 + "고용24 국민취업지원제도 가입하기" 버튼

**UTM 파라미터**: `?type={diagnosisType}&source=chatbot`

---

## 5. API 통신 규격

### 5.1 POST `/api/chat`

**요청 (Request Body)**:

```typescript
// 채팅 API 요청 타입
interface ChatRequest {
  messages: Array<{
    role: 'user' | 'model';  // Gemini API 형식
    content: string;
  }>;
  phase: ChatPhase;          // 현재 단계
  userAnswers?: Record<string, string>; // 누적 답변 (분석 단계에서 사용)
}
```

**응답 (Response Body)**:

```typescript
// 채팅 API 응답 타입
interface ChatResponse {
  message: string;           // AI 응답 텍스트
  choices?: Choice[];        // 다음 선택지 (있을 경우)
  phase: ChatPhase;          // 다음 단계
  result?: DiagnosisResult;  // 분석 완료 시 결과
  error?: string;            // 오류 메시지
}
```

### 5.2 GET `/api/branches?sido={시도}&sigungu={시군구}`

**응답 (Response Body)**:

```typescript
// 지점 조회 응답 타입
interface BranchesResponse {
  branch: Branch | null;  // 매칭 지점 (없으면 null)
}
```

---

## 6. 환경변수 설정

`.env.local` 파일에 다음 변수를 설정해야 합니다:

```env
# Gemini API 설정 (필수)
GEMINI_API_KEY=your_gemini_api_key_here
```

**환경변수 접근 방법**:

- 서버 사이드(API Route): `process.env.GEMINI_API_KEY`
- 클라이언트 사이드 노출 금지 (NEXT_PUBLIC_ 접두사 사용 금지)

---

## 7. 코드 컨벤션

### 7.1 파일 명명 규칙

- 컴포넌트 파일: PascalCase (`ChatMessage.tsx`)
- 훅/유틸 파일: camelCase (`useChat.ts`, `gemini.ts`)
- 상수 파일: UPPER_SNAKE_CASE (`QUESTION_FLOW.ts`) (선택사항)

### 7.2 TypeScript 규칙

- `any` 타입 사용 금지
- 모든 Props에 인터페이스/타입 정의 필수
- API 요청/응답 타입 명시적 정의

### 7.3 주석 규칙 (필수)

- **모든 코드에 한국어 주석 필수**
- 컴포넌트 파일 상단: JSDoc 스타일 설명
- 복잡한 로직: 인라인 주석으로 설명

```typescript
/**
 * 챗봇 메시지 버블 컴포넌트
 * AI와 사용자 메시지를 각각 다른 스타일로 렌더링합니다.
 */
```

### 7.4 Tailwind CSS 사용 규칙

- 반복되는 스타일은 `globals.css`에 `@layer components`로 추출
- 동적 클래스는 `clsx` 또는 삼항 연산자로 처리
- Design_Guide.md의 색상 토큰과 일치하도록 커스텀 색상 정의

---

## 8. 성능 최적화

- 컴포넌트는 필요한 경우에만 `'use client'` 선언
- 이미지는 `next/image` 사용
- 무거운 컴포넌트는 `dynamic import` 적용
- 메시지 목록은 가상화 필요 시 `react-virtual` 고려 (현재는 불필요)

---

## 9. 작업 우선순위

1. **globals.css** 디자인 시스템 구축 → 모든 컴포넌트의 기반
2. **layout.tsx** 폰트/메타데이터 설정
3. **useChat 훅** 구현 → 핵심 비즈니스 로직
4. **ChatContainer & ChatMessage** → 기본 채팅 UI
5. **ChoiceChips & TextInput** → 입력 인터페이스
6. **ProgressBar & LoadingIndicator** → UX 개선
7. **ResultCard & BranchCard** → 최종 결과 화면
8. **랜딩 페이지** → 서비스 진입점
