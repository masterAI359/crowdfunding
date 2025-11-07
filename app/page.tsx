// app/page.tsx
import Link from "next/link";
import React from "react";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative flex mt-20 md:mt-[142px] justify-center overflow-hidden">
          {/* Hero Content */}
          <div className="z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Main Logo */}
            <div className="relative mb-8">
              <Image
                src="/assets/common/main-pc.png"
                width={800}
                height={231}
                alt="ツクルTV"
                className="hidden md:block"
              />
              <Image
                src="/assets/common/main-sp.png"
                width={806}
                height={572}
                alt="ツクルTV"
                className="md:hidden"
              />
            </div>

            {/* Tagline */}
            <div className="mb-20 -mt-10">
              <p className="text-lg sm:text-xl md:text-2xl text-white mb-2">
                クリエーターとファンでつくる
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 justify-center items-center mx-auto  sm:px-10">
              <Link
                href="/crowdfunding"
                className="w-full bg-[rgba(14,44,95,0.85)] border-2 border-[rgba(255,255,255,0.8)] text-white px-10 py-6 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                aria-label="クラファンサイトへ"
              >
                <p>クラファンサイトへ</p>
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8 4.92016C12 5.61298 12 7.34503 10.8 8.03785L2.7 12.7144C1.5 13.4072 0 12.5412 0 11.1555V1.80246C0 0.416823 1.5 -0.449199 2.7 0.243621L10.8 4.92016Z" fill="white" />
                </svg>
              </Link>
              <Link
                href="/videofunding"
                className="w-full bg-[rgba(255,0,102,0.85)] border-2 border-[rgba(255,255,255,0.8)] text-white px-10 py-6 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                aria-label="クラファンサイトへ"
              >
                <p>動画サイトへ</p>
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8 4.92016C12 5.61298 12 7.34503 10.8 8.03785L2.7 12.7144C1.5 13.4072 0 12.5412 0 11.1555V1.80246C0 0.416823 1.5 -0.449199 2.7 0.243621L10.8 4.92016Z" fill="white" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
