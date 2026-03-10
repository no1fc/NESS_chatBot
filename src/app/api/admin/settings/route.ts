import { NextRequest, NextResponse } from 'next/server';
import { getAllSettings, getSetting, updateSetting } from '@/lib/db';
import { getPromptCategories } from '@/lib/prompts';

/**
 * GET: 모든 시스템 설정 조회
 * (보안을 위해 API 키 등 민감 정보는 일부 마스킹 처리하여 반환)
 */
export async function GET() {
    try {
        const settings = getAllSettings();
        const promptCategories = getPromptCategories();

        // DB에 저장되지 않은 설정들(Default 값)을 클라이언트에 제공
        promptCategories.forEach(cat => {
            if (!settings[cat.key] || settings[cat.key].trim() === '') {
                // 각 키에 해당하는 getter 함수들을 통해 기본값을 가져옴
                if (cat.key === 'system_prompt') settings[cat.key] = require('@/lib/prompts').DEFAULT_SYSTEM_PROMPT;
                else if (cat.key === 'pdf_ness_info') settings[cat.key] = require('@/lib/prompts').DEFAULT_PDF_NESS_INFO;
                else if (cat.key === 'median_income_table') settings[cat.key] = require('@/lib/prompts').DEFAULT_MEDIAN_INCOME_TABLE;
                else if (cat.key === 'score_table') settings[cat.key] = require('@/lib/prompts').DEFAULT_SCORE_TABLE;
                else if (cat.key === 'static_questions') settings[cat.key] = JSON.stringify(require('@/lib/prompts').getStaticQuestions());
                else if (cat.key === 'intro_message') settings[cat.key] = JSON.stringify([require('@/lib/prompts').getIntroMessage()]);
                else if (cat.key === 'info_message') settings[cat.key] = JSON.stringify([require('@/lib/prompts').getInfoMessage()]);
            }
        });

        // 단일 API 키 및 다중 배열 API 키 마스킹 범용 로직
        const maskIfNeeded = (val: string) => {
            if (val.length > 8) {
                return `${val.slice(0, 4)}••••••••••${val.slice(-4)}`;
            }
            return '••••';
        };

        const maskArrayOrString = (val: string) => {
            try {
                // 배열 형태의 JSON 문자열인 경우
                if (val.startsWith('[')) {
                    const arr = JSON.parse(val);
                    if (Array.isArray(arr)) {
                        return JSON.stringify(arr.map(k => maskIfNeeded(k)));
                    }
                }
            } catch (e) {
                // 파싱 실패시 기본 마스킹 로직으로 진행
            }
            return maskIfNeeded(val);
        };

        const targetApiKeys = ['gemini_api_key', 'kakao_map_api_key', 'gemini_api_keys', 'kakao_map_api_keys'];

        targetApiKeys.forEach(tKey => {
            if (settings[tKey]) {
                const originalValue = settings[tKey];
                settings[`${tKey}_masked`] = maskArrayOrString(originalValue);
                // 클라이언트에 원본 키 노출 방지
                settings[tKey] = '';
            }
        });

        return NextResponse.json({ success: true, settings, promptCategories });
    } catch (error) {
        console.error('Settings GET API 오류:', error);
        return NextResponse.json({ success: false, error: '설정 정보를 불러오는데 실패했습니다.' }, { status: 500 });
    }
}

/**
 * PUT: 시스템 설정 업데이트
 */
export async function PUT(req: NextRequest) {
    try {
        const data = await req.json(); // { key: string, value?: string, action?: 'add' | 'delete', index?: number }

        if (!data.key) {
            return NextResponse.json({ success: false, error: '키가 유효하지 않습니다.' }, { status: 400 });
        }

        // 다중 키 배열 액션 처리
        if (data.action) {
            let currentVal = getSetting(data.key) || "[]";
            let arr: string[] = [];
            try {
                arr = JSON.parse(currentVal);
                if (!Array.isArray(arr)) arr = [];
            } catch (e) {
                arr = [];
            }

            if (data.action === 'add' && data.value) {
                // 중복 추가 방지 (선택)
                if (!arr.includes(data.value)) {
                    arr.push(data.value);
                }
            } else if (data.action === 'delete' && typeof data.index === 'number') {
                if (data.index >= 0 && data.index < arr.length) {
                    arr.splice(data.index, 1);
                }
            }

            const newValue = JSON.stringify(arr);
            const result = updateSetting(data.key, newValue);

            if (result) {
                return NextResponse.json({ success: true, message: 'API 설정이 업데이트되었습니다.' });
            } else {
                return NextResponse.json({ success: false, error: '업데이트 중 오류가 발생했습니다.' }, { status: 500 });
            }
        }

        // 일반 단일 키 업데이트 (action이 없을 때)
        if (typeof data.value === 'string') {
            const result = updateSetting(data.key, data.value);
            if (result) {
                return NextResponse.json({ success: true, message: '설정이 업데이트되었습니다.' });
            } else {
                return NextResponse.json({ success: false, error: '업데이트 중 오류가 발생했습니다.' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: false, error: '잘못된 요청 파라미터입니다.' }, { status: 400 });

    } catch (error) {
        console.error('Settings PUT API 오류:', error);
        return NextResponse.json({ success: false, error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
