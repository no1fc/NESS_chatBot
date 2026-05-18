# 메인 페이지 디자인 개선안

> 작성일: 2026-04-29
> 대상: `src/app/page.tsx` (랜딩 페이지)

---

## 1. 현재 문제 진단

### 전체적 인상: "횡하다"
현재 랜딩 페이지는 텍스트와 선(border)만으로 구성되어 있어 시각적 무게감이 없고 허전한 느낌을 준다.

| 요소 | 현재 상태 | 문제 |
|------|----------|------|
| 히어로 이미지 | 없음 (텍스트 + VirtualChatDemo만) | 첫인상이 밋밋함, 시선을 끌 앵커 부재 |
| 일러스트/그래픽 | 전혀 없음 | 4개 섹션 모두 텍스트 나열 |
| 배경 | 단색 `#201d1d` 만 사용 | 섹션 간 구분 없이 단조로움 |
| 아이콘 | lucide-react 기본 선 아이콘만 | 작고 가늘어서 시각적 무게 없음 |
| 애니메이션 | fade-in, reveal-up 2개만 | 정적인 느낌, 스크롤 인터랙션 없음 |
| 이미지 에셋 | `public/`에 JobmoaLogo.svg 1개만 | 브랜드 비주얼 아이덴티티 부재 |
| 섹션 구분 | 없음 (같은 배경, 같은 톤) | 스크롤해도 화면이 변하지 않는 느낌 |

### 플랫폼 내 다른 페이지와의 비교
- **채팅 페이지**: 중앙 정렬 질문 + 아이콘 박스 + 프로그레스바 → 시각 요소 있음
- **결과 페이지**: 컬러 보더 카드 + 점수 표시 + 타입별 아이콘 → 풍부한 비주얼
- **관리자 페이지**: 통계 카드 + 컬러 틴트 배경 → 정보 밀도 있음
- **랜딩 페이지**: 텍스트 + 얇은 border만 → **가장 밋밋한 페이지**

---

## 2. 개선 방향

**원칙**: DESIGN.md의 "따뜻한 다크 + 플랫 + 모노스페이스" 톤은 유지하되, 시각적 밀도를 높인다.

### 2-1. 히어로 섹션 개선

**현재**: "SMART FUTURE" 텍스트 + 오른쪽 VirtualChatDemo

**개선안**:

#### A. 배경 그래디언트 추가
- 순수 단색 → 미세한 radial gradient로 시선 유도
- 예: `radial-gradient(ellipse at 30% 50%, rgba(0,122,255,0.06) 0%, transparent 60%)`
- 디자인 시스템의 "no gradient" 원칙에 반하지만, 극도로 미세한 수준으로 분위기만 잡는 용도
- 대안: gradient 대신 accent 색상의 얇은 glow dot (CSS `box-shadow`)을 히어로 좌측에 배치

#### B. 히어로 일러스트/그래픽 추가 (권장)
- VirtualChatDemo 위 또는 배경에 추상적 그래픽 요소 배치
- **추천 이미지 종류**:
  - 네트워크/노드 연결 패턴 (AI 기술감 표현)
  - 또는 사람 실루엣 + 화살표 (취업 지원 방향성 표현)
  - SVG 기반으로 `#007aff` 액센트 + `#302c2c` 서브 톤 사용
- **파일**: `public/images/hero-graphic.svg`

#### C. 스탯 숫자 배너 추가
히어로 하단에 핵심 수치를 나열해 신뢰감 형성:
```
┌─────────────────────────────────────────────────┐
│  360만원          6개월         3분 진단         │
│  최대 지원금      지급 기간      소요 시간        │
└─────────────────────────────────────────────────┘
```
- 각 숫자에 accent 색상(`#007aff`) 적용
- 구분선(`border-r`) 또는 간격으로 분리
- 간결한 모노스페이스 숫자가 디자인 시스템과 잘 맞음

---

### 2-2. 제도 안내 섹션 (섹션 2) 개선

**현재**: 좌측 텍스트 + 우측 2장 카드 (border-only)

**개선안**:

