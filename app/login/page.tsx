"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingSpinner from "@/app/components/loading-spinner";

const LoginPage = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                // ログイン成功後、ユーザーの権限に応じて適切なページへリダイレクト
                const user = result.data?.user;
                if (user?.isAdministrator) {
                    window.location.href = "/admin";
                } else if (user?.isSeller) {
                    window.location.href = "/seller/profile";
                } else {
                    window.location.href = "/user-settings";
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
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        ログイン
                    </h2>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-transparent transition-colors"
                                placeholder="メールアドレス"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-transparent transition-colors"
                                placeholder="ログイン"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="w-full px-6 sm:px-10">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-transparent hover:border-[#FF0066] text-base font-bold rounded-full text-white hover:text-[#FF0066] bg-[#FF0066] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF0066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading && <LoadingSpinner size="sm" className="text-white" />}
                            {isLoading ? "ログイン中..." : "メールアドレスで続行"}
                        </button>
                    </div>
                </form>

                {/* Other Login Options */}
                <div className="space-y-6">
                    {/* Section Title */}
                    <div className="text-center">
                        <h3 className="text-sm font-semibold text-gray-700">
                            その他のログインオプション
                        </h3>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex justify-center gap-4">
                        {/* Google Login */}
                        <button
                            type="button"
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/google`}
                            className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Googleでログイン"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        </button>

                        {/* Apple Login */}
                        <button
                            type="button"
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/apple`}
                            className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Appleでログイン"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                        </button>

                        {/* Facebook Login */}
                        <button
                            type="button"
                            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/auth/facebook`}
                            className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm"
                            aria-label="Facebookでログイン"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#1877F2" />
                                <path d="M13.5 12h2.5l-1-4h-2.5V7.5c0-.8.2-1.3 1.3-1.3H16V2.1c-.6-.1-1.3-.1-2-.1-2 0-3.4 1.2-3.4 3.4V8H7v4h2.6v8h3.4v-8h2.5z" fill="white" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Registration Button */}
                <div className="pt-4">
                    <Link
                        href="/signup"
                        className="w-full flex items-center justify-center py-4 px-4 rounded-full bg-black/10 hover:bg-gray-100 transition-colors text-center font-semibold"
                    >
                        <span className="text-sm text-gray-700">
                            初めての方ですか？{" "}
                            <span className="text-[#FF0066] font-medium">新規登録</span>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

