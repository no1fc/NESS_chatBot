/**
 * AI 시스템 프롬프트 및 템플릿 모음
 * 국민취업지원제도 자가진단 챗봇의 모든 프롬프트를 중앙 관리.
 * DB 연동으로 인해 상수들을 함수로 래핑합니다.
 */

import { getSetting } from '@/lib/db';

// ====================================
// 기본 설정값 (Fallback용 상수)
// ====================================

export const DEFAULT_MEDIAN_INCOME_TABLE = `
[2026년 기준 중위소득]
| 가구원 수 | 100% | 60% (1유형 요건심사) | 120% (1유형 청년특례) |
|---------|------|-------------------|------------------|
| 1인가구 | 2,564,238원 | 1,538,542원 | 3,077,085원 |
| 2인가구 | 4,199,292원 | 2,519,575원 | 5,039,150원 |
| 3인가구 | 5,359,036원 | 3,215,421원 | 6,430,843원 |
| 4인가구 | 6,494,738원 | 3,896,842원 | 7,793,685원 |
| 5인가구 | 7,556,719원 | 4,534,031원 | 9,068,062원 |
| 6인가구 | 8,555,952원 | 5,133,571원 | 10,267,142원 |
| 7인가구 | 9,515,150원 | 5,709,090원 | 11,418,180원 |
`;

export const DEFAULT_SCORE_TABLE = `
[선발형 구직촉진수당 수급자격 기준 합산 점수]
1. 가구단위 월평균 총소득
- 기준 중위소득 40% 이하: 비경활 40점, 청년특례 50점
- 40% 초과 50% 이하: 비경활 30점, 청년특례 45점
- 50% 초과 60% 이하: 비경활 20점, 청년특례 40점
- 60% 초과 80% 이하: 비경활 0점, 청년특례 35점
- 80% 초과 100% 이하: 비경활 0점, 청년특례 30점
- 100% 초과 120% 이하: 비경활 0점, 청년특례 30점

2. 재산의 합계액
- 1억원 이하: 30점 (비경활/청년특례 동일)
- 1억원 초과 2.5억원 이하: 22점
- 2.5억원 초과: 14점

3. 미취업기간 또는 취업준비기간 (최근 2년 이내)
- 취업기간 총 60일(480시간) 이상: 비경활 30점, 청년특례 20점
- 총 30일 이상 ~ 60일 미만: 비경활 22점, 청년특례 12점
- 총 30일 미만: 비경활 14점, 청년특례 4점

4. 미취학연령 자녀 거주: 가점 5점
5. 유사제도 수혜: 1년 이내 10점 감점, 1~2년 이내 5점 감점
`;

