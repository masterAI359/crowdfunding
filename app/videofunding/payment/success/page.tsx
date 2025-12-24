"use client";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyCheckoutSession, getVideoById } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/loading-spinner";

interface PaymentDetails {
  sessionId: string;
  paymentStatus: string;
  status: string;
  amountTotal: number;
  currency: string;
  customerEmail?: string;
  projectId?: string;
  videoId?: string;
  userId?: string;
  paymentIntentId?: string;
  projectTitle?: string;
  projectDescription?: string;
  projectImage?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

const PaymentSuccessPage = ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const router = useRouter();
  const searchParams = use(searchParamsPromise);
  const sessionId = searchParams?.session_id;
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError("セッションIDが見つかりません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const details = await verifyCheckoutSession(sessionId);
        setPaymentDetails(details);

        // プロジェクトまたは動画情報を取得
        // バックエンドから基本情報が返されている場合はそれを使用
        if (details.projectTitle || details.videoId || details.projectId) {
          try {
            // バックエンドから情報が返されている場合はそれを使用
            if (details.projectTitle) {
              setProject({
                id: details.videoId || details.projectId || '',
                title: details.projectTitle,
                description: details.projectDescription || '',
                image: details.projectImage || '/assets/videofunding/video-1.png',
              });
            } else {
              // フォールバック: APIから取得
              const contentId = details.videoId || details.projectId;
              if (contentId) {
                // まず動画として試す
                try {
                  const videoData = await getVideoById(contentId);
                  setProject({
                    id: videoData.id,
                    title: videoData.title,
                    description: videoData.description || '',
                    image: videoData.thumbnailUrl || videoData.url || '/assets/videofunding/video-1.png',
                  });
                } catch {
                  // 動画でない場合はプロジェクトとして試す
                  try {
                    const { getProjectById } = await import('@/app/lib/api');
                    const projectData = await getProjectById(contentId);
                    setProject({
                      id: projectData.id,
                      title: projectData.title,
                      description: projectData.description || '',
                      image: projectData.image || '/assets/crowdfunding/cf-1.png',
                    });
                  } catch (err) {
                    console.error("コンテンツ情報の取得に失敗しました:", err);
                  }
                }
              }
            }
          } catch (err) {
            console.error("コンテンツ情報の取得に失敗しました:", err);
          }
        }
      } catch (err: any) {
        console.error("セッションの検証に失敗しました:", err);
        setError(err.response?.data?.message || "決済情報の確認に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [sessionId]);

  const formatAmount = (amount: number, currency: string) => {
    // Stripe returns amounts in smallest currency unit
    // For JPY (Japanese Yen), there are no decimal places, so amount is already in yen
    // For other currencies (USD, EUR, etc.), divide by 100 to get the actual amount
    let amountToFormat = amount;
    if (currency !== 'jpy') {
      // For currencies with decimal places, divide by 100
      amountToFormat = amount / 100;
    }
    // JPY amounts are already in yen, no conversion needed
    const formattedAmount = amountToFormat.toLocaleString("ja-JP");
    return `¥${formattedAmount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black mb-4">
            エラーが発生しました
          </h1>
          <p className="text-gray-600 mb-8">{error || "決済情報が見つかりません"}</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/videofunding"
              className="px-6 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
            >
              動画一覧に戻る
            </Link>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#FF0066] text-white rounded-md hover:bg-[#E6005C] transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = paymentDetails.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          {isPaid ? (
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {isPaid ? "決済が完了しました" : "決済処理中です"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isPaid
              ? "ご支援ありがとうございます。決済が正常に完了しました。"
              : "決済が処理中です。しばらくお待ちください。"}
          </p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-black mb-6">決済情報</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">決済ステータス</span>
              <span
                className={`font-semibold ${
                  isPaid ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {isPaid ? "完了" : "処理中"}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <span className="text-gray-600">決済金額</span>
              <span className="font-bold text-black text-lg">
                {formatAmount(paymentDetails.amountTotal, paymentDetails.currency)}
              </span>
            </div>

            {paymentDetails.customerEmail && (
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600">メールアドレス</span>
                <span className="text-black">{paymentDetails.customerEmail}</span>
              </div>
            )}

            {project && (
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-gray-600">プロジェクト</span>
                <span className="text-black font-medium">{project.title}</span>
              </div>
            )}

            <div className="flex justify-between items-center pb-3">
              <span className="text-gray-600">セッションID</span>
              <span className="text-black text-sm font-mono">
                {paymentDetails.sessionId.substring(0, 20)}...
              </span>
            </div>
          </div>
        </div>

        {/* Project Preview (if available) */}
        {project && (
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-black mb-4">購入したコンテンツ</h3>
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={project.image || "/assets/videofunding/video-1.png"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-black mb-2">{project.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {project.description}
                </p>
                <Link
                  href={`/videofunding/${project.id}`}
                  className="text-[#FF0066] hover:underline text-sm mt-2 inline-block"
                >
                  プロジェクトを見る →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {project && (
            <Link
              href={`/videofunding/${project.id}`}
              className="flex-1 px-6 py-3 bg-[#FF0066] text-white rounded-md hover:bg-[#E6005C] transition-colors text-center font-semibold"
            >
              プロジェクトを見る
            </Link>
          )}
          <Link
            href="/videofunding"
            className="flex-1 px-6 py-3 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors text-center font-semibold"
          >
            動画一覧に戻る
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            決済に関するご質問がございましたら、お気軽にお問い合わせください。
          </p>
          {paymentDetails.customerEmail && (
            <p className="text-sm text-gray-500">
              確認メールを {paymentDetails.customerEmail} に送信しました。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

