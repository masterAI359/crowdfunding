"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import VideoCard from "../components/video-card";
import { videos } from "@/app/data/projects";
import Image from "next/image";

type CategoryType =
  | "バラエティー"
  | "スピリチュアル"
  | "ミュージック"
  | "ドキュメンタリー";

const categoryStyles: Record<CategoryType, string> = {
  バラエティー: "bg-[#06C755] text-white",
  スピリチュアル: "bg-[#FFA101] text-white",
  ミュージック: "bg-[#4285F4] text-white",
  ドキュメンタリー: "bg-[#A442F4] text-white",
};
const CrowdfundingPage = () => {
  // Data for the scrolling banner projects
  const bannerVideos = [
    {
      id: 1,
      image: "/assets/crowdfunding/cf-4.png",
      categoryLabel: "バラエティー",
    },
    {
      id: 2,
      image: "/assets/crowdfunding/cf-5.png",
      categoryLabel: "スピリチュアル",
    },
    {
      id: 3,
      image: "/assets/crowdfunding/cf-3.png",
      categoryLabel: "ドキュメンタリー",
    },
    {
      id: 4,
      image: "/assets/crowdfunding/cf-2.png",
      categoryLabel: "ミュージック",
    },
    {
      id: 5,
      image: "/assets/crowdfunding/cf-1.png",
      categoryLabel: "スピリチュアル",
    },
  ];
  // Create a padded list for the infinite loop effect
  const loopedVideos = useMemo(() => {
    if (bannerVideos.length > 0) {
      const firstItem = bannerVideos[0];
      const lastItem = bannerVideos[bannerVideos.length - 1];
      return [lastItem, ...bannerVideos, firstItem];
    }
    return [];
  }, [bannerVideos]);

  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePrevBanner = () => {
    if (!isTransitionEnabled) return; // Prevent clicks during the "jump" animation
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };

  const handleNextBanner = () => {
    if (!isTransitionEnabled) return; // Prevent clicks during the "jump" animation
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // This single, robust useEffect now handles both scrolling and the infinite loop logic.
  useEffect(() => {
    const container = scrollContainerRef.current;
    const targetNode = itemRefs.current[currentIndex];

    if (container && targetNode) {
      const containerHalfWidth = container.offsetWidth / 2;
      const elementHalfWidth = targetNode.offsetWidth / 2;
      const targetScrollLeft =
        targetNode.offsetLeft - containerHalfWidth + elementHalfWidth;

      // Perform the scroll
      container.scrollTo({
        left: targetScrollLeft,
        behavior: isTransitionEnabled ? "smooth" : "auto", // Use 'auto' for instant jumps
      });
    }

    // This function runs when the scroll transition ends
    const handleTransitionEnd = () => {
      if (currentIndex === 0) {
        // After scrolling to the cloned last item, jump to the real last item
        setIsTransitionEnabled(false); // Disable transitions for the silent jump
        setCurrentIndex(loopedVideos.length - 2);
      } else if (currentIndex === loopedVideos.length - 1) {
        // After scrolling to the cloned first item, jump to the real first item
        setIsTransitionEnabled(false); // Disable transitions for the silent jump
        setCurrentIndex(1);
      }
    };

    // Listen for the end of the scroll animation
    const scrollEndTimer = setTimeout(handleTransitionEnd, 500); // 500ms matches CSS duration

    // This effect runs right after the jump to re-enable transitions for the next user click
    if (!isTransitionEnabled) {
      requestAnimationFrame(() => {
        setIsTransitionEnabled(true);
      });
    }

    return () => clearTimeout(scrollEndTimer);
  }, [currentIndex, isTransitionEnabled, loopedVideos.length]);

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <main className="xl:max-w-[1440px] mx-auto px-0  py-16 pt-18">
        {/* === UPDATED CAROUSEL WITH FOCUSED CENTER ITEM === */}
        <div className="relative w-full md:mb-16 mb-12">
          <div
            ref={scrollContainerRef}
            className="flex hide-scrollbar overflow-x-auto snap-x snap-mandatory scroll-smooth sm:px-6 px-4 md:px-10"
          >
            {loopedVideos.map((video, index) => {
              const isCenter = index === currentIndex;
              return (
                <div
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  key={`${video.id}-${index}`}
                  className={`snap-center shrink-0 w-[90%] sm:w-[80%] md:w-[100%] lg:w-[85%] xl:w-[55%] p-2 ${
                    isTransitionEnabled
                      ? "transition-all duration-500 ease-in-out"
                      : ""
                  } ${
                    isCenter
                      ? "scale-100 opacity-100"
                      : "scale-100 brightness-50"
                  }`}
                >
                  {/* Wrapper with responsive layout */}
                  <div className="relative w-full h-[28rem] sm:h-[32rem] md:h-[28rem] lg:h-[32rem] xl:h-[28rem] shadow-lg overflow-hidden flex flex-col md:block rounded-2xl md:rounded-2xl">
                    {/* === Image Section === */}
                    <div className="relative w-full h-1/2 md:h-full">
                      <Image
                        src={video.image}
                        alt={video.categoryLabel}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={isCenter}
                        className="object-cover"
                      />
                      <span
                        className={`absolute top-0 right-0 rounded-tr-2.5 rounded-bl-[5px] px-1.5 py-0.5 text-base ${
                          categoryStyles[video.categoryLabel as CategoryType]
                        }`}
                      >
                        {video.categoryLabel}
                      </span>
                      {!isCenter && (
                        <div className="absolute inset-0 bg-black/30 rounded-lg md:rounded-lg"></div>
                      )}
                    </div>

                    {/* === Info Section === */}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={handlePrevBanner}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#FF0066] hover:bg-red-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16  flex items-center justify-center z-20 transition-colors"
            aria-label="Previous banner"
          >
            <svg
              width="18"
              height="26"
              viewBox="0 0 18 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5703 2.6875L3.67843 13.2581L15.5703 23.8286"
                stroke="white"
                strokeWidth="3.96396"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={handleNextBanner}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#FF0066] hover:bg-red-600 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16  flex items-center justify-center z-20 transition-colors"
            aria-label="Next banner"
          >
            <svg
              width="18"
              height="26"
              viewBox="0 0 18 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.16016 2.6875L14.052 13.2581L2.16016 23.8286"
                stroke="white"
                strokeWidth="3.96396"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {/* === END OF CAROUSEL SECTION === */}

        {/* Sorting & Filtering Bar
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-1 mb-4 md:mb-0 overflow-x-auto w-full md:w-auto">
            <span className="px-4 py-2 text-gray-500 whitespace-nowrap">並べ替え</span>
            <button className="px-4 py-2 text-red-600 border-b-2 border-red-600 font-medium whitespace-nowrap">人気順</button>
            <button className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">新着順</button>
            <button className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">終了日が近い順</button>
            <button className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">支援総額</button>
          </div>
          
          <div className="flex space-x-4">
            <button className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded transition-colors whitespace-nowrap">
              さらに絞り込む
            </button>
            <div className="hidden md:flex space-x-4">
              <button className="text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">マイページ</button>
              <button className="text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">気になる</button>
              <button className="text-gray-700 hover:text-red-600 transition-colors whitespace-nowrap">閲覧履歴</button>
            </div>
          </div>
        </div> */}

        {/* Project Grid Section */}
        <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-md mx-auto gap-4 md:gap-y-8 mb-12 px-4 md:px-4  ">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-center space-x-0">
          <button
            type="button"
            className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5"
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
              type="button"
              className={`h-8 w-8 flex items-center font-regular text-2xl justify-center rounded-full ${
                page === 1
                  ? "bg-red-600 text-white border border-[#FF0066]"
                  : " hover:bg-gray-100"
              }`}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
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
      </main>
    </div>
  );
};

export default CrowdfundingPage;