export const DEFAULT_STATIC_QUESTIONS = [
  {
    id: 'age',
    message: '1. 연령 현황\n만 나이가 어떻게 되시나요? (예: 만 25세 등 나이를 직접 입력해주세요)',
    choices: [
      { id: 'youth', label: '청년 (만 15세 ~ 34세)', value: '청년 (만 15세 ~ 34세)' },
      { id: 'middle', label: '중장년 (만 35세 ~ 69세)', value: '중장년 (만 35세 ~ 69세)' },
      { id: 'other', label: '직접 입력', value: 'other', isOther: true },
    ],
    showIncomeTable: false
  },
  {
    id: 'military_service',
    message: '2. 군 복무 여부\n군 복무(현역, 사회복무요원 등)를 마치셨나요? (복무 기간만큼 청년 연령이 연장되어 최대 만 37세까지 청년으로 인정될 수 있습니다)',
    choices: [
      { id: 'mil_yes', label: '복무 완료 (병역필)', value: '병역필' },
      { id: 'mil_no', label: '미필/면제/여성', value: '해당 없음' },
      { id: 'mil_doing', label: '복무 중 (전역 2개월 전 제외)', value: '군 복무 중' },
    ],
    showIncomeTable: false
  },
  {
    id: 'work_status',
    message: '3. 미취업 및 특이사항 여부\n현재 학업이나 병역, 혹은 근로활동 상태를 알려주세요.',
    choices: [
      { id: 'none', label: '미취업 (주 30시간 미만/월 소득 250만 미만)', value: '해당 없음 (미취업 요건 충족)' },
      { id: 'working', label: '근로 중 (주 30시간 이상 등)', value: '현재 주 30시간 이상 근로 중' },
      { id: 'student', label: '재학생 (특성화고 3학년, 대학 마지막 학기 제외)', value: '재학 중' },
      { id: 'other', label: '직접 입력', value: 'other', isOther: true },
    ],
    showIncomeTable: false
  },
  {
    id: 'family_size',
    message: '4. 가구원 수 현황\n주민등록등본상 가구원 수는 몇 명인가요?',
    choices: [
      { id: 'family_1', label: '1인 가구', value: '1인 가구' },
      { id: 'family_2', label: '2인 가구', value: '2인 가구' },
      { id: 'family_3', label: '3인 가구', value: '3인 가구' },
      { id: 'family_4', label: '4인 가구', value: '4인 가구' },
      { id: 'family_5_more', label: '5인 이상 가구', value: '5인 이상 가구' },
      { id: 'other', label: '직접 입력', value: 'other', isOther: true },
    ],
    showIncomeTable: false
  },
  {
    id: 'income',
    message: 'ℹ️ 입력하신 정보는 자가진단 목적으로만 활용되며 저장되지 않습니다.\n5. 가구 소득\n주민등록등본상의 가구원 수와 가구의 월평균 총소득을 입력해주세요.',
    choices: [
      { id: 'income_1', label: '가구 중위 60% 이하 (표 참고)', value: '가구 중위소득 60% 이하' },
      { id: 'income_2', label: '가구 중위 100% 이하 (표 참고)', value: '가구 중위소득 100% 이하' },
      { id: 'income_120', label: '가구 중위 120% 이하 (청년-표 참고)', value: '가구 중위소득 120% 이하' },
      { id: 'other', label: '직접 입력', value: 'other', isOther: true },
    ],
    showIncomeTable: true
  },
  {
    id: 'property',
    message: 'ℹ️ 입력하신 정보는 자가진단 목적으로만 활용되며 저장되지 않습니다.\n6. 가구 재산\n가구의 총 재산(건축물, 토지, 전월세보증금 등 합산액)은 어느 정도인가요?',
    choices: [
      { id: 'prop_under_4', label: '4억 원 이하', value: '재산 4억 원 이하' },
      { id: 'prop_under_5', label: '4억 초과 ~ 5억 이하', value: '재산 4억 원 초과 5억 원 이하' },
      { id: 'prop_over_5', label: '5억 원 초과', value: '재산 5억 원 초과' },
    ],
    showIncomeTable: false
  },
  {
    id: 'experience',
    message: '7. 취업 경험\n신청일 기준 최근 2년(24개월) 이내에 100일 또는 800시간 이상 근로한 경험이 있으신가요?',
    choices: [
      { id: 'exp_yes', label: '있다 (100일 이상 근로)', value: '최근 2년내 100일 이상 취업' },
      { id: 'exp_no_some', label: '있다 (100일 미만 근로)', value: '최근 2년내 100일 미만 소수 취업' },
      { id: 'exp_none', label: '거의 없다 (30일 미만 등)', value: '최근 2년내 취업경험 거의 없음' },
    ],
    showIncomeTable: false
  }
];

export const DEFAULT_LOCATION_STEP_MESSAGE = {
  message: '📍 거의 다 왔습니다! 가까운 잡모아 지점을 안내해 드리기 위해 거주 지역을 알려주세요.',
  phase: 'location' as const,
};

export const DEFAULT_INTRO_MESSAGE = [
  {
    id: 'intro',
    message: '안녕하세요! 저는 국민취업지원제도 자가진단 AI입니다.\n약 3~5분의 간단한 질문으로\n내가 지원받을 수 있는 유형과 수당을 확인할 수 있습니다.\n\n⚠️ 이 진단은 자가진단 목적입니다.\n실제 결과는 고용센터 심사에 따라 달라질 수 있습니다.\n(* 입력하신 답변이 정확하지 않으면 유형 분류가 달라질 수 있습니다.)',
    choices: [
      { id: 'start', label: '✅ 네, 확인했습니다!', value: 'start' },
      { id: 'info', label: 'ℹ️ 국민취업지원제도란?', value: 'info' },
    ],
    phase: 'intro',
    currentStep: 0,
    totalSteps: 8,
    showIncomeTable: false
  }
];

