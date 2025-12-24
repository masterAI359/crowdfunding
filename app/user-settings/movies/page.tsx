"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getCurrentUser } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/loading-spinner";
import apiClient from "@/app/lib/api";
import Image from "next/image";

interface PurchasedVideo {
    id: string;
    title: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    price: number;
    amount: number;
    purchaseDate: string;
    currency: string;
    owner: {
        id: string;
        name?: string;
    };
}

interface PurchasedReturn {
    id: string;
    title: string;
    amount: number;
    quantity: number;
    projectTitle: string;
    projectThumbnail: string;
    purchaseDate: string;
}

interface PurchaseHistory {
    returns: PurchasedReturn[];
    videos: PurchasedVideo[];
}

const MyMoviesPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, loading } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [purchaseData, setPurchaseData] = useState<PurchaseHistory>({ returns: [], videos: [] });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [activeTab, setActiveTab] = useState<'videos' | 'series' | 'history'>('videos');

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
            return;
        }

        if (isAuthenticated) {
            loadUserData();
            loadPurchaseData();
        }
    }, [isAuthenticated, loading]);

    const loadUserData = async () => {
        try {
            const data = await getCurrentUser();
            setUserData(data);
        } catch (error) {
            console.error("Failed to load user data:", error);
        }
    };

    const loadPurchaseData = async () => {
        setIsLoadingData(true);
        try {
            const response = await apiClient.get('/users/purchases/history');
            setPurchaseData(response.data);
        } catch (error: any) {
            console.error("Failed to load purchase data:", error);
            // If 404, set empty data instead of showing error
            if (error.response?.status === 404) {
                setPurchaseData({ returns: [], videos: [] });
            }
        } finally {
            setIsLoadingData(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatPrice = (amount: number, currency: string = 'jpy') => {
        if (currency.toLowerCase() === 'jpy') {
            return `¥${amount.toLocaleString()}`;
        }
        return `${amount.toLocaleString()} ${currency.toUpperCase()}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-500">読み込み中...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const menuItems = [
        { id: "my-movies", label: "マイムービー", href: "/user-settings/movies" },
        { id: "account-info", label: "アカウント情報", href: "/user-settings" },
        { id: "account-security", label: "アカウントセキュリティ", href: "/user-settings/security" },
        { id: "privacy-settings", label: "プライベート設定", href: "/user-settings/privacy" },
        { id: "delete-account", label: "アカウントを閉鎖", href: "/user-settings/delete" },
    ];

    const returns = purchaseData?.returns || [];
    const videos = purchaseData?.videos || [];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar Navigation */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            {/* User Profile Section */}
                            <div className="mb-6">
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 mx-auto relative">
                                    <span className="text-2xl text-gray-500">
                                        {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </span>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">{userData?.name || "user_name"}</p>
                                    <p className="text-sm text-gray-500">{userData?.email}</p>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                                ? "bg-[#FF0066] text-white"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {isLoadingData ? (
                            <div className="flex items-center justify-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-8">
                                {/* Purchased Returns Section */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">購入したリターン</h1>
                                    {returns.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-lg">
                                            <p className="text-gray-500 mb-4">購入したリターンはありません</p>
                                        </div>
                                    ) : (
                                        returns.map((item) => (
                                            <div key={item.id} className="mb-6">
                                                {/* Project Banner */}
                                                <div className="bg-[#ECEBD9] p-4 rounded-t-lg flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-700 font-medium">
                                                            {item.projectTitle}
                                                        </p>
                                                    </div>
                                                    <div className="w-24 h-16 bg-gray-300 rounded overflow-hidden flex-shrink-0">
                                                        {item.projectThumbnail && (
                                                            <Image
                                                                src={item.projectThumbnail}
                                                                alt={item.projectTitle}
                                                                width={96}
                                                                height={64}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Return Items */}
                                                <div className="bg-white border border-gray-200 rounded-b-lg">
                                                    {[...Array(item.quantity || 1)].map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0"
                                                        >
                                                            <div className="w-20 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {item.title}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    {formatPrice(item.amount)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Purchased Videos Section */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">購入した動画</h1>
                                    {videos.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-lg">
                                            <p className="text-gray-500 mb-4">購入した動画はありません</p>
                                            <Link
                                                href="/videofunding"
                                                className="inline-block bg-[#FF0066] text-white px-6 py-2 rounded-full hover:bg-[#FF0066]/80 transition-colors"
                                            >
                                                動画を探す
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Group videos by project if available */}
                                            {videos.map((video) => (
                                                <div key={video.id}>
                                                    {/* Project Banner */}
                                                    <div className="bg-[#ECEBD9] p-4 rounded-t-lg flex items-center gap-4">
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-700 font-medium">
                                                                伝説のバンド・ピンクサファイヤーが復活 1日だけの復活ライブ
                                                            </p>
                                                        </div>
                                                        <div className="w-24 h-16 bg-gray-300 rounded overflow-hidden flex-shrink-0">
                                                            {video.thumbnailUrl && (
                                                                <Image
                                                                    src={video.thumbnailUrl}
                                                                    alt={video.title}
                                                                    width={96}
                                                                    height={64}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Video Items */}
                                                    <div className="bg-white border border-gray-200 rounded-b-lg">
                                                        <Link href={`/user-settings/movies/watch/${video.id}`}>
                                                            <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                                                <div className="relative w-20 h-16 bg-gray-200 rounded flex-shrink-0">
                                                                    {video.thumbnailUrl ? (
                                                                        <Image
                                                                            src={video.thumbnailUrl}
                                                                            alt={video.title}
                                                                            width={80}
                                                                            height={64}
                                                                            className="object-cover w-full h-full rounded"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gray-200"></div>
                                                                    )}
                                                                    {/* Play icon */}
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                        <div className="w-8 h-8 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                                                                            <svg
                                                                                className="w-4 h-4 text-gray-800 ml-0.5"
                                                                                fill="currentColor"
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {video.title}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-bold text-gray-900">
                                                                        {formatPrice(video.amount, video.currency)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyMoviesPage;
