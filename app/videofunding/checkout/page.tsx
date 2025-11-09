"use client";
import React, { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  amount: string;
  supporters: string;
  daysLeft: string;
}

interface Reward {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  quantity: number;
}

const CheckoutPage = ({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<{ data?: string }>;
}) => {
  const searchParams = use(searchParamsPromise);
  const isLoggedIn = false;
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  let project: Project | null = null;
  let rewards: Reward[] = [];

  if (searchParams?.data) {
    try {
      const parsed = JSON.parse(decodeURIComponent(searchParams.data));
      project = parsed.project as Project;
      rewards = parsed.rewards as Reward[];
    } catch (err) {
      console.error("Failed to parse checkout data:", err);
    }
  }

  const handlePurchase = () => {
    console.log("Confirming checkout for project:", project);
    console.log("Rewards:", rewards);
    // router.push(`/crowdfunding/checkout/success`);
  };

  const handleContinueSupport = () => {
    console.log("Email:", email);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">
          エラー: プロジェクト情報が見つかりません。
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-24 lg:pt-28 text-black">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-0">
        {/* Progress Bar */}
        <div className="max-w-5xl mx-auto w-full my-6 sm:my-8">
          <div className="bg-[#D9D9D9] rounded-full h-6 sm:h-8 overflow-hidden relative">
            <div className="bg-[#FF0066] h-full w-1/3 flex items-center justify-start rounded-full pl-3 sm:pl-4">
              <span className="text-white font-semibold text-sm sm:text-md">
                ❶ 入力
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl max-w-5xl mx-auto font-bold text-center my-6 sm:my-8">
          リターンを確認してください
        </h1>

        {/* Project Info */}
        <div className="bg-[#ECEBD9] max-w-5xl mx-auto rounded-lg mb-6 sm:mb-8 flex flex-col md:flex-row overflow-hidden">
          {/* Left Image */}
          <div className="w-full md:w-1/3 relative h-[200px] sm:h-[230px] md:h-auto">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover h-full w-full"
            />
          </div>

          {/* Right Content */}
          <div className="w-full md:w-2/3 flex flex-col md:flex-row gap-0 p-2">
            {/* Title + Progress + Stats */}
            <div className="md:w-2/3 flex flex-col justify-between p-3 sm:p-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-2">
                {project.title}
              </h2>

              {/* Progress Bar */}
              <div className="w-full bg-white border border-black/20 rounded-full h-3 sm:h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-[#FF0066] to-[#FFA101] h-3 sm:h-4 rounded-full"
                  style={{ width: `50%` }}
                ></div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between gap-2 md:space-x-12">
                <div>
                  <p className="text-xs sm:text-sm text-black text-center">
                    調達金額
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    {project.amount}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-black text-center">
                    参加人数
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    {project.supporters}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-black text-center">
                    残り日数
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    {project.daysLeft}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="md:w-1/2 px-3 sm:px-4 text-left my-auto">
              <p className="text-sm sm:text-lg text-black">
                {project.description}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-10">
          <button
            onClick={handlePurchase}
            className="bg-white text-[#FF0066] border border-[#FF0066] cursor-pointer font-bold py-3 sm:py-4 px-12 sm:px-20 rounded-full text-md sm:text-lg hover:bg-[#FF0066] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            シリーズで購入する
          </button>
        </div>

        {/* Rewards Section */}
        <div className="max-w-5xl mx-auto space-y-6 mb-6 sm:mb-8">
          {rewards.map((reward, i) => i === 0 && (
            <div
              key={reward.id}
              className="bg-white border border-[#E9E9E9] rounded-lg"
            >
              <div className="bg-[#ECEBD9] px-3 sm:px-16 py-4 rounded-t-lg border-b border-gray-300 flex justify-between items-center">
                <h3 className="font-bold text-md sm:text-xl text-black">
                  {reward.title}
                </h3>
              </div>

              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-start">
                {/* Left: Price + Quantity */}
                <div className="flex flex-col space-y-3 sm:space-y-4 md:col-span-2">
                  <div className="flex items-center gap-3 sm:gap-4 md:ml-10">
                    <input
                      type="checkbox"
                      id={`reward-checkbox-${reward.id}`}
                      checked
                      readOnly
                      className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 rounded opacity-80 ml-4"
                    />
                    <label htmlFor={`reward-checkbox-${reward.id}`} className="text-2xl sm:text-3xl font-bold flex items-center gap-1">
                      {reward.price}
                      <span className="text-sm sm:text-base font-bold">円</span>
                    </label>
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-lg text-black leading-relaxed text-left md:mx-10">
                    {reward.description}
                  </p>
                </div>

                {/* Right: Reward Image */}
                <div className="relative bg-gray-200 w-full h-40 sm:h-50 overflow-hidden rounded-md">
                  <Image
                    src={reward.image}
                    alt={reward.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confirm Button */}
        <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-10">
          <button
            onClick={handlePurchase}
            className="bg-[#FF0066] text-white cursor-pointer font-bold py-3 sm:py-4 px-12 sm:px-20 rounded-full text-md sm:text-lg hover:bg-[#FF0066]/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            購入する
          </button>
        </div>
      </main>

      {/* ❻ Non-Registered User Flow - UPDATED STYLE & FEATURES */}

      {!isLoggedIn && (
        <div className="w-full bg-[#F5F7F9]">
          <div className="w-full max-w-3xl mx-auto  p-8 md:p-12">

            {/* Heading */}
            <h2 className="text-xl font-bold text-center mb-6">
              まだアカウントをお持ちでない方はこちら
            </h2>

            {/* Email + Continue Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="メールアドレスを入力してください"
                className="flex-grow p-3 border border-gray-300 bg-white  focus:outline-none focus:ring-2 focus:ring-[#FF0066] w-full sm:w-1/2 text-md"
              />
              <button
                onClick={handleContinueSupport}
                className="bg-[#FF0066] cursor-pointer text-white  py-3 px-6  hover:bg-[#FF0066]/80 transition-colors duration-300 text-md w-full sm:w-1/2 "
              >
                支援を続ける
              </button>
            </div>

            {/* Notes */}
            <p className="text-sm text-black mb-12 ">
              ※利用規約とプライバシーポリシーが適用されます。<br />
              事前にご確認の上、新規登録にお進みください。
            </p>

            {/* SNS Heading */}
            <h2 className="text-xl font-bold text-center mb-6">
              SNSアカウントで新規登録する
            </h2>

            {/* SNS Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* X */}
              <button className="bg-black text-white py-3 px-4  flex items-center hover:opacity-90 transition-opacity">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.9026 8.46857L19.348 0H17.5837L11.1189 7.35325L5.95545 0H0L7.8081 11.1193L0 20H1.76449L8.59159 12.2348L14.0445 20H20L11.9024 8.46857H11.9029H11.9026ZM9.48592 11.2173L8.69476 10.1102L2.40015 1.29961H5.11012L10.1901 8.40986L10.9812 9.51703L17.5845 18.7593H14.8745L9.48609 11.2175V11.217L9.48592 11.2173Z" fill="white" />
                </svg>
                <span className="ml-5 text-sm">Xで新規登録する</span>
              </button>

              {/* Facebook */}
              <button className="bg-[#1877F2] text-white py-3 px-4  flex items-center hover:opacity-90 transition-opacity">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1_4439)">
                    <rect width="26.1" height="26.1" transform="translate(0.449219 0.449219)" fill="#0866FF" />
                    <path d="M26.5492 13.4992C26.5492 6.29196 20.7065 0.449219 13.4992 0.449219C6.29196 0.449219 0.449219 6.29196 0.449219 13.4992C0.449219 19.6191 4.6628 24.7546 10.3469 26.165V17.4873H7.65595V13.4992H10.3469V11.7808C10.3469 7.3391 12.3571 5.28033 16.7179 5.28033C17.5447 5.28033 18.9713 5.44267 19.5549 5.60449V9.21934C19.247 9.18698 18.7119 9.1708 18.0474 9.1708C15.9077 9.1708 15.0809 9.98146 15.0809 12.0888V13.4992H19.3435L18.6112 17.4873H15.0809V26.4537C21.5427 25.6733 26.5497 20.1714 26.5497 13.4992H26.5492Z" fill="white" />
                    <path d="M18.6115 17.4882L19.3438 13.5001H15.0812V12.0897C15.0812 9.98238 15.908 9.17172 18.0477 9.17172C18.7122 9.17172 19.2473 9.1879 19.5552 9.22026V5.60541C18.9716 5.44307 17.545 5.28125 16.7182 5.28125C12.3574 5.28125 10.3472 7.34002 10.3472 11.7817V13.5001H7.65625V17.4882H10.3472V26.1659C11.3567 26.4165 12.4127 26.5501 13.4995 26.5501C14.0346 26.5501 14.5623 26.5173 15.0807 26.4546V17.4882H18.6109H18.6115Z" fill="#0866FF" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_4439">
                      <rect width="26.1" height="26.1" fill="white" transform="translate(0.449219 0.449219)" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="ml-5 text-sm">Facebookで新規登録する</span>
              </button>

              {/* Apple */}
              <button className="bg-black text-white py-3 px-4  flex items-center hover:opacity-90 transition-opacity">
                <svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1_4446)">
                    <rect width="19.3743" height="24.6582" transform="translate(0.3125 0.671875)" fill="black" />
                    <path d="M14.6593 1.28665C14.6593 4.14305 12.4556 6.46147 9.72979 6.48079C9.70689 6.2793 9.69531 6.07395 9.69531 5.86576C9.69507 3.00884 11.899 0.690684 14.6251 0.671875C14.6477 0.873364 14.6593 1.07872 14.6593 1.28665Z" fill="black" />
                    <path d="M14.6593 1.28665C14.6593 4.14305 12.4556 6.46147 9.72979 6.48079C9.70689 6.2793 9.69531 6.07395 9.69531 5.86576C9.69507 3.00884 11.899 0.690684 14.6251 0.671875C14.6477 0.873364 14.6593 1.07872 14.6593 1.28665Z" fill="white" />
                    <path d="M19.6868 18.6499C18.9963 20.8889 17.7658 22.8747 16.1558 24.4379C16.1361 24.4575 16.1164 24.4771 16.0959 24.4956C15.5522 25.0104 14.8307 25.324 14.0395 25.324C13.5662 25.324 13.118 25.2117 12.7178 25.0117C12.6506 24.9728 12.5829 24.9352 12.5139 24.8994C12.5137 24.8994 12.5132 24.8991 12.5129 24.8991C11.8498 24.5557 11.1031 24.3627 10.3131 24.3627C9.52315 24.3627 8.82649 24.5433 8.18008 24.8651C8.17934 24.8654 8.17909 24.8659 8.17835 24.8662C8.06458 24.9228 7.95303 24.9842 7.84419 25.0499C7.46126 25.2297 7.03647 25.3297 6.58952 25.3297C5.80594 25.3297 5.09057 25.0223 4.54857 24.5155C4.52345 24.4918 4.49858 24.4678 4.4737 24.4433C4.47247 24.4423 4.471 24.441 4.47026 24.44C1.91291 21.9567 0.3125 18.409 0.3125 14.4704C0.3125 13.2924 0.315209 12.1004 0.72473 11.0595C2.81617 5.74555 6.90103 6.56233 8.9442 7.62466C11.1654 8.77948 11.13 6.66797 14.4906 6.66797C16.1407 6.66797 18.1337 7.74756 19.0364 9.04384C17.3905 9.88948 16.2572 11.6609 16.2572 13.7093C16.2572 14.8512 16.6099 15.9071 17.2065 16.7646C17.8163 17.6401 18.6809 18.3087 19.6866 18.6501L19.6868 18.6499Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_4446">
                      <rect width="19.3743" height="24.6582" fill="white" transform="translate(0.3125 0.671875)" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="ml-5 text-sm">Appleで新規登録する</span>
              </button>

              {/* LINE */}
              <button className="bg-[#06C755] text-white py-3 px-4  flex items-center hover:opacity-90 transition-opacity">
                <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.2282 11.9204C27.2282 5.85474 21.1473 0.919922 13.6727 0.919922C6.19804 0.919922 0.117188 5.85474 0.117188 11.9204C0.117188 17.3583 4.9402 21.912 11.4543 22.7734C11.8952 22.8687 12.4962 23.0644 12.6486 23.4417C12.7858 23.7848 12.7376 24.3209 12.6931 24.6678C12.6931 24.6678 12.5343 25.6245 12.5 25.8278C12.4403 26.1708 12.2281 27.1682 13.674 26.5584C15.1211 25.9485 21.4802 21.9615 24.3237 18.6886C26.288 16.5337 27.2295 14.3484 27.2295 11.9204H27.2282Z" fill="white" />
                </svg>
                <span className="ml-5 text-sm">LINEで新規登録する</span>
              </button>

              {/* Google (Full width) */}
              <button className="bg-white border border-gray-300 text-gray-800 py-3 px-4  flex items-center hover:bg-gray-50 transition">
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_1_4465" maskUnits="userSpaceOnUse" x="0" y="0" width="23" height="23">
                    <path d="M22.9734 0.0253906H0.0234375V22.9754H22.9734V0.0253906Z" fill="white" />
                  </mask>
                  <g mask="url(#mask0_1_4465)">
                    <path d="M22.516 11.7645C22.516 10.9498 22.4472 10.1695 22.3095 9.41211H11.5V13.8529H17.6736C17.4096 15.2873 16.5949 16.5037 15.3786 17.3184V20.1986H19.085C21.2538 18.202 22.5045 15.2644 22.5045 11.7645H22.516Z" fill="#4285F4" />
                    <path d="M11.4969 22.9764C14.5952 22.9764 17.1885 21.9436 19.0934 20.1994L15.387 17.3192C14.3542 18.0077 13.0461 18.4093 11.4969 18.4093C8.51343 18.4093 5.97746 16.3897 5.07093 13.6816H1.23828V16.6537C3.13166 20.406 7.01021 22.9764 11.4969 22.9764Z" fill="#34A853" />
                    <path d="M5.07244 13.6802C4.84294 12.9917 4.71671 12.2573 4.71671 11.4999C4.71671 10.7426 4.84294 10.0082 5.07244 9.31968V6.34766H1.23979C0.459487 7.89678 0.0234375 9.65246 0.0234375 11.4999C0.0234375 13.3474 0.470962 15.1031 1.23979 16.6522L5.07244 13.6802Z" fill="#FBBC04" />
                    <path d="M11.4969 4.59272C13.1838 4.59272 14.6985 5.16647 15.8804 6.31397L19.1737 3.02065C17.1885 1.17317 14.5837 0.0371476 11.4969 0.0371476C7.01021 0.0256726 3.13166 2.59607 1.23828 6.3484L5.07093 9.32042C5.97746 6.61232 8.50196 4.59272 11.4969 4.59272Z" fill="#E94235" />
                  </g>
                </svg>

                <span className="ml-5 text-sm">Googleで新規登録する</span>
              </button>
            </div>

            {/* Footer Notes */}
            <div className="mt-6 text-sm text-black">
              <p>※利用者の許可なく外部サービスを利用されることはありません。</p>
              <p>※利用規約とプライバシーポリシーが適用されます。事前にご確認の上、新規登録にお進みください。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
