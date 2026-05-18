# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (Turbopack enabled)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

No test framework is configured yet.

## Architecture Overview

NESS is a Korean employment support self-diagnosis AI chatbot (국민취업지원제도 자가진단). Users answer a series of questions, and a Gemini AI analyzes their eligibility for government employment support programs (Type 1/Type 2).

**Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, MSSQL (mssql/tedious), Google Gemini API

### Request Flow

1. User opens `/chat` → `ChatContainer` renders, calls `useChat()` hook
2. `useChat` manages all chat state and calls `POST /api/chat` for each step
3. `/api/chat` returns static questions sequentially (`phase: 'questioning'`), then on the final step triggers `phase: 'analyzing'`
4. During analysis, `buildAnalysisPrompt()` in `prompts.ts` assembles the full system prompt with user answers, income tables, and scoring rules
5. `generateResponse()` in `gemini.ts` calls Gemini API with retry logic and multi-key fallback
6. The AI returns a JSON diagnosis result (type, score, description, tips)
7. `ResultCard` and `BranchCard` display the result with a nearby branch lookup via Kakao Maps

### Key Modules

- **`src/hooks/useChat.ts`** — Central chat state machine. Manages phases (`intro → questioning → analyzing → result`), message history, user answers, and state snapshots for go-back functionality.
- **`src/lib/prompts.ts`** — All AI prompts and question definitions. Static questions are stored as arrays. The system prompt uses `{{placeholder}}` template variables replaced at runtime. Prompts are DB-overridable via `system_settings` table.
- **`src/lib/db.ts`** — MSSQL connection pool (singleton) with tables: `branches`, `admin_users`, `system_settings`, `api_usage_logs`. Handles schema migration (column additions) on startup.
- **`src/lib/gemini.ts`** — Gemini API client with rate-limit retry (429 → 30s wait) and multiple API key fallback.
- **`src/middleware.ts`** — Protects `/admin/*` routes with JWT cookie validation. Role-based: `admin` sees subset of pages, `superadmin` sees all.

### Admin Dashboard

Admin pages at `/admin/*` provide CRUD for branches, users, API keys, AI prompts, and usage analytics. Two roles exist: `admin` (limited) and `superadmin` (full access). Auth uses JWT stored in `admin_session` cookie.

### Design System

`DESIGN.md` in the project root defines the visual system (opencode.ai inspired). All UI work should reference this file. Key rules:
- Background: `#201d1d` (warm dark), elevated: `#302c2c`
- Accent: `#007aff` (blue), semantic colors follow Apple HIG
- Border: `rgba(15, 0, 0, 0.12)`, radius: `4px` everywhere (inputs: `6px`)
- No shadows, no backdrop-blur, no glassmorphism — flat surfaces only
- Design tokens are defined in `globals.css` under `@theme`

## Environment Variables

Required in `.env.local`:
- `GEMINI_API_KEY` — Google Gemini API key (additional keys managed via admin settings DB)
- `NEXT_PUBLIC_KAKAO_MAP_API_KEY` — Kakao Maps JavaScript API key
- `NESS_ADMIN_ID` / `NESS_ADMIN_PASSWORD` — Initial admin credentials (used by seed script)
- `JWT_SECRET_KEY` — JWT signing secret (MUST be set in production, no fallback allowed)
- `MSSQL_HOST`, `MSSQL_PORT`, `MSSQL_USER`, `MSSQL_PASSWORD`, `MSSQL_DATABASE` — MSSQL connection
- `MSSQL_ENCRYPT`, `MSSQL_TRUST_SERVER_CERTIFICATE` — MSSQL TLS options

## Harness Configuration

### Permissions (`.claude/settings.local.json`)
- `npm run *`, `npx *`, `git *`, `gh *` — 빌드/린트/깃 자동 허용
- Playwright, Context7, Exa, GitHub MCP — 자동 허용

### PostToolUse Hooks
- **TypeScript check**: `.ts`/`.tsx` 파일 편집 후 `tsc --noEmit` 자동 실행 (오류 시 상위 20줄 표시)

### Workflow
- 기능 추가 시: brainstorming → planning → TDD → code-review 순서
- 커밋 전: `npm run lint` + `npm run build` 통과 확인
- 보안 민감 코드 변경 시: security-reviewer 에이전트 사용

## Important Patterns

- **Path alias**: `@/*` maps to `src/*`
- **Server-only modules**: `db.ts`, `auth.ts`, `gemini.ts`, `prompts.ts` use `mssql` and must not be imported from client components. Shared types should be extracted to `src/types/`.
- **Native packages**: `pdfjs-dist`, `mssql`, `canvas` are configured as `serverExternalPackages` in `next.config.ts` to prevent bundling issues.
- **API responses**: Not yet standardized — some routes return `{ success, data }`, others return raw objects. See `docs/ISSUES.md` for tracked inconsistencies.
- **Known issues**: `docs/ISSUES.md` tracks 21 codebase issues by priority (security, architecture, code quality, design, DX).
