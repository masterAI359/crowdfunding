"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingSpinner from "@/app/components/loading-spinner";

const AdminLoginPage = () => {
    const router = useRouter();
    const { login, user, isAuthenticated, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in as admin, or clear session if regular user
    useEffect(() => {
        if (!loading) {
            if (isAuthenticated && user?.isAdministrator) {
                router.push("/admin");
            } else if (isAuthenticated && user && !user.isAdministrator) {
                // Regular user is logged in - clear their session and show error
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                }
                setError("管理者権限が必要です。管理者アカウントでログインしてください。");
            }
        }
    }, [loading, isAuthenticated, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                const loggedInUser = result.data?.user;
                // Check if user is an administrator
                if (loggedInUser?.isAdministrator) {
                    // Store remember me preference if needed
                    if (rememberMe) {
                        // Could store additional preference here
                    }
                    // Use window.location.href to force a full page reload
                    // This ensures the auth state is properly initialized
                    window.location.href = "/admin";
                    return;
                } else {
                    // Regular user trying to access admin portal
                    setError("管理者権限が必要です");
                    setIsLoading(false);
                    // Clear the login since they're not an admin
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('user');
                    }
                }
                return;
            } else {
                setError(result.error || "ログインに失敗しました");
                setIsLoading(false);
            }
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response?.data?.message || "ログインに失敗しました。もう一度お試しください。");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white rounded-lg shadow-md p-8 sm:p-10">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-black text-center mb-8">
                        管理画面ログイン
                    </h1>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-black"
                            >
                                Email address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors"
                                placeholder=""
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="block text-sm font-medium text-black"
                            >
                                Password *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors"
                                placeholder=""
                            />
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center gap-2">
                            <input
                                id="rememberMe"
                                name="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 border-gray-300 rounded text-gray-600 focus:ring-gray-400 focus:ring-2"
                            />
                            <label 
                                htmlFor="rememberMe" 
                                className="text-sm text-black cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Sign In Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading && <LoadingSpinner size="sm" className="text-white" />}
                                {isLoading ? "ログイン中..." : "サインイン"}
                            </button>
                        </div>
                    </form>

                    {/* Help Links */}
                    <div className="mt-6 space-y-2 text-center">
                        <div>
                            <a 
                                href="#" 
                                className="text-sm text-black hover:text-gray-600 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // TODO: Implement forgot password functionality
                                    alert("パスワードリセット機能は準備中です");
                                }}
                            >
                                パスワードを忘れましたか?
                            </a>
                        </div>
                        <div>
                            <a 
                                href="#" 
                                className="text-sm text-black hover:text-gray-600 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // TODO: Implement resend confirmation email functionality
                                    alert("確認メール再送信機能は準備中です");
                                }}
                            >
                                確認メールが届いていませんか?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;

