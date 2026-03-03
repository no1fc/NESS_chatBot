# 🎨 Design Guide: 국민취업지원제도 AI 자가진단 챗봇

> **작업 전 필수 확인 문서입니다. 모든 UI 작업 시 이 가이드를 반드시 준수하세요.**

---

## 1. 브랜드 아이덴티티

### 1.1 브랜드 컨셉

- **서비스명**: NESS 챗봇 (잡모아 국취제 자가진단 AI)
- **컨셉**: 신뢰감 있고 친근한 공공 서비스 + 모던 AI 챗봇
- **톤 앤 매너**: 전문적이되 어렵지 않은, 안심감을 주는, 빠르고 명확한

### 1.2 컬러 팔레트

#### 주요 컬러 (Primary)

| 이름 | HEX | 용도 |
|------|-----|------|
| `--color-primary` | `#2563EB` | 주요 CTA 버튼, 활성 상태, 링크 |
| `--color-primary-light` | `#3B82F6` | 호버 상태, 강조 배경 |
| `--color-primary-dark` | `#1D4ED8` | 클릭 상태, 진한 강조 |
| `--color-primary-subtle` | `#EFF6FF` | 버튼 비활성 배경, 선택된 칩 배경 |

#### 보조 컬러 (Secondary)

| 이름 | HEX | 용도 |
|------|-----|------|
| `--color-secondary` | `#10B981` | 긍정 결과 (1유형 통과), 진행 완료 |
| `--color-secondary-light` | `#34D399` | 성공 알림, 호버 |
| `--color-warning` | `#F59E0B` | 선발형 경계 점수 경고 |
| `--color-error` | `#EF4444` | 요건 미달, 오류 메시지 |

#### 중립 컬러 (Neutral)

| 이름 | HEX | 용도 |
|------|-----|------|
| `--color-gray-900` | `#111827` | 주요 텍스트 |
| `--color-gray-700` | `#374151` | 본문 텍스트 |
| `--color-gray-500` | `#6B7280` | 보조 텍스트, 플레이스홀더 |
| `--color-gray-300` | `#D1D5DB` | 구분선, 비활성 테두리 |
| `--color-gray-100` | `#F3F4F6` | 배경, 비활성 영역 |
| `--color-white` | `#FFFFFF` | 카드 배경, 챗 버블 |

#### 배경 그라데이션

```css
/* 랜딩 페이지 히어로 배경 */
background: linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 50%, #ECFDF5 100%);

/* 챗봇 페이지 배경 */
background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
```

---

## 2. 타이포그래피 (Typography)

### 2.1 폰트 패밀리

- **한글 제목**: `Noto Sans KR` (Google Fonts) - weight: 700, 600
- **한글 본문**: `Noto Sans KR` - weight: 400, 500
- **영문/숫자**: `Inter` (Google Fonts) - weight: 400, 600, 700
- **Fallback**: `system-ui, -apple-system, Arial, sans-serif`

```css
/* layout.tsx에서 Google Fonts 임포트 방식 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Inter:wght@400;600;700&display=swap');
```

### 2.2 텍스트 스케일

| 클래스명 | 크기 | Line Height | 용도 |
|---------|------|-------------|------|
| `.text-hero` | 32px / 2rem | 1.3 | 랜딩 메인 헤드라인 |
| `.text-heading` | 24px / 1.5rem | 1.4 | 섹션 제목 |
| `.text-subheading` | 18px / 1.125rem | 1.5 | 카드 제목 |
| `.text-body-lg` | 16px / 1rem | 1.6 | 챗봇 메시지 |
| `.text-body` | 14px / 0.875rem | 1.6 | 일반 본문 |
| `.text-caption` | 12px / 0.75rem | 1.5 | 보조 설명, 날짜 |

---

## 3. 컴포넌트 디자인 시스템

### 3.1 챗 버블 (Chat Bubble)

#### AI 메시지 (왼쪽 정렬)

```
┌─────────────────────────────────┐
│ 🤖  AI 메시지 텍스트가 여기에     │
│     표시됩니다.                  │
└─────────────────────────────────┘
```

- 배경: `--color-white`
- 테두리: `1px solid --color-gray-200`
- 그림자: `0 1px 3px rgba(0,0,0,0.08)`
- 모서리: `16px 16px 16px 4px` (왼쪽 하단만 직각)
- 최대 너비: `75%`

#### 사용자 메시지 (오른쪽 정렬)

```
          ┌─────────────────────┐
          │    사용자 응답 텍스트 │
          └─────────────────────┘
```

- 배경: `--color-primary` (`#2563EB`)
- 텍스트: `white`
- 모서리: `16px 16px 4px 16px` (오른쪽 하단만 직각)
- 최대 너비: `75%`

### 3.2 선택지 칩 (Choice Chips)

```
┌──────────────────────────────────────────┐
│  ◉  만 34세 이하 (청년)                    │  ← 선택됨 (primary 배경)
├──────────────────────────────────────────┤
│  ○  만 35~69세 (중장년)                   │  ← 미선택 (white 배경)
├──────────────────────────────────────────┤
│  ○  기타                                  │  ← 미선택
└──────────────────────────────────────────┘
```