#### A. 카드 아이콘 강화
- 현재: 24px lucide 아이콘 (가늘고 작음)
- 개선: 아이콘 박스를 더 크게 (64x64) + 배경에 semantic color tint 적용
```
현재:  [  $  ]  ← 12x12 box, 투명 배경
개선:  [  $  ]  ← 16x16 box, rgba(48,209,88,0.08) 배경
```
- 아이콘 색상과 매칭되는 은은한 배경 tint가 카드에 생동감 부여

#### B. 카드 상단에 시각 요소 추가 (권장)
- 각 카드 상단에 가로 컬러 스트라이프 (4px 높이, semantic color):
  - Type 1: `#30d158` (green)
  - Type 2: `#007aff` (blue)
- 카드가 "살아있는" 느낌을 줌
- 대안: 카드 좌측에 세로 accent bar (결과 카드의 borderColor 패턴과 통일)

#### C. 지원 금액을 시각적으로 강조
- "360만원", "195만원" 같은 금액 수치를 `text-text`(흰색) + `font-bold`로 별도 강조
- 현재 설명 텍스트와 같은 `text-text-secondary`로 묻혀 있음

---

### 2-3. 기술 섹션 (섹션 3) 개선

**현재**: 큰 제목 + 3열 텍스트 (가장 빈 섹션)

**개선안**:

#### A. 각 기술 항목에 아이콘 추가
```
현재:                        개선:
Security                     🔒  Security
텍스트만...                   [Shield 아이콘]
                              텍스트...

Accurate                     📊  Accurate
텍스트만...                   [Database 아이콘]
                              텍스트...

Empathy                      💬  Empathy
텍스트만...                   [Heart 아이콘]
                              텍스트...
```
- lucide-react: `Shield`, `Database`, `Heart` 또는 `MessageCircleHeart`
- 아이콘을 44x44 박스에 넣고 accent color tint 배경

#### B. 배경 패턴 또는 그래픽 (선택)
- 이 섹션 배경에 매우 미세한 그리드 패턴 (모노스페이스 테마에 맞음)
- CSS로 구현: `background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 40px 40px;`
- 코드/터미널 분위기를 유지하면서 빈 공간을 채움

#### C. 숫자/수치 강조 (권장)
각 항목에 임팩트 수치를 추가:
```
Security          Accurate           Empathy
0건               2026               ∞
데이터 보관       최신 기준 적용      맞춤 조언
```
- 큰 숫자가 시선을 끌고 정보 전달력을 높임

---

### 2-4. CTA + 푸터 섹션 (섹션 4) 개선

**현재**: 큰 텍스트 + 링크만 있는 빈 화면

**개선안**:

#### A. CTA 버튼 스타일 변경
- 현재: 밑줄 텍스트 링크 (가늘고 약함)
- 개선: 실제 버튼 형태로 변경
```
현재:  국취제 진단하기 →  (밑줄 텍스트)
개선:  [ 지금 바로 진단 시작하기  → ]  (실선 border 버튼 또는 filled 버튼)
```
- DESIGN.md의 Primary Button 스타일 활용 가능 (dark fill, light text)
- 또는 outline 버튼: `border-accent text-accent hover:bg-accent hover:text-white`

#### B. 진단 과정 미리보기 추가 (권장)
CTA 위에 진단 플로우를 시각적으로 보여주는 스텝 인디케이터:
```
  ① 기본 정보    →    ② 소득·재산    →    ③ AI 분석    →    ④ 결과 확인
     2분                  1분               즉시              바로 확인
```
- 사용자가 "3분이면 끝난다"는 것을 직관적으로 이해
- 각 스텝을 작은 아이콘 + 텍스트로 표현
- 현재 채팅의 ProgressBar와 시각적으로 연결

---

## 3. 추가 필요 이미지/에셋 목록

### 필수 (코드로 구현 가능)

