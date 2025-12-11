"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setPassword } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import LoadingSpinner from "@/app/components/loading-spinner";

const SetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const email = searchParams?.get("email") || "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("メールアドレスが取得できませんでした");
            return;
        }

        if (password.length < 8) {
            setError("パスワードは8文字以上で入力してください");
            return;
        }

        if (password !== confirmPassword) {
            setError("パスワードが一致しません");
            return;
        }

        setIsLoading(true);

        try {
            // パスワードを設定
            await setPassword(email, password);
            // パスワード設定後、自動的にログイン
            const loginResult = await login(email, password);
            if (loginResult.success) {
                // ログイン成功後、トップページへリダイレクト
                window.location.href = "/crowdfunding";
                return;
            } else {
                setError(loginResult.error || "ログインに失敗しました");
                setIsLoading(false);
            }
        } catch (err: any) {
            setIsLoading(false);
            setError(err.response?.data?.message || "パスワード設定に失敗しました");
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-6 lg:px-8 pt-28">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        パスワード設定
                    </h2>
                    <p className="text-sm text-gray-600">
                        {email}
                    </p>
                </div>

                {/* Password Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Password Input */}
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-transparent transition-colors"
                                placeholder="パスワード"
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-transparent transition-colors"
                                placeholder="パスワード（確認）"
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
                            {isLoading ? "設定中..." : "ログイン"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SetPasswordPage = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">読み込み中...</p>
            </div>
        }>
            <SetPasswordForm />
        </Suspense>
    );
};

export default SetPasswordPage;

