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
        <section className="relative flex mt-[142px] justify-center overflow-hidden">
          {/* Hero Content */}
          <div className="z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            {/* Main Logo */}
            <div className="relative mb-8">
              <Image
                src="/assets/common/main_pc.png"
                width={800}
                height={231}
                alt="ツクルTV"
                className="hidden md:block"
              />
              <Image
                src="/assets/common/main_sp.png"
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link
                href="/crowdfunding"
                className=" w-full sm:w-auto bg-[rgba(14,44,95,0.85)] border-2 border-[rgba(255,255,255,0.8)] text-white p-6 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <button
                  className="w-[263px] h-[42.5px]"
                  aria-label="クラファンサイトへ"
                >
                    クラファンサイトへ
                </button>
              </Link>
              <Link
                href="/videofunding"
                className="w-full sm:w-auto bg-[rgba(255,0,102,0.85)] border-2 border-[rgba(255,255,255,0.8)] text-white p-6 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <button
                  className="w-[263px] h-[42.5px]"
                  aria-label="クラファンサイトへ"
                >
                  <p>動画サイトへ</p>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
