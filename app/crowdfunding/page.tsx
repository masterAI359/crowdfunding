"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProjectCard from '../components/project-card';
import { projects } from "@/app/data/projects";

import Image from 'next/image';

const CrowdfundingPage = () => {
  // Data for the scrolling banner projects
  const bannerProjects = [
    {
      id: 1,
      title: '鬼そば藤谷1日復活！',
      description: '「鬼そば藤谷１日復活！」秋田に住むHEY!たくちゃんのSPラーメンが１日限定で復活！',
      image: '/assets/crowdfunding/cf-4.png',
      amount: '¥2,000,000',
      achievementRate: '404%',
      supporters: '22人',
      daysLeft: '11日'
    },
    {
      id: 2,
      title: '「鬼そば藤谷１日復活！」秋田に住むHEY!たくちゃんのSPラーメンが１日限定で復活！',
      description: '事故物件サイト管理人・大島てるが語る本当にあった怖い話。',
      image: '/assets/crowdfunding/cf-5.png',
      amount: '¥1,500,000',
      achievementRate: '250%',
      supporters: '45人',
      daysLeft: '5日'
    },
    {
      id: 3,
      title: '「鬼そば藤谷１日復活！」秋田に住むHEY!たくちゃんのSPラーメンが１日限定で復活！',
      description: '名俳優が新境地に挑む！感動のヒューマンドラマ。',
      image: '/assets/crowdfunding/cf-3.png',
      amount: '¥3,200,000',
      achievementRate: '120%',
      supporters: '32人',
      daysLeft: '18日'
    },
    {
      id: 4,
      title: '「鬼そば藤谷１日復活！」秋田に住むHEY!たくちゃんのSPラーメンが１日限定で復活！',
      description: '名俳優が新境地に挑む！感動のヒューマンドラマ。',
      image: '/assets/crowdfunding/cf-2.png',
      amount: '¥3,200,000',
      achievementRate: '1220%',
      supporters: '32人',
      daysLeft: '18日'
    },
    {
      id: 5,
      title: '「鬼そば藤谷１日復活！」秋田に住むHEY!たくちゃんのSPラーメンが１日限定で復活！',
      description: '名俳優が新境地に挑む！感動のヒューマンドラマ。',
      image: '/assets/crowdfunding/cf-1.png',
      amount: '¥3,200,000',
      achievementRate: '1203%',
      supporters: '32人',
      daysLeft: '18日'
    }
  ];

  // Create a padded list for the infinite loop effect
  const loopedProjects = useMemo(() => {
    if (bannerProjects.length > 0) {
      const firstItem = bannerProjects[0];
      const lastItem = bannerProjects[bannerProjects.length - 1];
      return [lastItem, ...bannerProjects, firstItem];
    }
    return [];
  }, [bannerProjects]);

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
      const targetScrollLeft = targetNode.offsetLeft - containerHalfWidth + elementHalfWidth;
      
      // Perform the scroll
      container.scrollTo({
        left: targetScrollLeft,
        behavior: isTransitionEnabled ? 'smooth' : 'auto', // Use 'auto' for instant jumps
      });
    }

    // This function runs when the scroll transition ends
    const handleTransitionEnd = () => {
        if (currentIndex === 0) {
            // After scrolling to the cloned last item, jump to the real last item
            setIsTransitionEnabled(false); // Disable transitions for the silent jump
            setCurrentIndex(loopedProjects.length - 2);
        } else if (currentIndex === loopedProjects.length - 1) {
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

  }, [currentIndex, isTransitionEnabled, loopedProjects.length]);


  return (
    <div className="min-h-screen bg-white text-gray-700">
      
      <main className="xl:max-w-[1440px] mx-auto px-0  py-16 pt-20">
          {/* === UPDATED CAROUSEL WITH FOCUSED CENTER ITEM === */}
          <div className="relative w-full md:mb-16 mb-12">
            <div
              ref={scrollContainerRef}
              className="flex hide-scrollbar overflow-x-auto snap-x snap-mandatory scroll-smooth sm:px-6 px-4 md:px-10"
            >
              {loopedProjects.map((project, index) => {
                const isCenter = index === currentIndex;
                return (
                  <div
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    key={`${project.id}-${index}`}
                    className={`snap-center shrink-0 w-[90%] sm:w-[80%] md:w-[100%] lg:w-[85%] xl:w-[55%] p-2 ${
                      isTransitionEnabled
                        ? "transition-all duration-500 ease-in-out"
                        : ""
                    } ${isCenter ? "scale-100 opacity-100" : "scale-100 brightness-50"}`}
                  >
                    {/* Wrapper with responsive layout */}
                    <div className="relative w-full h-[28rem] sm:h-[32rem] md:h-[28rem] lg:h-[32rem] xl:h-[28rem] shadow-lg overflow-hidden flex flex-col md:block rounded-2xl md:rounded-2xl">
                      {/* === Image Section === */}
                      <div className="relative w-full h-1/2 md:h-full">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={isCenter}
                          className="object-cover"
                        />
                        
                        {!isCenter && (
                          <div className="absolute inset-0 bg-black/30 rounded-lg md:rounded-lg"></div>
                        )}
                      </div>

                      {/* === Info Section === */}
                      <>
                        {/* Small/Medium screens (stacked layout) */}
                        <div className="md:hidden w-full h-1/2 bg-[#262626] text-white flex flex-col">
                          {/* === Top Half (Title) === */}
                          <div className="flex-1 flex items-center justify-center px-4">
                            <p className="font-bold text-lg leading-snug text-center">
                              {project.title}
                            </p>
                          </div>

                          {/* Divider */}
                          <hr className="border-t border-white/30 mx-4" />

                          {/* === Bottom Half (Amount + Achievement Rate) === */}
                          <div className="flex-1 flex flex-col justify-evenly px-6 py-2">
                            {/* 調達金額 */}
                            <div className="flex items-baseline space-x-2 justify-start">
                              <p className="text-sm sm:text-base text-white">調達金額</p>
                              <p className="font-bold text-lg">{project.amount}</p>
                            </div>

                            {/* 達成率 */}
                            <div className="flex items-baseline space-x-2 justify-start">
                              <p className="text-sm sm:text-base text-white">達成率</p>
                              <p className="font-bold text-lg text-white">
                                {project.achievementRate}%
                              </p>
                            </div>
                          </div>
                        </div>


                        {/* Large screens (overlay style, original) */}
                        <div className={`${isCenter ? "hidden md:block absolute bottom-0 right-0 w-full md:w-[60%] p-0" : "hidden"}`}>
                          <div className="bg-black/85 text-white p-8 rounded-tl-2xl">
                            <p className="font-bold text-md lg:text-lg leading-tight">
                              {project.title}
                            </p>
                            <hr className="my-3 border-t border-white/30" />
                            <div className="flex flex-wrap items-center text-sm space-x-4 lg:space-x-6">
                              {/* 調達金額 */}
                              <div className="flex items-baseline space-x-2">
                                <p className="text-sm lg:text-base text-white">調達金額</p>
                                <p className="font-bold text-lg lg:text-xl">
                                  {project.amount}
                                </p>
                              </div>

                              {/* 達成率 */}
                              <div className="flex items-baseline space-x-2">
                                <p className="text-sm lg:text-base text-white">達成率</p>
                                <p className="font-bold text-lg lg:text-xl text-white">
                                  {project.achievementRate}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
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
        <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-md mx-auto gap-4 md:gap-y-8 mb-12  px-4 md:px-4  ">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-0">
          <button type="button" className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5" aria-label="Previous page">
            <svg width="10" height="10" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5307 19.6687L6.66191 12.7999H21.9995V9.59995H6.66191L13.5307 2.73115L11.2683 0.46875L0.537109 11.1999L11.2683 21.9312L13.5307 19.6687Z" fill="black"/>
            </svg>

          </button>
          
          {[1, 2, 3, 4, 5, 6, 7, 8].map(page => (
            <button 
              key={page}
              type="button"
              className={`h-8 w-8 flex items-center font-regular text-2xl justify-center rounded-full ${page === 1 
                ? 'bg-red-600 text-white border border-[#FF0066]' 
                : ' hover:bg-gray-100'}`}
              aria-label={`Page ${page}`}
            >
              {page}  
            </button>
          ))}
          
          <button type="button" className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors ml-5" aria-label="Next page">
            <svg width="10" height="12" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.26861 19.6687L11.531 21.9312L22.2622 11.1999L11.531 0.46875L9.26861 2.73115L16.1374 9.59995H0.799805V12.7999H16.1374L9.26861 19.6687Z" fill="black"/>
            </svg>

          </button>
        </div>
      </main>
      
    </div>
  );
};

export default CrowdfundingPage;