export const DEFAULT_INFO_MESSAGE_CHOICES = [
  { id: 'start', label: '✅ 네, 시작하겠습니다!', value: 'start' },
];

export const DEFAULT_INFO_MESSAGE_TEXT = `[2026년 국민취업지원제도 안내]

국민취업지원제도는 근로 능력과 구직 의사가 있음에도 구조적, 마찰적 요인으로 인해 취업에 어려움을 겪는 국민에게 통합적인 맞춤형 취업지원서비스를 제공하고, 저소득층에게는 생계안정을 위한 구직촉진수당을 결합하여 지원하는 제도입니다. 

2026년 개편을 통해 물가 상승을 반영한 지원금 인상, 청년층 재산 요건 완화, 그리고 '고용24' 플랫폼으로의 일원화 등 혜택과 편의성이 대폭 강화되었습니다.
지원 대상은 참여자의 생애 주기 및 가구단위 소득·재산, 취업 경험에 따라 크게 Ⅰ유형과 Ⅱ유형으로 운영됩니다.

■ Ⅰ유형 (구직촉진수당 수급형)
1. 지원 대상 및 자격 요건
   - 요건심사형: 15~69세 구직자 중 가구단위 기준 중위소득 60% 이하, 재산 4억 원 이하이면서 최근 2년 내 100일 또는 800시간 이상의 취업 경험이 있는 자.
   - 선발형(비경제활동): 요건심사형 요건(소득 60% 이하, 재산 4억 원 이하)을 충족하나 취업 경험이 부족한 장기 실업자 및 경력단절 여성.
   - 선발형(청년특례): 15~34세(병역 의무 이행 시 최대 37세) 청년 중 기준 중위소득 120% 이하, 재산 5억 원 이하인 자 (취업 경험 무관하게 지원 가능하여 청년층 진입 장벽 대폭 완화).

2. 핵심 지원 내용
   - 구직촉진수당 인상: 2026년 1월 1일 이후 지급분부터 기존 월 50만 원에서 '월 60만 원'으로 대폭 인상되어 최대 6개월간(총 360만 원) 지급됩니다.
   - 가족수당 연계: 18세 이하 미성년 자녀, 70세 이상 고령자, 중증장애인 등 부양가족에 따라 수당이 가산되어 기본수당 합산 시 월 최대 100만 원까지 수령 가능합니다.
   - 유연한 소득 창출 허용: 수당 수급 중에도 월 약 113만 원 이하의 단기 아르바이트 등 근로 소득 창출이 합법적으로 허용되어, 구직 활동과 부분적 경제 활동의 병행이 가능합니다.

■ Ⅱ유형 (취업활동비용 지원형)
1. 지원 대상 및 자격 요건
   - 특정계층: 기초연금 수급자, 북한이탈주민, 결혼이민자, 영세자영업자 등 (소득·재산 및 취업경험 무관).
   - 청년: 15~34세(최대 37세) 미취업 청년 전원 (소득·재산 및 취업경험 무관하게 보편적 서비스 보장).
   - 중장년: 35~69세 구직자 중 가구단위 기준 중위소득 100% 이하인 자 (재산 및 취업경험 무관).

2. 핵심 지원 내용
   - IAP(개인별 취업활동계획) 수립 참여수당: 초기 상담을 통해 계획 수립 완료 시 기본 15만 원에서 최대 25만 원을 일시 지급합니다.[19]
   - 훈련참여수당 및 취업활동비용: 직업훈련 등 1~3단계 취업 지원 프로그램 과정 수료 시 참여 기간과 출석률에 비례하여 1인당 최대 265만 원까지 단계별 실비를 보전합니다.

■ 사후 보상 및 추가 지원 (공통 연계 기제)
- 취업성공수당: Ⅰ유형 전원 및 Ⅱ유형 저소득층이 주 30시간 이상 정규직 등으로 취업하여 6개월 동일 사업장 근속 시 50만 원, 12개월 연속 근속 시 100만 원(총 150만 원)을 지급하여 조기 퇴사를 방지합니다.
- 청년 빈일자리 특화수당: Ⅱ유형 청년이 1개월 이상 훈련 수료 후 제조업 등 인력난을 겪는 빈일자리 업종에 취업해 6개월 근속할 경우 최대 160만 원(훈련수당+취업성공수당 연계)을 지원합니다.
- 비수도권 취업장려금 연계: 청년이 비수도권 지역(일반/우대/특별 지역 분류) 소재 중소기업에 취업 시, 국가 균형 발전을 위해 청년 개인과 채용 기업에 각각 최대 720만 원의 파격적인 근속 인센티브가 차등 지급됩니다.

■ 필수 신청 절차 및 사후 관리 사항
- 고용24 통합: 2026년부터 모든 행정 절차 및 심사는 차세대 통합 플랫폼 '고용24(work24.go.kr)'로 완전히 일원화되었습니다. 
- 구직등록 및 교육: 본 신청 이전에 반드시 고용24 회원가입, 구직등록(이력서 등)을 완료하고, 온라인 사전 안내 동영상을 필수로 수강해야 합니다.
- 사후 관리 체계: 본인 또는 가구원의 중대한 질병 등 발생 시 최대 2년까지 취업지원을 유예할 수 있습니다.
  단, 취업 사실을 고의로 숨기거나 조작된 증빙을 제출하는 등 부정수급 적발 시에는 전액 환수 및 형사 고발 조치되며, 처분일로부터 향후 5년간 본 제도의 재참여가 엄격하게 박탈됩니다.`;

