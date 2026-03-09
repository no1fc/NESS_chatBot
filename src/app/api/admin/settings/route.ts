import { NextRequest, NextResponse } from 'next/server';
import { getAllSettings, updateSetting } from '@/lib/db';
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

        // API 키 마스킹
        if (settings['gemini_api_key']) {
            const key = settings['gemini_api_key'];
            // 첫 6자리와 마지막 4자리만 노출
            if (key.length > 10) {
                const masked = `${key.slice(0, 6)}...${key.slice(-4)}`;
                settings['gemini_api_key_masked'] = masked; // 원본 말고 마스킹된 값을 별도로 제공하거나, 원본을 덮어씌움
                settings['gemini_api_key'] = ''; // 클라이언트에 원본 키 노출 방지
            }
        }

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
        const data = await req.json(); // { key: string, value: string } 형태 기대

        if (!data.key || typeof data.value !== 'string') {
            return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
        }

        // 빈 문자열인 경우 저장하지 않거나 등 특수 처리 가능
        // 빈 값이라도 명시적 저장을 원할 수 있으므로 그대로 처리

        // API 키를 변경할 때 빈 값으로 들어왔다면 기존걸 유지하거나 삭제하는 로직 필요
        // 여기서는 화면에서 빈 값으로 넘어오면 빈 문자열로 그대로 업데이트 시킵니다.

        const result = updateSetting(data.key, data.value);

        if (result) {
            return NextResponse.json({ success: true, message: '설정이 업데이트되었습니다.' });
        } else {
            return NextResponse.json({ success: false, error: '업데이트 중 오류가 발생했습니다.' }, { status: 500 });
        }

    } catch (error) {
        console.error('Settings PUT API 오류:', error);
        return NextResponse.json({ success: false, error: '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
