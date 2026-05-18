'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

declare global {
    interface Window {
        kakao: any;
    }
}

interface MapPreviewProps {
    address: string;
    latitude: string;
    longitude: string;
}

export default function MapPreview({ address, latitude, longitude }: MapPreviewProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [apiKeys, setApiKeys] = useState<string[]>([]);
    const [keyIndex, setKeyIndex] = useState<number>(0);

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const res = await fetch('/api/public/kakao-key');
                const data = await res.json();

                if (data.success && data.apiKeys) {
                    setApiKeys(data.apiKeys);
                } else if (data.success && data.apiKey) {
                    setApiKeys([data.apiKey]);
                }
            } catch (e) {
                logger.error("Failed to fetch Kakao Map API keys:", e);
            }
        };
        fetchApiKey();
    }, []);

    const activeApiKeys = apiKeys.length > 0 ? apiKeys : (process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ? [process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY] : []);
    const activeApiKey = activeApiKeys[keyIndex] || null;

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
                new window.kakao.maps.Marker({ map, position: coords });
            };

            if (latitude && longitude && !isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
                const coords = new window.kakao.maps.LatLng(Number(latitude), Number(longitude));
                renderMap(coords);
                return;
            }

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
        <div className="w-full h-48 bg-[var(--color-bg)] rounded-[4px] border border-[var(--color-border)] overflow-hidden relative">
            {activeApiKey ? (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${activeApiKey}&libraries=services&autoload=false`}
                        onLoad={() => setIsMapLoaded(true)}
                        onReady={() => setIsMapLoaded(true)}
                        onError={() => {
                            if (activeApiKeys.length > 0 && keyIndex < activeApiKeys.length - 1) {
                                logger.warn(`[Map Preview] Kakao Map API key ${keyIndex + 1} failed. Retrying with next key...`);
                                setKeyIndex(idx => idx + 1);
                            } else {
                                logger.error('카카오맵을 불러오는데 실패했습니다.');
                            }
                        }}
                    />
                    <div ref={mapRef} className="w-full h-full" />
                </>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-tertiary)] text-sm">
                    카카오맵 API 키가 설정되지 않았습니다.
                </div>
            )}

            {activeApiKey && !isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/80 z-10">
                    <Loader2 size={20} className="text-[var(--color-text-tertiary)] animate-spin mr-2" />
                    <span className="text-[var(--color-text-tertiary)] text-sm">지도 로딩 중...</span>
                </div>
            )}
            {isMapLoaded && !address && (!latitude || !longitude) && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg)]/80 text-[var(--color-text-tertiary)] text-sm z-10">
                    주소 또는 좌표를 입력하면 지도가 표시됩니다.
                </div>
            )}
        </div>
    );
}