export const DEFAULT_INFO_MESSAGE = [
  {
    id: 'info',
    message: DEFAULT_INFO_MESSAGE_TEXT,
    choices: DEFAULT_INFO_MESSAGE_CHOICES,
    phase: 'info',
    currentStep: 1,
    totalSteps: 8,
    showIncomeTable: false
  }
];

export const DEFAULT_PDF_NESS_INFO = `[국민취업지원제도 자가진단 규정]

■ 공통 자격 요건
- 연령: 15세 이상 69세 이하 (취업을 원하는 자)
- 근로능력 보유 및 구직의사 있는 자
- 제외 대상: 현재 재학 중인 학생(졸업예정자 제외), 군 복무 중인 자, 교도소 수감자
- 고용보험 적용 사업장의 현직 근로자 제외 (단, 주당 소정근로 15시간 미만 제외)

■ 1유형 (요건심사형) 자격 요건
1) 연령: 15세~69세
2) 가구단위 중위소득 60% 이하
   - 1인 가구: 1,538,542원 이하 (2026년 기준)
   - 2인 가구: 2,519,575원 이하
   - 3인 가구: 3,215,421원 이하
   - 4인 가구: 3,896,842원 이하
   - 5인 가구: 4,534,031원 이하
   - ※ 청년(15~34세)의 경우 본인 소득 기준 적용 가능
3) 가구단위 재산 4억원 이하 (청년: 5억원 이하)
4) 취업경험 요건 (아래 중 1가지 해당):
   a) 최근 2년 이내 취업경험 100일 또는 800시간 이상
   b) 최근 2년 이내 취업경험 없음
   c) 폐업 후 1년이 경과하지 않은 자영업자
   d) 특수형태근로자(노무제공자)로서 소득이 중위소득 60% 이하
   e) 북한이탈주민, 위기청소년, 결혼이민자, 한부모가족 등 특정 계층

■ 1유형 (선발형) 자격 요건
1) 가구단위 재산 4억원 이하
2) 소득·취업경험 등 요건심사형 기준에는 미달하나 점수 기준 이상인 자
3) 선발형 점수 항목:
   - 취업경험 기간 (없을수록 높은 점수)
   - 가구소득 (낮을수록 높은 점수)
   - 가구원수 (많을수록 높은 점수)
   - 청년(15~34세) 여부
   - 장애인 여부
   - 취업취약계층 해당 여부

■ 2유형 자격 요건
1) 특정 계층: 중위소득 100% 이하 (결혼이민자, 위기청소년, 난민 등)
2) 청년 (15~34세): 중위소득 120% 이하, 취업경험과 관계없이 신청 가능
   - 단, 졸업 후 2년 이내인 경우도 포함
3) 중장년 (35~69세): 중위소득 100% 이하, 취업 취약계층
   - 경력단절여성, 저학력자, 장기 실업자, 자영업 폐업자 등

■ 참여 제한 대상
- 생계급여 수급자 (단, 조건부 수급자는 가능)
- 이미 국민취업지원제도에 참여 중인 자
- 국민기초생활보장법상 의료급여 수급자
- 외국인 (단, 결혼이민자, 영주권자, 난민 등 일부 예외)

■ 지원 내용
- 1유형: 구직촉진수당 월 50만원 × 최대 6개월 + 취업지원서비스
- 2유형: 취업활동비용 최대 195.4만원 + 취업지원서비스
- 공통: 직업훈련 연계, 일경험 프로그램, 복지서비스 연계

■ 2026년 기준 중위소득표 (월 소득 기준)
가구원수 | 중위소득 100% | 60% | 120%
1인: 2,564,238원 / 1,538,542원 / 3,077,085원
2인: 4,199,292원 / 2,519,575원 / 5,039,150원
3인: 5,359,036원 / 3,215,421원 / 6,430,843원
4인: 6,494,738원 / 3,896,842원 / 7,793,685원
5인: 7,556,719원 / 4,534,031원 / 9,068,062원
6인: 8,555,952원 / 5,133,571원 / 10,267,142원`;

