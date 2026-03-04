export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">NESS 관리자 페이지에 오신 것을 환영합니다!</h2>
                <p className="text-gray-600 mb-6 w-full max-w-2xl leading-relaxed">
                    좌측 메뉴를 통해 챗봇 관리에 필요한 다양한 설정들을 제어할 수 있습니다.<br />
                    (현재 Phase 1: 인증 및 레이아웃 단계이며, 향후 메뉴에 기능이 순차적으로 연결될 예정입니다.)
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {/* Dashboard Summary Cards - Placeholder */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h3 className="text-blue-800 font-medium mb-2">등록된 지점 수</h3>
                        <p className="text-3xl font-bold text-blue-600">- 개</p>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                        <h3 className="text-green-800 font-medium mb-2">관리자 수</h3>
                        <p className="text-3xl font-bold text-green-600">- 명</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                        <h3 className="text-purple-800 font-medium mb-2">API 연결 상태</h3>
                        <p className="text-2xl font-bold text-purple-600 flex items-center">
                            <span className="w-3 h-3 rounded-full bg-slate-300 mr-2"></span>
                            확인 필요
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