| 에셋 | 용도 | 구현 방법 | 위치 |
|------|------|----------|------|
| 히어로 배경 glow | 히어로 섹션 시각적 앵커 | CSS radial-gradient 또는 SVG | 섹션 1 배경 |
| 그리드 패턴 | 기술 섹션 배경 텍스처 | CSS background-image | 섹션 3 배경 |
| 스텝 인디케이터 | CTA 진단 플로우 미리보기 | React 컴포넌트 + lucide 아이콘 | 섹션 4 |
| 스탯 숫자 배너 | 핵심 수치 강조 | React 컴포넌트 | 섹션 1 하단 |
| 카드 컬러 스트라이프 | 카드 시각적 강조 | CSS border-top 또는 div | 섹션 2 카드 |

### 권장 (이미지 파일 필요)

| 에셋 | 용도 | 사양 | 저장 경로 |
|------|------|------|----------|
| hero-graphic.svg | 히어로 메인 그래픽 | SVG, 600x400, 액센트 블루 + 다크 톤 | `public/images/hero-graphic.svg` |
| pattern-nodes.svg | AI 네트워크 패턴 (타일링용) | SVG, 200x200, 반투명 | `public/images/pattern-nodes.svg` |
| icon-security.svg | 보안 커스텀 아이콘 | SVG, 48x48, `#007aff` | `public/images/icons/security.svg` |
| icon-accurate.svg | 정확도 커스텀 아이콘 | SVG, 48x48, `#30d158` | `public/images/icons/accurate.svg` |
| icon-empathy.svg | 공감 커스텀 아이콘 | SVG, 48x48, `#ff9f0a` | `public/images/icons/empathy.svg` |
| og-image.png | 소셜 미디어 공유 이미지 | PNG, 1200x630 | `public/images/og-image.png` |
| favicon.svg | 브랜드 파비콘 | SVG/ICO, 32x32 | `public/favicon.svg` |

### 선택 (있으면 좋음)

| 에셋 | 용도 | 비고 |
|------|------|------|
| 취업 관련 일러스트 | 섹션 2 배경 또는 카드 내 | 정부 지원 제도의 친근한 이미지 |
| 진단 결과 샘플 스크린샷 | CTA 섹션 신뢰도 향상 | 실제 결과 화면 캡처 (민감 정보 제거) |
| 잡모아 로고 (다크 버전) | 푸터 브랜딩 강화 | 현재 흰 배경 박스 안 로고만 있음 |

---

## 4. 섹션별 개선 우선순위

| 순위 | 섹션 | 작업 | 난이도 | 임팩트 |
|------|------|------|--------|--------|
| 1 | 히어로 | 스탯 숫자 배너 추가 | 낮음 | 높음 |
| 2 | 히어로 | 배경 glow 효과 | 낮음 | 중간 |
| 3 | 기술 | 아이콘 + 수치 추가 | 낮음 | 높음 |
| 4 | 제도 안내 | 카드 컬러 스트라이프 + 금액 강조 | 낮음 | 중간 |
| 5 | CTA | 진단 스텝 인디케이터 | 중간 | 높음 |
| 6 | CTA | 버튼 스타일 변경 | 낮음 | 중간 |
| 7 | 기술 | 배경 그리드 패턴 | 낮음 | 낮음 |
| 8 | 히어로 | 커스텀 SVG 그래픽 | 높음 | 높음 |

---

## 5. 참고: 변경하지 말 것

- `DESIGN.md`의 색상 팔레트 (accent blue, semantic colors) — 그대로 활용
- `4px` border-radius 원칙 — 유지
- 그림자(box-shadow) 사용 금지 원칙 — glow는 `background` 또는 `opacity`로 대체
- Berkeley Mono / Pretendard 폰트 체계 — 유지
- VirtualChatDemo 컴포넌트 — 유지 (히어로의 유일한 인터랙티브 요소)
- 스냅 스크롤 구조 — 유지 (100dvh 섹션별 snap)

---

## 6. 구현 시 참고 파일

```
src/app/page.tsx              ← 메인 수정 대상
src/app/globals.css           ← 배경 패턴, glow 등 CSS 추가
src/components/VirtualChatDemo.tsx  ← 유지, 필요 시 크기 조정
src/components/layout/Header.tsx    ← 변경 없음
DESIGN.md                     ← 디자인 원칙 참조
```
