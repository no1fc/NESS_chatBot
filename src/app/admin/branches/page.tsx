'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader2, X } from 'lucide-react';
import type { Branch } from '@/types/db';
import MapPreview from '@/components/admin/MapPreview';
import { logger } from '@/lib/logger';

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
        longitude: '',
        covered_regions: '[]'
    });

    const [coveredSido, setCoveredSido] = useState('');
    const [coveredSigungu, setCoveredSigungu] = useState('');

    const handleAddCoveredRegion = () => {
        if (!coveredSido || !coveredSigungu) return;
        const newRegion = `${coveredSido} ${coveredSigungu}`;

        let currentArray: string[] = [];
        try {
            currentArray = JSON.parse(formData.covered_regions || '[]');
        } catch(e) {}

        if (!currentArray.includes(newRegion)) {
            setFormData(prev => ({
                ...prev,
                covered_regions: JSON.stringify([...currentArray, newRegion])
            }));
        }
        setCoveredSigungu(''); // 시군구만 리셋
    };

    const handleRemoveCoveredRegion = (regionToRemove: string) => {
        let currentArray: string[] = [];
        try {
            currentArray = JSON.parse(formData.covered_regions || '[]');
        } catch(e) {}

        setFormData(prev => ({
            ...prev,
            covered_regions: JSON.stringify(currentArray.filter(r => r !== regionToRemove))
        }));
    };

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
            logger.error('Failed to fetch branches:', error);
            alert('지점 목록을 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (branch: Branch | null = null) => {
        setCoveredSido('');
        setCoveredSigungu('');
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
                longitude: branch.longitude ? branch.longitude.toString() : '',
                covered_regions: branch.covered_regions || '[]'
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
                longitude: '',
                covered_regions: '[]'
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
            logger.error('Save error:', error);
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
            logger.error('Delete error:', error);
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
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">지점 등록 관리</h1>
                    <p className="text-[var(--color-text-muted)] mt-1">잡모아 전국 지점 정보를 관리합니다.</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2.5 rounded-[4px] font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    신규 등록
                </button>
            </div>

            <div className="bg-[var(--color-bg-elevated)] rounded-[4px] border border-[var(--color-border)] overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="지점명 또는 지역 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none transition-all text-[var(--color-text)] bg-[var(--color-bg-elevated)]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] text-sm font-semibold border-b border-[var(--color-border)]">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">지역</th>
                                <th className="px-6 py-4">지점명</th>
                                <th className="px-6 py-4">연락처</th>
                                <th className="px-6 py-4">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin w-5 h-5 text-[var(--color-accent)]" />
                                            데이터를 불러오는 중...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedBranches.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)]">
                                        등록된 지점이 없거나 검색 결과가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                paginatedBranches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-[var(--color-bg)] transition-colors">
                                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">#{branch.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[var(--color-text)]">{branch.region_sido}</div>
                                            <div className="text-sm text-[var(--color-text-muted)]">{branch.region_sigungu}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-[var(--color-text)] border-b border-[var(--color-border)] pb-1 mb-1">
                                                {branch.branch_name}
                                            </div>
                                            <div className="text-xs text-[var(--color-text-muted)] truncate max-w-[200px]" title={branch.address}>{branch.address}</div>
                                            <div className="mt-1.5 flex gap-1">
                                                {branch.latitude && branch.longitude ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-medium bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20">
                                                        좌표 등록됨
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-medium bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20">
                                                        좌표 미등록
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">{branch.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleOpenModal(branch)}
                                                    className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors p-1"
                                                    title="수정"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch.id)}
                                                    className="text-[var(--color-danger)] hover:text-[var(--color-danger)] transition-colors p-1"
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
                <div className="flex justify-center items-center gap-2 p-4 bg-[var(--color-bg-elevated)] rounded-[4px] border border-[var(--color-border)]">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm font-medium border border-[var(--color-border-strong)] rounded-[4px] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)]"
                    >
                        이전
                    </button>
                    <span className="text-sm font-medium text-[var(--color-text-secondary)] px-4">
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm font-medium border border-[var(--color-border-strong)] rounded-[4px] hover:bg-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[var(--color-text-secondary)] bg-[var(--color-bg-elevated)]"
                    >
                        다음
                    </button>
                </div>
            )}

            {/* Modal / Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(15,0,0,0.5)] overflow-y-auto">
                    <div className="bg-[var(--color-bg-elevated)] rounded-[4px] w-full max-w-lg my-8 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-elevated)]">
                            <h2 className="text-xl font-bold text-[var(--color-text)]">
                                {editingBranch ? '지점 정보 수정' : '신규 지점 등록'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">시/도</label>
                                    <select
                                        required
                                        name="region_sido"
                                        value={formData.region_sido}
                                        onChange={(e) => setFormData(prev => ({ ...prev, region_sido: e.target.value, region_sigungu: '' }))}
                                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]"
                                    >
                                        <option value="" disabled>시/도 선택</option>
                                        {Object.keys(REGION_DATA).map(sido => (
                                            <option key={sido} value={sido}>{sido}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">시/군/구</label>
                                    <select
                                        required
                                        name="region_sigungu"
                                        value={formData.region_sigungu}
                                        onChange={handleInputChange}
                                        disabled={!formData.region_sido}
                                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)] disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-muted)]"
                                    >
                                        <option value="" disabled>시/군/구 선택</option>
                                        {formData.region_sido && REGION_DATA[formData.region_sido]?.map(sigungu => (
                                            <option key={sigungu} value={sigungu}>{sigungu}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">지점명</label>
                                <input required name="branch_name" value={formData.branch_name} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]" placeholder="예: 강남지점" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">주소</label>
                                <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]" placeholder="도로명 주소 입력" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">연락처</label>
                                <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]" placeholder="000-0000-0000" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">전용 상담 URL</label>
                                <input required name="specific_url" value={formData.specific_url} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]" placeholder="https://..." />
                            </div>

                            <div className="pt-2 border-t border-[var(--color-border)]">
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                    관할 지역 <span className="text-xs text-[var(--color-text-muted)] font-normal">(주소지와 다른 인근 지역 검색 시 매칭)</span>
                                </label>
                                <div className="space-y-3">
                                    <div className="flex gap-2 items-center">
                                        <select
                                            value={coveredSido}
                                            onChange={(e) => { setCoveredSido(e.target.value); setCoveredSigungu(''); }}
                                            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] bg-[var(--color-bg-elevated)]"
                                        >
                                            <option value="" disabled>시/도</option>
                                            {Object.keys(REGION_DATA).map(sido => (
                                                <option key={sido} value={sido}>{sido}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={coveredSigungu}
                                            onChange={(e) => setCoveredSigungu(e.target.value)}
                                            disabled={!coveredSido}
                                            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-sm text-[var(--color-text)] bg-[var(--color-bg-elevated)] disabled:bg-[var(--color-bg)] disabled:text-[var(--color-text-muted)]"
                                        >
                                            <option value="" disabled>시/군/구</option>
                                            {coveredSido && REGION_DATA[coveredSido]?.map(sigungu => (
                                                <option key={sigungu} value={sigungu}>{sigungu}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={handleAddCoveredRegion}
                                            disabled={!coveredSido || !coveredSigungu}
                                            className="px-4 py-2 bg-[var(--color-bg)] hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] rounded-[4px] text-sm font-medium shrink-0 disabled:opacity-50 transition-colors"
                                        >
                                            추가
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(() => {
                                            let regions: string[] = [];
                                            try { regions = JSON.parse(formData.covered_regions || '[]'); } catch(e) {}
                                            if (regions.length === 0) {
                                                return <span className="text-sm text-[var(--color-text-muted)]">등록된 관할 지역이 없습니다. 주로 동일 시/군/구나 인접 지역을 등록합니다.</span>;
                                            }
                                            return regions.map((region, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                                                    {region}
                                                    <button type="button" onClick={() => handleRemoveCoveredRegion(region)} className="hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-[4px] p-0.5 transition-colors focus:outline-none flex items-center justify-center">
                                                        <X size={12} />
                                                    </button>
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                                        위도 (Latitude) <span className="text-xs text-[var(--color-text-muted)] font-normal">선택</span>
                                    </label>
                                    <input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]" placeholder="예: 37.5665" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                                        경도 (Longitude) <span className="text-xs text-[var(--color-text-muted)] font-normal">선택</span>
                                    </label>
                                    <input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleInputChange} className="w-full px-3 py-2 border border-[var(--color-border)] rounded-[6px] focus:border-[var(--color-accent)] outline-none text-[var(--color-text)] bg-[var(--color-bg-elevated)]" placeholder="예: 126.9780" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                                    지도 미리보기
                                </label>
                                <MapPreview
                                    address={formData.address}
                                    latitude={formData.latitude}
                                    longitude={formData.longitude}
                                />
                                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                    * 좌표(위도, 경도)가 입력되어 있으면 좌표를 우선하여 표시하며, 그렇지 않으면 주소를 기반으로 지도를 그립니다.
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)] mt-6">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] rounded-[4px] font-medium transition-colors">
                                    취소
                                </button>
                                <button disabled={isSaving} type="submit" className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white rounded-[4px] font-medium transition-colors flex items-center min-w-[80px] justify-center disabled:opacity-70">
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