export const DEFAULT_SYSTEM_PROMPT = `당신은 국민취업지원제도 유형 판별 전문 AI입니다.

아래 [규정 문서], [기준 중위소득표], [점수표]와 [사용자 수집 데이터]를 종합하여
해당 사용자의 참여 유형을 정확하게 판별합니다.

[규정 문서]
{{pdf_ness_info}}

[기준 중위소득표]
{{median_income_table}}

[선발형 점수표]
{{score_table}}

[사용자 수집 데이터]
{{userAnswers}}

[판별 로직 순서]
1. 참여 불가 요건 확인: (예: 15세 미만 70세 이상, 재학생, 수형자 등 명백한 배제 대상) -> 즉시 "제한"
2. 기본 자격 확인: 연령(15~69세), 근로능력, 구직 의사. **특히 군 복무 완료자의 경우 복무 기간만큼 청년 연령(만 34세)이 연장(최대 만 37세)될 수 있음을 고려하세요.**
3. 1유형(요건심사형) 충족 여부: 중위소득 60% 이하 + 재산 4억(청년 5억) 이하 + 2년 이내 취업경험 100일 이상
4. 1유형(선발형) 해당 여부: 요건 미달이나 소득 60%(청년 120%) 이하 + 재산 범위 충족 등 → 표에 맞춰 점수 계산
5. 2유형 해당 여부: 특정계층/청년(중위소득 무관 또는 120%)/중장년(100% 이하)
6. 지점 안내 커스터마이징: 사용자가 선택한 지역(sido, sigungu) 정보를 바탕으로, 해당 지역 인근에 관할 잡모아 지점이 있으니 상담을 받아보라는 내용을 "tips"나 "description"에 자연스럽게 포함하세요.
7. 결과 포맷 생성

※ 선발형의 경우 [선발형 점수표]를 바탕으로 소득, 재산, 취업경험 등의 각 항목당 산출 점수를 반드시 요약하여 주세요.
※ 가입이 불가능하거나 제한된 경우, 제한 사유를 상세하게 명시하고, 항목별 점수도 알 수 있다면 포함시켜주세요. (단, 무조건적인 불가 통보보다는 추가 확인이 필요하다는 뉘앙스 유지)

[출력 형식 - 반드시 JSON으로만 응답]
{
  "type": "1유형_요건심사형" | "1유형_선발형" | "2유형" | "제한",
  "score": 선발형점수(총합 숫자, 해당없으면 null),
  "scoreDetails": [
    "항목별 점수: 소득구간 (XX점)",
    "항목별 점수: 재산 (XX점)",
    "항목별 점수: 미취업기간 (XX점)"
  ],
  "description": "결과에 대한 상세 설명 (수당 정보, 2~3문장. 불가인 경우 사유 포함. 지역 정보를 기반으로 한 가까운 센터 방문 권유 포함)",
  "subType": "특정계층" | "청년" | "중장년" | null (2유형인 경우),
  "tips": [
    "점수 향상 추가팁",
    "추가 안내 사항 (불가인 경우: 자가 진단으로 가입이 가능할 수 있으니 관할 센터로의 문의를 추천)"
  ],
  "phase": "result",
  "restrictReason": "가입 불가능 사유 (제한인 경우 상세히 작성. 아니면 null)"
}`;

export type PromptCategoryType = 'text' | 'json' | 'json_list';

