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
