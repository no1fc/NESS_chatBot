# NESS ChatBot (국민취업지원제도 자가진단 챗봇)

NESS ChatBot은 사용자가 국민취업지원제도 수급 자격 및 유형을 AI와의 대화를 통해 쉽고 빠르게 진단받을 수 있도록 돕는 서비스입니다.

## 주요 기능

### 1. AI 자가진단 챗봇

- **Google Gemini AI**를 활용한 자연스러운 대화형 진단.
- 사용자의 응답을 실시간으로 분석하여 1유형, 2유형 및 제한 대상 판별.
- 진단 결과와 함께 맞춤형 팁 및 안내 사항 제공.

### 2. 지역별 지점 안내

- 진단 완료 후 사용자의 위치에 따른 가장 가까운 운영 지점(분소) 안내.
- Kakao Maps 연동으로 지점별 위치 및 연락처 정보 제공.

### 3. 관리자 대시보드

- **지점 관리**: 전국 지점 정보 추가, 수정, 삭제 및 활성화 상태 관리.
- **사용자 관리**: 서비스 운영진 계정 관리 (bcrypt 보안 적용).
- **설정 관리**: Gemini API 키 및 AI 프롬프트(페르소나) 실시간 업데이트.
- **사용량 모니터링**: API 토큰 사용량 확인 및 분석.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Frontend** | React 19, Tailwind CSS 4, Framer Motion |
| **AI Engine** | Google Generative AI (Gemini) |
| **Database** | MSSQL (mssql/tedious) |
| **Auth** | JWT (jose), bcryptjs |
| **Deployment** | Ubuntu 24.04, Nginx, PM2, Standalone Build |

---

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수들을 설정해야 합니다.

```env
# Gemini API
GEMINI_API_KEY=your_api_key_here

# MSSQL 데이터베이스
MSSQL_HOST=localhost
MSSQL_PORT=1433
MSSQL_USER=your_user
MSSQL_PASSWORD=your_password
MSSQL_DATABASE=your_database
MSSQL_ENCRYPT=false
MSSQL_TRUST_SERVER_CERTIFICATE=true

# JWT 보안 설정 (관리자 로그인용)
JWT_SECRET_KEY=your_random_secret_string

# Kakao Maps API
NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_key

# 초기 관리자 계정 (시드 스크립트용)
NESS_ADMIN_ID=admin
NESS_ADMIN_PASSWORD=your_admin_password
```

---

## 시작하기

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
npm run start
```

---

## 배포 가이드

본 프로젝트는 Ubuntu 서버 환경에서의 **Standalone 빌드**를 권장합니다.
상세한 배포 절차는 **[배포.md](./배포.md)** 파일을 참조하세요.

### 배포 요약

1. `npm run build` 실행
2. `.next/standalone` 결과물을 서버의 `/opt/next-app`으로 업로드
3. `pm2 start server.js` 명령어로 서비스 구동
4. Nginx를 통해 80포트 요청을 3000포트로 전달

---

## 프로젝트 구조

```
src/
├── app/              # 페이지 라우팅 및 레이아웃 (App Router)
│   ├── api/          # 백엔드 API 엔드포인트 (Gemini 통신, DB 처리 등)
│   ├── admin/        # 관리자 대시보드 페이지
│   └── chat/         # 챗봇 페이지
├── components/       # 재사용 가능한 UI 컴포넌트
├── hooks/            # 상태 관리 및 비즈니스 로직 (useChat 등)
├── lib/              # 서버 유틸리티 (DB, Auth, Gemini, Prompts)
└── types/            # TypeScript 타입 정의
public/               # 정적 에셋 (이미지, 로티 애니메이션 등)
```

---

## 라이선스

본 프로젝트의 소유권은 해당 개발 팀에 있으며, 무단 복제 및 배포를 금합니다.
