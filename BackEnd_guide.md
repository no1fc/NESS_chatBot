# ⚙️ Backend Guide: 국민취업지원제도 AI 자가진단 챗봇

> **작업 전 필수 확인 문서. Design_Guide.md와 FrontEnd_guide.md를 먼저 읽은 후 이 문서를 참조하세요.**

---

## 1. 기술 스택

| 항목 | 기술 | 버전/세부사항 |
|------|------|-------------|
| Runtime | Next.js App Router (API Routes) | 16.x |
| Language | TypeScript | ^5 |
| AI API | Google Gemini API | `gemini-2.0-flash` 모델 |
| Database | SQLite | 3.51.2 (better-sqlite3 또는 sqlite 패키지) |
| PDF 처리 | pdfjs-dist | ^3.4.120 |
| 환경변수 | dotenv (.env.local) | Next.js 내장 지원 |

---

## 2. 환경변수 (.env.local)

프로젝트 루트의 `.env.local` 파일에 아래 변수들을 설정합니다:

```env
# ====================================
# Gemini AI API 설정 (필수)
# ====================================
# Google AI Studio에서 발급: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here

# ====================================
# 데이터베이스 설정 (선택 - 기본값 사용)
# ====================================
# SQLite DB 파일 경로 (기본: ./data/branches.db)
DATABASE_PATH=./data/branches.db

# ====================================
# PDF 설정 (선택 - 기본값 사용)
# ====================================
# 국민취업지원제도 규정 PDF 경로
PDF_PATH=./국취유형별자가진단.pdf
```

**보안 주의사항**:

- `.env.local`은 `.gitignore`에 포함되어야 합니다 (Next.js 기본 포함)
- `GEMINI_API_KEY`는 절대 클라이언트 코드에 노출하지 않습니다
- `NEXT_PUBLIC_` 접두사를 붙이지 않습니다

---

## 3. 디렉토리 구조

```
src/
└── app/
    └── api/
        ├── chat/
        │   └── route.ts       # POST /api/chat - 챗봇 대화 처리
        └── branches/
            └── route.ts       # GET /api/branches - 지점 조회
src/
└── lib/
    ├── gemini.ts              # Gemini API 클라이언트 유틸리티
    ├── db.ts                  # SQLite DB 연결 및 쿼리 유틸리티
    ├── pdf-parser.ts          # PDF 텍스트 추출 (규정 문서)
    ├── prompts.ts             # AI 시스템 프롬프트 및 템플릿
    └── seed.ts                # 지점 데이터 초기화 스크립트
data/
└── branches.db                # SQLite DB 파일 (gitignore)
```

---

## 4. API 엔드포인트 명세

### 4.1 POST `/api/chat`

**목적**: 사용자 입력을 받아 Gemini AI로 챗봇 응답 생성

**요청 Body**:

```json
{
  "messages": [
    { "role": "user", "content": "저는 만 28세입니다" },
    { "role": "model", "content": "알겠습니다. 현재 취업 상태는 어떻게 되시나요?" }
  ],
  "phase": "questioning",
  "userAnswers": {
    "age": "28",
    "employment_status": "unemployed"
  }
}
```

**응답 Body**:

```json
{
  "message": "현재 취업 상태는 어떻게 되시나요?",
  "choices": [
    { "id": "c1", "label": "미취업(구직 중)", "value": "unemployed" },
    { "id": "c2", "label": "자영업자", "value": "self_employed" },
    { "id": "c3", "label": "기타", "value": "other", "isOther": true }
  ],
  "phase": "questioning"
}
```

**처리 로직**:

1. 요청 유효성 검증
2. `phase`에 따라 분기:
   - `questioning`: 다음 질문 생성 (Gemini 호출)
   - `analyzing`: PDF 규정 + 누적 답변으로 최종 판별 (Gemini 호출)
3. Gemini API 호출 (Temperature: 0.1)
4. 응답 파싱 및 반환

**에러 처리**:

```json
{ "error": "AI 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요." }
```

---

### 4.2 GET `/api/branches?sido={시도}&sigungu={시군구}`

**목적**: 사용자 지역 기반 잡모아 지점 조회

**요청 파라미터**:

- `sido`: 시/도 명칭 (예: `서울특별시`, `경기도`)
- `sigungu`: 시/군/구 명칭 (예: `강남구`, `수원시`)

**응답 Body (지점 있을 때)**:

```json
{
  "branch": {
    "id": 1,
    "region_sido": "서울특별시",
    "region_sigungu": "강남구",
    "branch_name": "잡모아 강남지점",
    "address": "서울특별시 강남구 테헤란로 123",
    "phone": "02-1234-5678",
    "specific_url": "https://jobmoa.co.kr/branch/gangnam"
  }
}
```

