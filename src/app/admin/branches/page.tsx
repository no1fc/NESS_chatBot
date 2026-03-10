'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react';
import type { Branch } from '@/lib/db';
import Script from 'next/script';

declare global {
    interface Window {
        kakao: any;
    }
}

const REGION_DATA: Record<string, string[]> = {
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '인천광역시': ['계양구', '미추홀구', '남동구', '동구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
    '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
    '대구광역시': ['남구', '달서구', '동구', '북구', '서구', '수성구', '중구', '달성군', '군위군'],
    '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
    '부산광역시': ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구', '기장군'],
    '울산광역시': ['남구', '동구', '북구', '중구', '울주군'],
    '세종특별자치시': ['세종특별자치시'],
    '경기도': ['수원시', '고양시', '용인시', '성남시', '부천시', '화성시', '안산시', '남양주시', '안양시', '평택시', '시흥시', '파주시', '의정부시', '김포시', '광주시', '광명시', '군포시', '하남시', '오산시', '양주시', '이천시', '구리시', '안성시', '포천시', '의왕시', '양평군', '여주시', '동두천시', '가평군', '과천시', '연천군'],
    '강원특별자치도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
    '충청북도': ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    '전북특별자치도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
    '제주특별자치도': ['제주시', '서귀포시']
};

export default function BranchesManagementPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        region_sido: '',
        region_sigungu: '',
        branch_name: '',
        address: '',
        phone: '',
        specific_url: '',
        latitude: '',
        longitude: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    // Load branches on mount
    useEffect(() => {
        fetchBranches();
    }, []);

    // 검색어 변경 시 1페이지로 리셋
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchBranches = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/branches');
            const data = await res.json();
            if (data.success) {
                setBranches(data.branches);
            }
        } catch (error) {
            console.error('Failed to fetch branches:', error);
            alert('지점 목록을 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (branch: Branch | null = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                region_sido: branch.region_sido,
                region_sigungu: branch.region_sigungu,
                branch_name: branch.branch_name,
                address: branch.address,
                phone: branch.phone,
                specific_url: branch.specific_url,
                latitude: branch.latitude ? branch.latitude.toString() : '',
                longitude: branch.longitude ? branch.longitude.toString() : ''
            });
        } else {
            setEditingBranch(null);
            setFormData({
                region_sido: '',
                region_sigungu: '',
                branch_name: '',
                address: '',
                phone: '',
                specific_url: '',
                latitude: '',
                longitude: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBranch(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const url = editingBranch
                ? `/api/admin/branches/${editingBranch.id}`
                : '/api/admin/branches';

            const method = editingBranch ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                await fetchBranches();
                closeModal();
            } else {
                alert(data.error || '저장 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('저장 중 네트워크 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('정말 이 지점을 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/admin/branches/${id}`, {
                method: 'DELETE'
            });

            const data = await res.json();
            if (data.success) {
                await fetchBranches();
            } else {
                alert(data.error || '삭제 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('삭제 중 네트워크 오류가 발생했습니다.');
        }
    };

    const filteredBranches = branches.filter(b =>
        b.branch_name.includes(searchQuery) ||
        b.region_sido.includes(searchQuery) ||
        b.region_sigungu.includes(searchQuery)
    );

    // 페이지네이션 로직
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.max(1, Math.ceil(filteredBranches.length / ITEMS_PER_PAGE));
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBranches = filteredBranches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">지점 등록 관리</h1>
                    <p className="text-gray-500 mt-1">잡모아 전국 지점 정보를 관리합니다.</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus size={18} />
                    신규 등록
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="지점명 또는 지역 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm font-semibold border-b border-gray-200">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">지역</th>
                                <th className="px-6 py-4">지점명</th>
                                <th className="px-6 py-4">연락처</th>
                                <th className="px-6 py-4">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin w-5 h-5 text-blue-600" />
                                            데이터를 불러오는 중...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedBranches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        등록된 지점이 없거나 검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                paginatedBranches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">#{branch.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{branch.region_sido}</div>
                                            <div className="text-sm text-gray-500">{branch.region_sigungu}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 border-b border-gray-100 pb-1 mb-1">
                                                {branch.branch_name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]" title={branch.address}>{branch.address}</div>
                                            <div className="mt-1.5 flex gap-1">
                                                {branch.latitude && branch.longitude ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-teal-100 text-teal-800 border border-teal-200">
                                                        좌표 등록됨
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 border border-red-200">
                                                        좌표 미등록
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{branch.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(branch)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                                    title="수정"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                                                    title="삭제"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 bg-white shadow-sm"
                    >
                        이전
                    </button>
                    <span className="text-sm font-medium text-gray-700 px-4">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 bg-white shadow-sm"
                    >
                        다음
                    </button>
                </div>
            )}

            {/* Modal / Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingBranch ? '지점 정보 수정' : '신규 지점 등록'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">시/도</label>
                                    <select
                                        required
                                        name="region_sido"
                                        value={formData.region_sido}
                                        onChange={(e) => setFormData(prev => ({ ...prev, region_sido: e.target.value, region_sigungu: '' }))}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                                    >
                                        <option value="" disabled>시/도 선택</option>
                                        {Object.keys(REGION_DATA).map(sido => (
                                            <option key={sido} value={sido}>{sido}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">시/군/구</label>
                                    <select
                                        required
                                        name="region_sigungu"
                                        value={formData.region_sigungu}
                                        onChange={handleInputChange}
                                        disabled={!formData.region_sido}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                    >
                                        <option value="" disabled>시/군/구 선택</option>
                                        {formData.region_sido && REGION_DATA[formData.region_sido]?.map(sigungu => (
                                            <option key={sigungu} value={sigungu}>{sigungu}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">지점명</label>
                                <input required name="branch_name" value={formData.branch_name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="예: 강남지점" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="도로명 주소 입력" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="000-0000-0000" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">전용 상담 URL</label>
                                <input required name="specific_url" value={formData.specific_url} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="https://..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        위도 (Latitude) <span className="text-xs text-gray-400 font-normal">선택</span>
                                    </label>
                                    <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="예: 37.5665" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        경도 (Longitude) <span className="text-xs text-gray-400 font-normal">선택</span>
                                    </label>
                                    <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white" placeholder="예: 126.9780" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    지도 미리보기
                                </label>
                                <MapPreview
                                    address={formData.address}
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    * 좌표(위도, 경도)가 입력되어 있으면 좌표를 우선하여 표시하며, 그렇지 않으면 주소를 기반으로 지도를 그립니다.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">
                                    취소
                                </button>
                                <button disabled={isSaving} type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center min-w-[80px] justify-center disabled:opacity-70">
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '저장'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function MapPreview({ address, latitude, longitude }: { address: string, latitude: string, longitude: string }) {
    const mapRef = React.useRef<HTMLDivElement>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [apiKeys, setApiKeys] = useState<string[]>([]);
    const [keyIndex, setKeyIndex] = useState<number>(0);

    // DB에서 카카오 API 키 가져오기
    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                // 클라이언트 사이드 지도 렌더링을 위해 사용할 평문 API Key 요청
                const res = await fetch('/api/public/kakao-key');
                const data = await res.json();

                if (data.success && data.apiKeys) {
                    setApiKeys(data.apiKeys);
                } else if (data.success && data.apiKey) {
                    setApiKeys([data.apiKey]);
                }
            } catch (e) {
                console.error("Failed to fetch Kakao Map API keys:", e);
            }
        };
        fetchApiKey();
    }, []);

    const activeApiKeys = apiKeys.length > 0 ? apiKeys : (process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ? [process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY] : []);
    const activeApiKey = activeApiKeys[keyIndex] || null;

    // 1) 이미 로드되어 있는 경우를 대비한 체크
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            setIsMapLoaded(true);
        }
    }, [activeApiKey]);

    useEffect(() => {
        if (!activeApiKey || !isMapLoaded || !window.kakao || !window.kakao.maps) return;

        window.kakao.maps.load(() => {
            if (!mapRef.current) return;

            const renderMap = (coords: any) => {
                const mapOption = { center: coords, level: 3 };
                const map = new window.kakao.maps.Map(mapRef.current, mapOption);

                new window.kakao.maps.Marker({
                    map: map,
                    position: coords
                });
            };

            // 위도/경도가 모두 유효한 숫자로 존재하면 최우선으로 그림
            if (latitude && longitude && !isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
                const coords = new window.kakao.maps.LatLng(Number(latitude), Number(longitude));
                renderMap(coords);
                return;
            }

            // 위경도가 없고 주소가 있으면 지오코딩 수행
            if (address && address.trim().length > 2) {
                const geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(address, function (result: any, status: any) {
                    if (status === window.kakao.maps.services.Status.OK) {
                        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                        renderMap(coords);
                    }
                });
            }
        });
    }, [activeApiKey, isMapLoaded, address, latitude, longitude]);

    return (
        <div className="w-full h-48 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden relative">
            {activeApiKey ? (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${activeApiKey}&libraries=services&autoload=false`}
                        onLoad={() => setIsMapLoaded(true)}
                        onReady={() => setIsMapLoaded(true)}
                        onError={() => {
                            if (activeApiKeys.length > 0 && keyIndex < activeApiKeys.length - 1) {
                                console.warn(`[Map Preview] Kakao Map API key ${keyIndex + 1} failed. Retrying with next key...`);
                                setKeyIndex(idx => idx + 1);
                            } else {
                                console.error('카카오맵을 불러오는데 실패했습니다.');
                            }
                        }}
                    />
                    <div ref={mapRef} className="w-full h-full" />
                </>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                    카카오맵 API 키가 설정되지 않았습니다. (.env.local 확인 혹은 시스템 설정 확인)
                </div>
            )}

            {/* 로딩 표시 또는 안내 문구 오버레이 */}
            {activeApiKey && !isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
                    <Loader2 size={20} className="text-gray-400 animate-spin mr-2" />
                    <span className="text-gray-500 text-sm">지도 로딩 중...</span>
                </div>
            )}
            {isMapLoaded && !address && (!latitude || !longitude) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 text-gray-500 text-sm z-10 backdrop-blur-sm">
                    주소 또는 좌표를 입력하면 지도가 표시됩니다.
                </div>
            )}
        </div>
    );
}

// X 아이콘은 별도로 임포트해야 하므로 파일 상단 import 에 X 를 추가. (루프백 에러 방지를 위해 간단한 SVG 폴백 또는 lucide import 추가)
function X({ size = 24, className = "" }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    );
}
