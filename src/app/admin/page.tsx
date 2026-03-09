import { getBranchCount, getAdminCount, getSetting } from '@/lib/db';
import { Database, Users, Cpu, Map as MapIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default async function AdminDashboardPage() {
    const branchCount = getBranchCount();
    const adminCount = getAdminCount();

    // API Key 연결 상태 확인
    const geminiKey = process.env.GEMINI_API_KEY;
    const isGeminiConnected = !!geminiKey && geminiKey.trim() !== '';

    // 카카오맵 키는 DB 설정 또는 환경변수 확인
    const kakaoKeyDB = getSetting('KAKAO_MAP_API_KEY');
    const kakaoKeyEnv = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
    const isKakaoConnected = !!(kakaoKeyDB || kakaoKeyEnv);

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

                    <div className={`border rounded-xl p-6 flex flex-col justify-between ${isGeminiConnected ? 'bg-purple-50 border-purple-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`${isGeminiConnected ? 'text-purple-800' : 'text-red-800'} font-medium`}>Gemini API</h3>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isGeminiConnected ? 'bg-purple-100 text-purple-600' : 'bg-red-100 text-red-600'}`}>
                                <Cpu size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isGeminiConnected ? (
                                <><CheckCircle2 size={24} className="text-purple-600" /><span className="text-2xl font-bold text-purple-600">연결됨</span></>
                            ) : (
                                <><AlertCircle size={24} className="text-red-600" /><span className="text-2xl font-bold text-red-600">확인 필요</span></>
                            )}
                        </div>
                    </div>

                    <div className={`border rounded-xl p-6 flex flex-col justify-between ${isKakaoConnected ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`${isKakaoConnected ? 'text-amber-800' : 'text-red-800'} font-medium`}>Kakao MAP API</h3>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isKakaoConnected ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                                <MapIcon size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isKakaoConnected ? (
                                <><CheckCircle2 size={24} className="text-amber-600" /><span className="text-2xl font-bold text-amber-600">연결됨</span></>
                            ) : (
                                <><AlertCircle size={24} className="text-red-600" /><span className="text-2xl font-bold text-red-600">확인 필요</span></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