**응답 Body (지점 없을 때)**:

```json
{ "branch": null }
```

**SQL 쿼리**:

```sql
SELECT * FROM branches
WHERE region_sido = ? AND region_sigungu = ?
LIMIT 1;
```

---

## 5. 라이브러리 파일 명세

### 5.1 `src/lib/gemini.ts` - Gemini API 클라이언트

**주요 기능**:

- `@google/generative-ai` 패키지 사용
- `gemini-2.0-flash` 모델 초기화
- Temperature 0.1~0.2 설정 (환각 방지)
- 단일 인스턴스(싱글톤) 패턴 적용

**설치 명령어**:

```bash
npm install @google/generative-ai
```

**구현 패턴**:

```typescript
// Gemini 클라이언트 싱글톤 초기화
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 챗봇용 모델 설정 (Temperature 낮게 = 일관된 답변)
export const chatModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.1,       // 낮은 온도 = 환각 방지
    maxOutputTokens: 2048,  // 최대 출력 토큰
  },
});

// 대화 히스토리를 받아 응답 생성하는 함수
export async function generateChatResponse(
  systemPrompt: string,
  history: Array<{ role: string; parts: Array<{ text: string }> }>,
  userMessage: string
): Promise<string> { ... }
```

---

### 5.2 `src/lib/prompts.ts` - 시스템 프롬프트

**시스템 프롬프트 구조**:

```
[역할 정의]
당신은 국민취업지원제도 자가진단 전문 AI 챗봇입니다.
제공된 PDF 규정 문서만을 기반으로 정확한 정보를 제공합니다.

[규정 문서 컨텍스트]
{pdfContent}

[질문 플로우]
총 5단계 질문을 통해 사용자 정보를 수집합니다:
1. 연령 및 병역 (만 나이, 병역 복무 기간)
2. 근로능력/구직의사 확인
3. 가구원 수 및 월평균 소득
4. 가구 재산 (4억/5억 기준)
5. 취업 경험 (최근 2년 100일/800시간)

[응답 형식]
반드시 JSON 형식으로 응답합니다:
{
  "message": "AI 메시지",
  "choices": [...],  // 있을 경우
  "phase": "다음 단계"
}

[제한 사항]
- PDF 규정 외 정보 제공 금지
- 개인정보 저장 금지
- 법적 판단 제공 금지 (자가진단 목적 명시)
```

**판별 프롬프트**:

```
[누적 QA 데이터]
{userAnswers}

[판별 로직]
위 정보를 바탕으로 국민취업지원제도 참여 유형을 판별합니다:
1. 1유형(요건심사형): 의무 요건 충족 시
2. 1유형(선발형): 선발 점수 산정 후 기준 이상 시
3. 2유형: 1유형 미달이나 특정 계층/청년/중장년 해당 시
4. 참여 제한: 요건 미달 시

[점수 계산 기준]
{scoreTable}

[출력 형식]
JSON으로 반환: { type, score(선발형만), description, tips }
```

---

### 5.3 `src/lib/db.ts` - SQLite 유틸리티

**스키마**:

```sql
-- 지점 정보 테이블
CREATE TABLE IF NOT EXISTS branches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_sido TEXT NOT NULL,     -- 시/도
  region_sigungu TEXT NOT NULL,  -- 시/군/구
  branch_name TEXT NOT NULL,     -- 지점명
  address TEXT NOT NULL,         -- 주소
  phone TEXT NOT NULL,           -- 연락처
  specific_url TEXT NOT NULL,    -- 전용 상담 URL
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 지역 검색 인덱스
CREATE INDEX IF NOT EXISTS idx_region
ON branches(region_sido, region_sigungu);
```

**주요 함수**:

```typescript
// DB 연결 초기화 (최초 1회)
export async function initDB(): Promise<Database> { ... }

// 지역별 지점 조회
export async function getBranchByRegion(
  sido: string,
  sigungu: string
): Promise<Branch | null> { ... }

// 전체 지점 목록 조회 (관리자용)
export async function getAllBranches(): Promise<Branch[]> { ... }
```

---

### 5.4 `src/lib/pdf-parser.ts` - PDF 텍스트 추출

**목적**: `국취유형별자가진단.pdf` 파일을 파싱하여 텍스트 추출

**구현 방식**:

- `pdfjs-dist` 패키지 사용 (이미 설치됨)
- 서버 사이드 전용 (Node.js 환경)
- 최초 1회 파싱 후 캐싱 (메모리 캐시)

