"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getCurrentUser, getPurchaseHistory } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/loading-spinner";

const MyMoviesPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, loading } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [purchaseData, setPurchaseData] = useState<any>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);

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
            const data = await getPurchaseHistory();
            setPurchaseData(data);
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
                                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
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
                            <div className="space-y-12">
                                {/* Purchased Returns Section */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">購入したリターン</h2>
                                    {returns.length === 0 ? (
                                        <p className="text-gray-500">購入したリターンはありません</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Featured Return Item */}
                                            {returns[0] && (
                                                <div className="flex gap-4 p-6 border border-gray-200 rounded-lg bg-white">
                                                    <div className="w-32 h-24 bg-gray-800 rounded flex-shrink-0">
                                                        {returns[0].projectThumbnail && (
                                                            <img
                                                                src={returns[0].projectThumbnail}
                                                                alt={returns[0].title}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {returns[0].projectTitle || "プロジェクト名"}
                                                        </p>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {returns[0].title || "伝説のバンド・ピンクサファイヤーが復活 1日だけの復活ライブ"}
                                                        </h3>
                                                        <p className="text-xl font-bold text-gray-900 mb-2">
                                                            The Last Message
                                                        </p>
                                                        <p className="text-sm text-gray-600 mb-1">ラストメッセージ</p>
                                                        <p className="text-sm text-gray-500">人生最後の暴露トーク</p>
                                                        <p className="text-lg font-semibold text-gray-900 mt-3">
                                                            ¥{returns[0].amount?.toLocaleString() || "5,000"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Return Items */}
                                            {returns.slice(1).map((item: any, index: number) => (
                                                <div
                                                    key={item.id || index}
                                                    className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                                                >
                                                    <div className="w-24 h-16 bg-gray-800 rounded flex-shrink-0">
                                                        {item.projectThumbnail && (
                                                            <img
                                                                src={item.projectThumbnail}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-700">[お礼のメッセージ動画]</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                ¥{item.amount?.toLocaleString() || "5,000"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Purchased Videos Section */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">購入した動画</h2>
                                    {videos.length === 0 ? (
                                        <p className="text-gray-500">購入した動画はありません</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {/* Featured Video Item */}
                                            {videos[0] && (
                                                <div className="flex gap-4 p-6 border border-gray-200 rounded-lg bg-white">
                                                    <div className="w-32 h-24 bg-gray-800 rounded flex-shrink-0 relative">
                                                        {videos[0].thumbnailUrl && (
                                                            <img
                                                                src={videos[0].thumbnailUrl}
                                                                alt={videos[0].title}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg
                                                                className="w-12 h-12 text-white opacity-80"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {videos[0].projectTitle || "プロジェクト名"}
                                                        </p>
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                            {videos[0].title || "伝説のバンド・ピンクサファイヤーが復活 1日だけの復活ライブ"}
                                                        </h3>
                                                        <p className="text-xl font-bold text-gray-900 mb-2">
                                                            The Last Message
                                                        </p>
                                                        <p className="text-sm text-gray-600 mb-1">ラストメッセージ</p>
                                                        <p className="text-sm text-gray-500">人生最後の暴露トーク</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional Video Items */}
                                            {videos.slice(1).map((video: any, index: number) => (
                                                <div
                                                    key={video.id || index}
                                                    className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                                                >
                                                    <div className="w-24 h-16 bg-gray-800 rounded flex-shrink-0 relative">
                                                        {video.thumbnailUrl && (
                                                            <img
                                                                src={video.thumbnailUrl}
                                                                alt={video.title}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <svg
                                                                className="w-8 h-8 text-white opacity-80"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-700">
                                                                伝説のバンド1日ライブ vol.0{index + 2}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                ¥{(video.price || video.amount || 500).toLocaleString()}
                                                            </p>
                                                        </div>
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

