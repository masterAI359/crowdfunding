"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const VerifyEmailPage = () => {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendCountdown, setResendCountdown] = useState(0);
    const [email] = useState("sample@mail.com"); // This would come from context/query params in real app

    // Countdown timer for resend
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => {
                setResendCountdown(resendCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (code.length !== 6) {
            setError("6桁のコードを入力してください");
            return;
        }

        setIsLoading(true);

        // TODO: Implement actual verification logic here
        setTimeout(() => {
            setIsLoading(false);
            // Redirect or handle successful verification
            console.log("Verification attempt:", { code });
        }, 1000);
    };

    const handleResendCode = () => {
        if (resendCountdown > 0) return;

        // TODO: Implement resend code logic
        setResendCountdown(60); // 60 seconds countdown
        console.log("Resending code to:", email);
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
        if (value.length <= 6) {
            setCode(value);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center py-12 px-6 lg:px-8 pt-28">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        受信ボックスを確認
                    </h2>
                    <p className="text-md text-black leading-relaxed font-semibold">
                        登録を完了するには、{" "}
                        <span className="font-medium text-gray-900">{email}</span>{" "}
                        に送信された <br /> 6桁のコードを入力してください。
                    </p>
                </div>

                {/* Verification Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Code Input Field */}
                    <div className="relative">
                        <input
                            id="code"
                            name="code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            value={code}
                            onChange={handleCodeChange}
                            className="appearance-none relative block w-full px-4 py-3 text-left pr-12 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066] focus:border-transparent transition-colors text-lg tracking-widest"
                            placeholder="6桁のコード"
                        />
                        {/* Key Icon */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Image
                                src="/assets/common/key.png"
                                alt="Key icon"
                                width={25}
                                height={25}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="w-full px-6 sm:px-10">
                        <button
                            type="submit"
                            disabled={isLoading || code.length !== 6}
                            className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent hover:border-[#FF0066] text-lg font-bold rounded-full text-white hover:text-[#FF0066] bg-[#FF0066] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF0066] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "確認中..." : "新規登録"}
                        </button>
                    </div>
                </form>

                {/* Resend Code Link */}
                <div className="text-center">
                    <p className="text-md text-black leading-relaxed font-semibold">
                        コードを受け取っていませんか?{" "}
                        {resendCountdown > 0 ? (
                            <span className="text-gray-500">
                                コードを再送信{resendCountdown}
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendCode}
                                className="text-[#FF0066] hover:text-red-600 font-medium transition-colors underline"
                            >
                                コードを再送信
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;