```typescript
// PDF 텍스트 캐시 (서버 재시작 전까지 유지)
let pdfTextCache: string | null = null;

// PDF 규정 문서 텍스트 추출 및 캐싱
export async function getPDFContent(): Promise<string> {
  if (pdfTextCache) return pdfTextCache; // 캐시 반환
  // PDF 파싱 로직...
  pdfTextCache = extractedText;
  return pdfTextCache;
}
```

---

### 5.5 `src/lib/seed.ts` - 지점 데이터 시드

**목적**: 잡모아 지점 초기 데이터를 SQLite DB에 삽입

**실행 방법**:

```bash
# 시드 스크립트 실행 (개발환경에서 1회)
npx tsx src/lib/seed.ts
```

**시드 데이터 형식**:

```typescript
// 잡모아 지점 초기 데이터 목록
const branches = [
  {
    region_sido: '서울특별시',
    region_sigungu: '강남구',
    branch_name: '잡모아 강남지점',
    address: '서울특별시 강남구 테헤란로 123, 2층',
    phone: '02-1234-5678',
    specific_url: 'https://jobmoa.co.kr/branch/gangnam'
  },
  // ... 더 많은 지점 데이터
];
```

---

## 6. 챗봇 질문 플로우 설계

### Phase별 질문 단계 (총 5단계)

| 단계 | 질문 주제 | 수집 데이터 | 분기 |
|------|---------|-----------|------|
| Step 1 | 연령 확인 | 생년월일 또는 만 나이 | 15세 미만/70세 이상 → 조기 종료 |
| Step 2 | 병역 여부 (남성만) | 복무 기간 | 청년특례 3년 가산 여부 |
| Step 3 | 근로능력/구직의사 | 재학/군복무/취업불가 여부 | 해당 시 → 조기 종료 |
| Step 4 | 가구원 수 + 소득 | 가구원 수, 월소득 | 중위소득 60%/100%/120% 구간 |
| Step 5 | 재산 + 취업경험 | 재산 총액, 취업일수 | 1유형/2유형/제한 판단 |

### 기준 중위소득 테이블 (2024년 기준)

| 가구원 수 | 60% (1유형) | 100% (2유형) | 120% (2유형) |
|---------|------------|------------|------------|
| 1인 | 1,337,067원 | 2,228,445원 | 2,674,134원 |
| 2인 | 2,209,534원 | 3,682,556원 | 4,419,067원 |
| 3인 | 2,828,794원 | 4,714,657원 | 5,657,588원 |
| 4인 | 3,437,454원 | 5,729,090원 | 6,874,908원 |

*(실제 값은 최신 고용노동부 고시 기준으로 업데이트)*

---

## 7. 에러 처리 전략

### 7.1 API Route 에러 핸들링

```typescript
// 표준 에러 응답 형식
export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}
```

### 7.2 Gemini API 에러 유형

| 에러 | 처리 방법 |
|------|---------|
| API 키 미설정 | 500 + "서버 설정 오류" |
| Rate Limit 초과 | 429 + "잠시 후 다시 시도해주세요" |
| 응답 파싱 실패 | 재시도 1회 후 기본 메시지 반환 |
| 네트워크 오류 | 503 + "AI 서비스 일시 중단" |

### 7.3 응답 검증

- Gemini 응답이 항상 JSON이 아닐 수 있음 → `try/catch` + JSON 파싱
- JSON 파싱 실패 시 텍스트 응답 그대로 `message` 필드에 삽입

---

## 8. 성능 고려사항

- **PDF 캐싱**: 서버 시작 시 1회 파싱 후 메모리 캐시
- **DB 연결 풀링**: `better-sqlite3`는 동기식 → 서버 컴포넌트에 적합
- **응답 스트리밍**: 추후 Gemini Streaming API로 업그레이드 가능
- **비례 지연 (Latency)**: 일반 응답 목표 1.5초, 최종 분석 목표 4초

---

## 9. 보안 고려사항

- API Route는 서버 사이드에서만 실행 → API 키 노출 없음
- SQLite DB 파라미터화 쿼리 사용 (SQL Injection 방지)
- `process.env` 접근은 서버 사이드 파일에서만
- 사용자 입력 길이 제한 (최대 500자)
- Rate Limiting: 향후 Vercel KV 또는 Redis 연동 고려

---

## 10. 개발 환경 실행

```bash
# 의존성 설치
npm install

# Gemini SDK 추가 설치 (아직 미설치된 경우)
npm install @google/generative-ai

# .env.local 설정 후 개발 서버 실행
npm run dev

# SQLite DB 시드 (최초 1회)
npx tsx src/lib/seed.ts
```