- 너비: 100% (수직 리스트)
- 높이: 최소 52px
- 모서리: 12px
- 테두리: `2px solid` (선택 시 primary, 미선택 시 gray-300)
- 호버: 배경 `--color-primary-subtle`
- 애니메이션: `transform: translateY(-1px)` on hover

### 3.3 Progress Bar

```
질문 3 / 10
━━━━━━━━━━━░░░░░░░░░░░░░░░
```

- 높이: 6px
- 배경: `--color-gray-200`
- 활성 부분: `linear-gradient(90deg, #2563EB, #10B981)`
- 모서리: 999px (pill 형태)
- 애니메이션: `transition: width 0.4s ease-in-out`

### 3.4 CTA 버튼

#### Primary Button (잡모아 지점)

- 배경: `--color-primary` → 호버: `--color-primary-dark`
- 텍스트: white, font-weight: 600
- 패딩: `14px 24px`
- 모서리: 12px
- 아이콘: `→` 오른쪽 배치

#### Secondary Button (고용24)

- 배경: white, 테두리: `2px solid --color-primary`
- 텍스트: `--color-primary`
- 동일 패딩/모서리

### 3.5 결과 카드 (Result Card)

```
┌─────────────────────────────────────────┐
│  🎉  진단 결과                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│  유형: 1유형 (요건심사형)                  │
│  예상 수당: 월 최대 50만원                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│  📍 지역 선택하기                          │
└─────────────────────────────────────────┘
```

- 배경: white
- 테두리: `1px solid --color-gray-200`
- 그림자: `0 4px 16px rgba(0,0,0,0.08)`
- 모서리: 20px
- 패딩: 24px

### 3.6 로딩 UI (Loading Indicator)

- **스켈레톤 UI**: 챗 버블 자리에 회색 애니메이션 블록 표시
- **메시지**: `"AI가 요건을 검토 중입니다..."` (점 3개 애니메이션)
- 배경 그라데이션: `shimmer effect` (왼쪽 → 오른쪽)

---

## 4. 레이아웃 시스템

### 4.1 페이지 구성

```
┌─────────────────────────────────┐
│  Header (고정)                   │ ← 60px, sticky top
│  ─────────────────────────────  │
│                                 │
│  메인 컨텐츠 영역                  │ ← flex-1, overflow-y: auto
│  (채팅 메시지 스크롤)              │
│                                 │
│  ─────────────────────────────  │
│  선택지 영역 (고정)                │ ← 최대 300px
│  (칩 버튼 or 텍스트 입력)         │
└─────────────────────────────────┘
```

### 4.2 반응형 브레이크포인트 (Tailwind CSS 기준)

| 이름 | 최소 너비 | 용도 |
|------|---------|------|
| `sm` | 640px | 소형 태블릿/대형 폰 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크탑 |

- **모바일 우선 설계**: 기본 스타일은 모바일, 큰 화면에서 옵션 적용
- **챗봇 최대 너비**: `max-w-lg` (512px) → 중앙 정렬

### 4.3 간격 시스템

- **기본 단위**: 4px (Tailwind spacing 기준)
- 컴포넌트 내부 패딩: 16px~24px
- 메시지 간 간격: 12px
- 섹션 간 간격: 32px

---

## 5. 애니메이션 & 인터랙션

### 5.1 메시지 등장 애니메이션

```css
/* AI 메시지 슬라이드-인 */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-12px) translateY(4px); }
  to   { opacity: 1; transform: translateX(0) translateY(0); }
}

/* 사용자 메시지 슬라이드-인 */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(12px) translateY(4px); }
  to   { opacity: 1; transform: translateX(0) translateY(0); }
}
animation-duration: 0.25s;
animation-timing-function: ease-out;
```

### 5.2 버튼 인터랙션

- 호버: `translateY(-2px)` + box-shadow 강화
- 클릭: `translateY(0)` + scale(0.98)
- transition: `all 0.15s ease`

### 5.3 Progress Bar 트랜지션

- `transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1)`

---

## 6. 아이콘 시스템

- **라이브러리**: `lucide-react` (이미 설치됨)
- AI 봇 아이콘: `Bot` 아이콘 (파란색)
- 사용자 아이콘: `User` 아이콘 (회색)
- 지점 아이콘: `MapPin` (빨간색)
- 진단 완료: `CheckCircle2` (초록색)
- 경고: `AlertTriangle` (노란색)

---

## 7. 접근성 (Accessibility)

- 모든 버튼에 `aria-label` 명시
- 색상 대비 최소 4.5:1 준수 (WCAG AA)
- 키보드 네비게이션 지원 (`focus-visible` 스타일)
- 로딩 상태에 `aria-live="polite"` 적용
- 시맨틱 HTML 사용 (`<main>`, `<section>`, `<article>`)

---

## 8. 면책 문구 디자인

소득/재산 관련 질문 앞에 표시:

```
ℹ️ 입력 정보는 자가진단 용도로만 사용되며 저장되지 않습니다.
```

- 배경: `#EFF6FF` (연한 파란색)
- 테두리: `1px solid #BFDBFE`
- 텍스트: `#1E40AF` (진한 파란색)
- 아이콘: `Info` (lucide-react)
- 모서리: 8px
- 패딩: 10px 14px
