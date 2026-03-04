# 관리자 페이지 제작 진행도 (Admin Page Progress)

본 문서는 NESS 챗봇의 관리자 페이지 제작을 위한 일정, 진행도 및 세부 구성을 추적하는 문서입니다.

## 🎯 전체 목표

- **접근 제어**: URL 직접 접속 시 로그인 페이지로 이동, 인증된 관리자만 접속 가능하도록 보호
- **주요 기능 (5가지 페이지)**:
  1. 지점 등록 페이지
  2. 관리자 지정 페이지
  3. Gemini API 등록 페이지
  4. 프롬프트(Prompt) 수정 페이지
  5. PDF NESS Info 및 PDF Parser 수정 페이지

---

## 📅 전체 개발 일정 (Schedule)

- [x] **Phase 1: 인증 및 기본 레이아웃 (Auth & Layout)**
  - 로그인 페이지 및 인증 로직 (세션/토큰) 구현 완료
  - 관리자 전용 레이아웃 분리 컴포넌트 개발 (`/admin/*` 경로 보호) 완료
- [x] **Phase 2: 지점 등록 및 관리자 지정 페이지 (CRUD 기능 위주)**
  - 지점 정보 관리(추가/수정/삭제) 프론트엔드 및 백엔드 API
  - 관리자 권한 부여 및 계정 관리 프론트엔드 및 백엔드 API
- [x] **Phase 3: Gemini API 및 시스템 설정 페이지 (시스템 연동 위주)**
  - Gemini API Key 설정 및 관리 페이지
  - 시스템 프롬프트 업데이트 프론트엔드 및 백엔드 로직
- [x] **Phase 4: PDF & Parser 수정 페이지**
  - Text 및 설정값 수정 에디터 도입
  - 파일 또는 DB 정보 업데이트 로직 연동
- [ ] **Phase 5: 권한 테스트, 보안 및 QA**
  - 비인가 접근 차단 등 보안성 테스트
  - 전체 사용자 경험 및 인터페이스 정비

---

## 🛠 세부 페이지 구성 및 진행도 (Components & API)

### 0. 공통 로그인 및 인증 (Auth)

- **상태**: 🟩 완료 (100%)
- **Frontend**:
  - 관리자 로그인 폼 (ID/PW 입력) 구현 완료
  - 로그인 유지 및 라우팅 가드 (Middleware 활용) 완료
- **Backend**:
  - 관리자 인증 API (`/api/admin/login`) 및 로그아웃 구현 완료
  - `jose` 라이브러리를 사용한 JWT 쿠키/세션 기반 Token Auth 로직 완료

### 1. 지점 등록 페이지

- **상태**: 🟩 완료 (100%)
- **Frontend**:
  - 등록된 전체 지점 목록을 보여주는 테이블 형태의 대시보드
  - 신규 지점 등록, 수정, 삭제용 모달/페이지 UI 구성
- **Backend**:
  - 지점 목록 조회, 추가, 변경, 삭제 CRUD API 구현 (`/api/admin/branches`)

### 2. 관리자 지정 페이지

- **상태**: 🟩 완료 (100%)
- **Frontend**:
  - 기존 관리자 목록 확인 및 접근 권한 활성화/비활성화 스위치 UI
  - 신규 관리자 초청 혹은 생성 폼
- **Backend**:
  - 관리자 데이터베이스 목록 및 권한 변경 CRUD API 구현 (`/api/admin/users`)

### 3. Gemini API 등록 페이지

- **상태**: 🟩 완료 (100%)
- **Frontend**:
  - 현재 사용하는 API 키의 마스킹 상태 (예: `AIza...*******`) 표시
  - 신규 API Key 등록 가능한 입력 폼 및 교체 버튼 로직 구성
- **Backend**:
  - API 키 저장 매체 (Database 혹은 런타임 `.env` 메모리 환경변수) 조회 및 업데이트 인젝터 API 구현 (`/api/admin/settings/gemini`)

### 4. 프롬프트 (Prompt) 수정 페이지

- **상태**: 🟩 완료 (100%)
- **Frontend**:
  - 챗봇의 페르소나, 핵심 규칙 등을 변경할 수 있는 다중 텍스트 에디터 UI (`src/lib/prompts.ts` 대응)
- **Backend**:
  - 프롬프트 파일 내용 파싱 후 조회 API
  - 입력받은 프롬프트 데이터를 기반으로 파일 직접 업데이트(fs) 또는 설정 DataBase화 API 구현 (`/api/admin/settings/prompts`)

### 5. PDF NESS Info & PDF Parser 수정 페이지

- **상태**: 🟩 완료 (100%)
- **Frontend**:
  - 국민취업지원제도 정보(`pdf-NESS-info.ts`) 내용 에디터 영역
  - PDF 정보 파싱 우선순위 및 규칙(`pdf-parser.ts`) 에디터 영역
  - 변경 전/후 내용 비교(Diff) 및 저장 버튼
- **Backend**:
  - 1차적인 파일 리더 API
  - 작성된 규칙/콘텐츠 기반 ts 파일 Rewrite 혹은 DB 연동 API 구현 (`/api/admin/settings/pdf-info`)
