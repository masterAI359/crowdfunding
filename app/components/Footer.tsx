import React from 'react'
import Link from 'next/link'
const Footer = () => {
  return (
    <footer className="bg-[#1D2635] text-gray-300">
      <div className="md:hidden px-6 sm:px-12 lg:px-8 pt-12 pb-6 md:max-w-[1440px] 2xl:max-w-[1920px]">
        {/* Top Section: Logo + Links */}
        <div
          className="flex flex-col lg:justify-center
         md:flex-row md:justify-between md:items-start gap-8"
        >
          {/* Brand / Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex flex-col justify-center items-center">
              <img
                src="/assets/common/logo-landing-footer-sp.png"
                className="w-[200px] sm:w-[347px] md:hidden"
                alt=""
              />
            </Link>
          </div>

          {/* Navigation Sections */}
          <div className="flex flex-row px-4 gap-6 sm:px-7 sm:gap-20 md:gap-12">
            {/* Main Content Navigation */}
            <div className="flex flex-col space-y-3">
              <Link href="/about" className="text-sm sm:text-xl font-bold hover:text-white">
                つくるテレビとは
              </Link>
              <Link href="/crowdfunding" className="text-sm sm:text-xl font-bold hover:text-white">
                プロジェクト
              </Link>
              <Link href="/videofunding" className="text-sm sm:text-xl font-bold hover:text-white">
                動画一覧
              </Link>
              <Link href="/faq" className="text-sm sm:text-xl font-bold hover:text-white">
                よくある質問
              </Link>
              <Link href="/user-settings" className="text-sm sm:text-xl font-bold hover:text-white">
                ユーザー設定
              </Link>
            </div>

            {/* Legal / Informational Links */}
            <div className="flex flex-col space-y-3">
              <Link
                href="/terms-of-service"
                className="text-sm sm:text-xl font-bold hover:text-white"
              >
                利用規約
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm sm:text-xl font-bold hover:text-white"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/commercial-tran"
                className="text-sm sm:text-xl font-bold hover:text-white"
              >
                特定商取引法に基づく表記
              </Link>
              <Link href="/contact" className="text-sm sm:text-xl font-bold hover:text-white">
                運営会社
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400 my-6"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-md text-[#D9D9D9]">© 2025 TsukuruTV.</p>
        </div>
      </div>
      <div className="hidden md:block mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 md:max-w-[1440px] 2xl:max-w-[1920px]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-shrink-0 ">
            <Link href="/">
              <img src="/assets/common/logo-landing-footer-pc.png" alt="" />
            </Link>
          </div>

          {/* Navigation Sections */}
          <div className=" grid grid-cols-2 gap-6 md:gap-0">
            {/* Main Content Navigation */}
            <div className="flex flex-col space-y-3">
              <Link href="/crowdfunding" className="text-sm font-bold hover:text-white">
                プロジェクト
              </Link>
              <Link href="/videofunding" className="text-sm font-bold hover:text-white">
                動画一覧
              </Link>
            </div>

            {/* Legal / Informational Links */}
            <div className="flex flex-col space-y-3">
              <Link href="/faq" className="text-sm font-bold hover:text-white">
                よくある質問
              </Link>
              <Link href="/terms-of-service" className="text-sm font-bold hover:text-white">
                利用規約
              </Link>
              <Link href="/privacy-policy" className="text-sm font-bold hover:text-white">
                プライバシーポリシー
              </Link>
              <Link href="/commercial-tran" className="text-sm font-bold hover:text-white">
                特定商取引法に基づく表記
              </Link>
              <Link href="/contact" className="text-sm font-bold hover:text-white">
                運営会社
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400 mt-8 mb-6"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-md text-[#D9D9D9]">© 2025 TsukuruTV.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
