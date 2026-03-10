import { getBranchCount, getAdminCount, getSetting } from '@/lib/db';
import { Database, Users } from 'lucide-react';
import ApiTestCards from '@/components/admin/ApiTestCards';

export default async function AdminDashboardPage() {
    const branchCount = getBranchCount();
    const adminCount = getAdminCount();

    // API Key 연결 상태 확인
    const geminiKeyDB = getSetting('gemini_api_keys');
    let parsedGeminiKeys: string[] = [];
    if (geminiKeyDB) {
        try {
            parsedGeminiKeys = JSON.parse(geminiKeyDB);
        } catch (e) {
            // Ignore parse error
        }
    }
    const geminiKeyEnv = process.env.GEMINI_API_KEY;
    const geminiKey = (parsedGeminiKeys.length > 0 ? parsedGeminiKeys[0] : null) || geminiKeyEnv;
    const isGeminiConnected = !!geminiKey && geminiKey.trim() !== '';

    // 카카오맵 키는 DB 설정 또는 환경변수 확인
    const kakaoKeyDB = getSetting('kakao_map_api_keys');
    let parsedKakaoKeys: string[] = [];
    if (kakaoKeyDB) {
        try {
            parsedKakaoKeys = JSON.parse(kakaoKeyDB);
        } catch (e) {
            // Ignore parse error
        }
    }
    const kakaoKeyEnv = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    if (kakaoKeyEnv && parsedKakaoKeys.length === 0) {
        parsedKakaoKeys.push(kakaoKeyEnv);
    }
    const isKakaoConnected = parsedKakaoKeys.length > 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">NESS 관리자 페이지에 오신 것을 환영합니다!</h2>
                <p className="text-gray-600 mb-6 w-full max-w-2xl leading-relaxed">
                    좌측 메뉴를 통해 챗봇 관리에 필요한 다양한 설정들을 제어할 수 있습니다.<br />
                    아래에서 현재 시스템의 주요 통계 및 외부 API 연동 상태를 한눈에 확인할 수 있습니다.
                </p>

                <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4 border-b pb-2">시스템 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Dashboard Summary Cards */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-blue-800 font-medium whitespace-nowrap">등록된 지점 수</h3>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <Database size={20} className="text-blue-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{branchCount}개</p>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-green-800 font-medium whitespace-nowrap">관리자 수</h3>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <Users size={20} className="text-green-600" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{adminCount}명</p>
                    </div>


                    <ApiTestCards
                        initialGeminiStatus={isGeminiConnected}
                        initialKakaoStatus={isKakaoConnected}
                        geminiKey={geminiKey || null}
                        kakaoKeys={parsedKakaoKeys}
                    />
                </div>
            </div>
        </div>
    );
}