export interface PromptCategory {
  key: string;
  label: string;
  isFixed: boolean;
  type: PromptCategoryType;
}

export const DEFAULT_PROMPT_CATEGORIES: PromptCategory[] = [
  { key: 'system_prompt', label: '시스템 프롬프트', isFixed: true, type: 'text' },
  { key: 'pdf_ness_info', label: 'PDF 규정 내용', isFixed: true, type: 'text' },
  { key: 'static_questions', label: '질문 시나리오(JSON)', isFixed: true, type: 'json_list' },
  { key: 'intro_message', label: '인트로 메시지(JSON)', isFixed: true, type: 'json_list' },
  { key: 'info_message', label: '안내 메시지(JSON)', isFixed: true, type: 'json_list' },
  { key: 'median_income_table', label: '중위소득표', isFixed: false, type: 'text' },
  { key: 'score_table', label: '점수표', isFixed: false, type: 'text' }
];

// ====================================
// DB 연동 Getter 함수 모음
// ====================================

export function getPromptCategories(): PromptCategory[] {
  const val = getSetting('prompt_categories');
  try { return val ? JSON.parse(val) : DEFAULT_PROMPT_CATEGORIES; }
  catch (e) { return DEFAULT_PROMPT_CATEGORIES; }
}

export function getMedianIncomeTable(): string {
  const val = getSetting('median_income_table');
  return val || DEFAULT_MEDIAN_INCOME_TABLE;
}

export function getScoreTable(): string {
  const val = getSetting('score_table');
  return val || DEFAULT_SCORE_TABLE;
}

export function getStaticQuestions(): any[] {
  const val = getSetting('static_questions');
  try { return val ? JSON.parse(val) : DEFAULT_STATIC_QUESTIONS; }
  catch (e) { return DEFAULT_STATIC_QUESTIONS; }
}

export function getPdfNessInfo(): string {
  const val = getSetting('pdf_ness_info');
  return val || DEFAULT_PDF_NESS_INFO;
}

export function getLocationStepMessage(): any {
  return DEFAULT_LOCATION_STEP_MESSAGE;
}

export function getIntroMessage(): any {
  const val = getSetting('intro_message');
  try {
    if (val) {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed.length > 0 ? parsed[0] : parsed) : parsed;
    }
  } catch (e) {
    // parsing failed
  }
  return Array.isArray(DEFAULT_INTRO_MESSAGE) ? DEFAULT_INTRO_MESSAGE[0] : DEFAULT_INTRO_MESSAGE;
}

export function getInfoMessage(): any {
  const val = getSetting('info_message');
  try {
    if (val) {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed.length > 0 ? parsed[0] : parsed) : parsed;
    }
  } catch (e) {
    // parsing failed, fallback
  }

  // DB에 저장된 info_message가 없다면 DEFAULT_INFO_MESSAGE 반환
  return Array.isArray(DEFAULT_INFO_MESSAGE) ? DEFAULT_INFO_MESSAGE[0] : DEFAULT_INFO_MESSAGE;
}


// ====================================
// 최종 판별 분석 프롬프트
// ====================================

export function buildAnalysisPrompt(
  userAnswers: Record<string, string>,
  customSystemPrompt?: string | null
): string {
  let basePrompt = customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  // 1. 하드코딩된 필수 플레이스홀더 치환
  basePrompt = basePrompt.replace(/\{\{pdf_ness_info\}\}/g, getPdfNessInfo());
  basePrompt = basePrompt.replace(/\{\{median_income_table\}\}/g, getMedianIncomeTable());
  basePrompt = basePrompt.replace(/\{\{score_table\}\}/g, getScoreTable());
  basePrompt = basePrompt.replace(/\{\{userAnswers\}\}/g, JSON.stringify(userAnswers, null, 2));

  // 2. 관리자가 추가한 커스텀 변수({{키}}) 치환
  const categories = getPromptCategories();
  const customCats = categories.filter(c => !c.isFixed && c.type === 'text');

  for (const cat of customCats) {
    const dbValue = getSetting(cat.key);
    if (dbValue) {
      // {{key}} 매칭
      const regex = new RegExp(`\\{\\{${cat.key}\\}\\}`, 'g');
      basePrompt = basePrompt.replace(regex, dbValue);
    }
  }

  return basePrompt;
}
