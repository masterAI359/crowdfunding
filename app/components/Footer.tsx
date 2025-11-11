"use client";
// Footer.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className="bg-[#1D2635] text-gray-300">
      <div className="mx-auto md:hidden px-4 sm:px-6 lg:px-8 pt-12 pb-6 max-w-[1440px]">
        {/* Top Section: Logo + Links */}
        <div
          className="flex flex-col justify-center
         md:flex-row md:justify-between md:items-start gap-8"
        >
          {/* Brand / Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex flex-col justify-center items-center"
            >
              <Image
                src="/assets/common/logo_footer.png"
                width={210}
                height={60}
                alt=""
              />
            </Link>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-2  gap-6 md:gap-12">
            {/* Main Content Navigation */}
            <div className="flex flex-col space-y-3">
              <a href="/about" className="text-sm font-bold hover:text-white">
                つくるテレビとは
              </a>
              <Link href="/crowdfunding" className="text-sm font-bold hover:text-white">
                プロジェクト
              </Link>
              <Link href="/videofunding" className="text-sm font-bold hover:text-white">
                動画一覧
              </Link>
              <a href="/faq" className="text-sm font-bold hover:text-white">
                よくある質問
              </a>
              <a href="/user-settings" className="text-sm font-bold hover:text-white">
                ユーザー設定
              </a>
            </div>

            {/* Legal / Informational Links */}
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-sm font-bold hover:text-white">
                利用規約
              </a>
              <a href="#" className="text-sm font-bold hover:text-white">
                プライバシーポリシー
              </a>
              <a href="#" className="text-sm font-bold hover:text-white">
                特定商取引法に基づく表記
              </a>
              <a href="#" className="text-sm font-bold hover:text-white">
                運営会社
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-400 my-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-md text-[#D9D9D9]">© 2025 TsukuruTV.</p>
        </div>
      </div>
      <div className="hidden md:block mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 max-w-[1440px]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          <div className="flex-shrink-0 ">
            <Link href="/">
              <Image
                src="/assets/common/logo_footer.png"
                width={210}
                height={60}
                alt=""
              />
            </Link>
          </div>

          {/* Navigation Sections */}
          <div className="grid grid-cols-2 gap-6 md:gap-12">
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
              <a href="/faq" className="text-sm font-bold hover:text-white">
                よくある質問
              </a>
              <a href="/terms-of-service" className="text-sm font-bold hover:text-white">
                利用規約
              </a>
              <a href="/privacy-policy" className="text-sm font-bold hover:text-white">
                プライバシーポリシー
              </a>
              <a href="/terms-of-service" className="text-sm font-bold hover:text-white">
                特定商取引法に基づく表記
              </a>
              <a href="/contact" className="text-sm font-bold hover:text-white">
                運営会社
              </a>
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
  );
};

export default Footer;
