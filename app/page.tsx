// app/page.tsx
import Link from "next/link";
import React from "react";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="relative bg-[url('/assets/mainPage/main-page-bg1.png')] bg-cover bg-center min-h-screen bg-black">
      <div className="absolute inset-0 bg-[#24293b]/30 "></div>
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative flex mt-12 md:mt-[126px] justify-center overflow-hidden">
          {/* Hero Content */}
          <div className="z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Main Logo */}
            <div className="relative mb-8">
              <Image
                src="/assets/common/main-pc.png"
                width={1000}
                height={300}
                alt="ツクルTV"
                className="hidden md:block w-[840px] h-[256px]"
              />
              <Image
                src="/assets/common/main-sp.png"
                width={340}
                height={250}
                alt="ツクルTV"
                className="md:hidden w-[340px] h-[250px]"
              />
            </div>

            {/* Tagline */}
            <div className="mb-6 md:mb-20 -mt-10">
              <p className="text-md sm:text-xl md:text-2xl text-white mb-2 flex flex-col md:flex-row">
                <span className="block">クリエーターとファンでつくる</span>
                <span className="block">次世代テレビ</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 justify-center items-center mx-auto px-6 sm:px-10 font-semibold text-md">
              <Link
                href="/crowdfunding"
                className="w-full bg-[rgba(14,44,95,0.85)] border-2 border-[rgba(255,255,255,0.8)] text-white hover:bg-transparent hover:border-[rgba(14,44,95,0.85)] px-8 py-5 sm:px-16 sm:py-8 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
                aria-label="クラファンサイトへ"
              >
                <p>クラファンサイトへ</p>
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8 4.92016C12 5.61298 12 7.34503 10.8 8.03785L2.7 12.7144C1.5 13.4072 0 12.5412 0 11.1555V1.80246C0 0.416823 1.5 -0.449199 2.7 0.243621L10.8 4.92016Z" fill="white" />
                </svg>
              </Link>
              <Link
                href="/videofunding"
                className="w-full bg-[rgba(255,0,102,0.85)] border-2 border-[rgba(255,255,255,0.8)] text-white hover:bg-transparent hover:border-[rgba(255,0,102,0.85)] px-8 py-5 sm:px-16 sm:py-8 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
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
