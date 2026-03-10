# NESS ChatBot (국민취업지원제도 자가진단 챗봇)

NESS ChatBot은 사용자가 국민취업지원제도 수급 자격 및 유형을 AI와의 대화를 통해 쉽고 빠르게 진단받을 수 있도록 돕는 서비스입니다.

## 🚀 주요 기능

### 1. AI 자가진단 챗봇

- **Google Gemini AI**를 활용한 자연스러운 대화형 진단.
- 사용자의 응답을 실시간으로 분석하여 1유형, 2유형 및 제한 대상 판별.
- 진단 결과와 함께 맞춤형 팁 및 안내 사항 제공.

### 2. 지역별 지점 안내

- 진단 완료 후 사용자의 위치에 따른 가장 가까운 운영 지점(분소) 안내.
- 지점별 연락처 및 위치 정보 제공.

### 3. 관리자 대시보드

- **지점 관리**: 전국 지점 정보 추가, 수정, 삭제 및 활성화 상태 관리.
- **사용자 관리**: 서비스 운영진 계정 관리 (bcrypt 보안 적용).
- **설정 관리**: Gemini API 키 및 AI 프롬프트(페르소나) 실시간 업데이트.

---

## 🛠 기술 스택

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: React 19, [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **AI Engine**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Database**: [SQLite (better-sqlite3)](https://github.com/WiseLibs/better-sqlite3)
- **Deployment**: Ubuntu 24.04, Nginx, PM2, Standalone Build

---

## ⚙️ 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수들을 설정해야 합니다.

```env
# Gemini API 설정
GEMINI_API_KEY=your_api_key_here

# 데이터베이스 경로 (절대 경로 또는 프로젝트 루트 기준 상대 경로)
DATABASE_PATH=./data/mainDB.db

# JWT 보안 설정 (관리자 로그인용)
JWT_SECRET=your_random_secret_string

# 기타 설정
PDF_PATH=./국취유형별자가진단.pdf
```

---

## 📦 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 프로덕션 빌드

```bash
npm run build
```

---

## 🚢 배포 가이드

본 프로젝트는 Ubuntu 서버 환경에서의 **Standalone 빌드**를 권장합니다.
상세한 배포 절차(Node.js 설치, Nginx 리버스 프록시 설정, SQLite 권한 부여 등)는 **[배포.md](./배포.md)** 파일을 참조하세요.

### 배포 요약

1. `npm run build` 실행 (로컬 또는 빌드 서버)
2. `.next/standalone` 결과물을 서버의 `/opt/next-app`으로 업로드
3. `pm2 start server.js` 명령어로 서비스 구동
4. Nginx를 통해 80포트 요청을 3000포트로 전달

---

## 📂 프로젝트 구조

- `src/app`: 페이지 라우팅 및 레이아웃 (App Router)
- `src/app/api`: 백엔드 API 엔드포인트 (Gemini 통신, DB 처리 등)
- `src/components`: 재사용 가능한 UI 컴포넌트
- `src/hooks`: 상태 관리 및 비즈니스 로직 (useChat 등)
- `data/`: SQLite 데이터베이스 파일 보관 폴더
- `public/`: 정적 에셋 (이미지, 로티 애니메이션 등)

---

## 📄 라이선스

본 프로젝트의 소유권은 해당 개발 팀에 있으며, 무단 복제 및 배포를 금합니다.

### 💰 1. 2026년 3월 기준 Gemini API 모델명 및 사용 요금표

*모든 요금은 100만 **Token(토큰, 데이터 처리 기본 단위)** 당 **USD(유에스디, 미국 달러)** 기준입니다.*

| 모델 종류 | API 호출 명칭 (실제 코드 입력용) | 텍스트 입력 (≤ 20만 토큰) | 텍스트 출력 (≤ 20만 토큰) | 텍스트 입력 (> 20만 토큰) | 텍스트 출력 (> 20만 토큰) |
| --- | --- | --- | --- | --- | --- |
| **Gemini 3.1 Pro Preview**<br>

<br>(프로 프리뷰, 고성능 사전 공개판) | `gemini-3.1-pro-preview` | $2.00 | $12.00 | $4.00 | $18.00 |
| **Gemini 3.1 Flash Preview**<br>

<br>(플래시 프리뷰, 고속 사전 공개판) | `gemini-3.1-flash-preview` | $0.50 | $3.00 | 단일 요금 적용 | 단일 요금 적용 |
| **Gemini 3.1 Flash-Lite Preview**<br>

<br>(플래시 라이트 프리뷰, 초고속 경량 사전 공개판) | `gemini-3.1-flash-lite-preview` | $0.10 | $0.40 | 단일 요금 적용 | 단일 요금 적용 |
| **Gemini 2.5 Pro**<br>

<br>(프로, 고성능 주력 모델) | `gemini-2.5-pro` | $1.25 | $10.00 | $2.50 | $15.00 |
| **Gemini 2.5 Flash**<br>

<br>(플래시, 고속 가성비 모델) | `gemini-2.5-flash` | $0.30 | $2.50 | 단일 요금 적용 | 단일 요금 적용 |
| **Gemini 2.5 Flash-Lite**<br>

<br>(플래시 라이트, 초고속 경량 모델) | `gemini-2.5-flash-lite` | $0.10 | $0.40 | 단일 요금 적용 | 단일 요금 적용 |

---

### 🚦 2. 서비스 등급(Tier)별 API 호출 제한량 (Rate Limits)

각 요금제 등급에 따라 분당 요청 수, 분당 토큰 수, 일일 요청 수가 다르게 적용됩니다.

- **RPM (알피엠)**: Requests Per Minute (분당 최대 요청 횟수)
- **TPM (티피엠)**: Tokens Per Minute (분당 최대 처리 토큰 수)
- **RPD (알피디)**: Requests Per Day (일일 최대 요청 횟수)

| 모델 종류 | Free Tier<br>

<br>(프리 티어, 무료 제공 구간) | Tier 1<br>

<br>(티어 원, 1단계 유료 결제 구간) | Tier 2<br>

<br>(티어 투, 2단계 유료 결제 구간) |
| --- | --- | --- | --- |
| **Gemini 3.1 Pro Preview** | 5 RPM / 100K TPM / 100 RPD | 25 RPM / 1M TPM / 250 RPD | *(사전 공개판이므로 1단계와 유사하게 제한됨)* |
| **Gemini 3.1 Flash Preview** | 10 RPM / 100K TPM / 250 RPD | 200 RPM / 1M TPM / 250 RPD | *(사전 공개판이므로 1단계와 유사하게 제한됨)* |
| **Gemini 2.5 Pro** | 5 RPM / 250K TPM / 100 RPD | 150 RPM / 1M TPM / 1,500 RPD | 500 RPM / 2M TPM / 10,000 RPD |
| **Gemini 2.5 Flash** | 10 RPM / 250K TPM / 250 RPD | 200 RPM / 1M TPM / 1,500 RPD | 1,000 RPM / 2M TPM / 10,000 RPD |
| **Gemini 2.5 Flash-Lite** | 15 RPM / 250K TPM / 1,000 RPD | 300 RPM / 1M TPM / 1,500 RPD | 1,500 RPM / 2M TPM / 10,000 RPD |
