"use client";
import React, { useState, use, useRef } from "react";
import Image from "next/image";
import VideoCard from "@/app/components/video-card";
import { videos } from "@/app/data/projects";
import Link from "next/link";
import { Play, Heart } from "lucide-react";
const ProjectDetailPage = ({
  params: paramsPromise,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const params = use(paramsPromise);
  //scroll ref
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  //  Find the project by ID from your projects array
  const video = videos.find((p) => p.id.toString() === params.projectId);

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>プロジェクトが見つかりませんでした。</p>
      </div>
    );
  }

  // Dummy images for placeholder
  // const dummyImages = [
  //   "/assets/crowdfunding/cf-4.png",
  //   "/assets/crowdfunding/cf-3.png",
  //   "/assets/crowdfunding/cf-2.png",
  // ];

  const thumbnailVideos = [
    {
      id: 1,
      thumbnail: "/assets/videofunding/video-1.png",
    },
    {
      id: 2,
      thumbnail: "/assets/videofunding/video-1.png",
    },
    {
      id: 3,
      thumbnail: "/assets/videofunding/video-1.png",
    },
    {
      id: 4,
      thumbnail: "/assets/videofunding/video-1.png",
    },
  ];

  const returns = [
    {
      title: "エンドロールお名前掲載",
      price: "5,000円",
      description:
        "・同窓会実行委員より５年間のメッセージ\n・活動報告「印象式レベル」開催\n・運営・井上記二本書Ｐ３６\n・フェブムページト掲示ツグ\n・ココオ協議作タマロロ",
    },
    {
      title: "エンドロールお名前掲載",
      price: "5,000円",
      description:
        "・同窓会実行委員より５年間のメッセージ\n・活動報告「印象式レベル」開催\n・運営・井上記二本書Ｐ３６\n・フェブムページト掲示ツグ\n・ココオ協議作タマロロ",
    },
    {
      title: "エンドロールお名前掲載",
      price: "5,000円",
      description:
        "・同窓会実行委員より５年間のメッセージ\n・活動報告「印象式レベル」開催\n・運営・井上記二本書Ｐ３６\n・フェブムページト掲示ツグ\n・ココオ協議作タマロロ",
    },
  ];

  return (
    <div className="min-h-screen  bg-white text-gray-700 mx-auto  pt-21 ">
      <main className="max-w-[1440px] mx-auto">
        {/* Section 2: Media Gallery & Project Information */}
        <section className="container px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
            {/* Main Video */}
            <div>
              <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-black shadow-lg">
                <Image
                  src={video.image}
                  alt="The Last Message - 人生最後の暴露トーク"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110 shadow-xl">
                    <Play
                      className="ml-1 h-10 w-10 text-primary"
                      fill="currentColor"
                    />
                  </div>
                </div>
                <div className="absolute left-4 bottom-4">
                  <div className="rounded bg-[#FFD700] px-4 py-1.5 text-sm font-bold text-black shadow-md">
                    人生最後の暴露トーク
                  </div>
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {thumbnailVideos.map((video, index) => (
                  <button
                    key={index}
                    className="aspect-video overflow-hidden rounded border-2 border-muted transition-all hover:border-primary hover:scale-105"
                    aria-label="Previous banner"
                  >
                    <Image
                      src={video.thumbnail}
                      alt={`Scene ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">最新の動画</h3>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black shadow-md">
                  <Image
                    src={video.image}
                    alt="Latest video"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl">
                      <Play
                        className="ml-1 h-8 w-8 text-primary"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                  <div className="absolute left-4 bottom-4">
                    <div className="rounded bg-[#FFD700] px-4 py-1.5 text-sm font-bold text-black shadow-md">
                      人生一の爆笑トーク
                    </div>
                  </div>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  この文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミー
                </p>
                <div className="flex flex-col gap-3">
                  <button className="w-full rounded-full text-base font-bold shadow-md">
                    この動画を購入
                  </button>
                  <button className="self-center" aria-label="Previous banner">
                    <Heart className="h-6 w-6" />
                  </button>
                  <button className="w-full rounded-full text-base font-bold shadow-md">
                    このシリーズを購入
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 3: video Recommendations */}
        <section className="hidden md:block bg-[#ECEBD9] py-12">
          <div className="max-w-[1320px] mx-auto px-2 sm:px-6">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">
              このプロジェクトを見た人はこちらもチェックしています
            </h2>

            <div className="relative">
              <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto pb-4 hide-scrollbar"
              >
                {/* Repeat videos multiple times to simulate infinity */}
                {Array.from({ length: 20 }).map((_, loopIndex) =>
                  videos.map((video) => (
                    <div
                      key={`${video.id}-${loopIndex}`}
                      className="flex-shrink-0 w-75"
                    >
                      <VideoCard video={video} />
                    </div>
                  )),
                )}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={scrollLeft}
                className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#EB4040] hover:bg-red-900 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -ml-5"
                aria-label="Scroll left"
              >
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5996 2.19629L2.88761 9.94029L11.5996 17.6843"
                    stroke="white"
                    strokeWidth="2.904"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                onClick={scrollRight}
                className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#EB4040] hover:bg-red-900 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -mr-5"
                aria-label="Scroll right"
              >
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.40039 2.19629L11.1124 9.94029L2.40039 17.6843"
                    stroke="white"
                    strokeWidth="2.904"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: About the Creator & Rewards */}

        {/* Section 5 (for mobile screens only)  */}
        <section className="md:hidden ">
          {/* Project Grid Section */}
          <h2 className="text-2xl font-bold text-black mb-8 text-center px-4">
            「映画」で検索した結果1944件のプロジェクトが見つかりました。
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-lg mx-auto gap-4 md:gap-y-8 mb-12  px-4  ">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </section>

        {/* Section 6: only for mobile screens  */}
        <section>
          {/* Pagination */}
          <div className="flex md:hidden justify-center space-x-0 ">
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5 mb-10"
              aria-label="Previous page"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5307 19.6687L6.66191 12.7999H21.9995V9.59995H6.66191L13.5307 2.73115L11.2683 0.46875L0.537109 11.1999L11.2683 21.9312L13.5307 19.6687Z"
                  fill="black"
                />
              </svg>
            </button>

            {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
              <button
                key={page}
                className={`h-8 w-8 flex items-center font-regular text-2xl justify-center rounded-full ${
                  page === 1
                    ? "bg-red-600 text-white border border-[#FF0066]"
                    : " hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors ml-5"
              aria-label="Next page"
            >
              <svg
                width="10"
                height="12"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.26861 19.6687L11.531 21.9312L22.2622 11.1999L11.531 0.46875L9.26861 2.73115L16.1374 9.59995H0.799805V12.7999H16.1374L9.26861 19.6687Z"
                  fill="black"
                />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
