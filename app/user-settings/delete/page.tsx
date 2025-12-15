"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { getCurrentUser, deleteAccount } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/loading-spinner";

const DeleteAccountPage = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, loading, logout } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [password, setPassword] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
            return;
        }

        if (isAuthenticated) {
            loadUserData();
        }
    }, [isAuthenticated, loading, router]);

    const loadUserData = async () => {
        try {
            const data = await getCurrentUser();
            setUserData(data);
        } catch (error) {
            console.error("Failed to load user data:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (confirmText !== "削除") {
            setError("確認のため「削除」と入力してください");
            return;
        }

        if (!password) {
            setError("パスワードを入力してください");
            return;
        }

        if (!window.confirm("本当にアカウントを削除しますか？この操作は取り消せません。")) {
            return;
        }

        setIsLoading(true);

        try {
            await deleteAccount(password);
            alert("アカウントが削除されました");
            logout();
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "アカウントの削除に失敗しました");
        } finally {
            setIsLoading(false);
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
                        <div className="bg-white">
                            <h1 className="text-3xl font-bold text-gray-900 mb-8">アカウントを削除</h1>

                            <div className="max-w-2xl">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-red-900 mb-2">警告</h3>
                                    <p className="text-red-700 mb-4">
                                        アカウントを削除すると、以下のデータが永久に削除されます：
                                    </p>
                                    <ul className="list-disc list-inside text-red-700 space-y-1 mb-4">
                                        <li>プロフィール情報</li>
                                        <li>購入履歴</li>
                                        <li>お気に入り</li>
                                        <li>その他のアカウント関連データ</li>
                                    </ul>
                                    <p className="text-red-700 font-semibold">
                                        この操作は取り消せません。続行する場合は、パスワードを入力し、「削除」と入力してください。
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            パスワード
                                        </label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            確認のため「削除」と入力してください
                                        </label>
                                        <input
                                            type="text"
                                            value={confirmText}
                                            onChange={(e) => setConfirmText(e.target.value)}
                                            required
                                            placeholder="削除"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
                                            アカウントを削除
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountPage;

