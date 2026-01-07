'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { SmartImage } from '@/app/utils/image-helper'

interface BannerProject {
  id: string
  title: string
  description?: string
  image: string
  amount: string
  achievementRate: number | string
  supporters: string
  daysLeft: string
}

interface ProjectCarouselProps {
  projects: BannerProject[]
  lightMode?: boolean
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ projects, lightMode = false }) => {
  // Create a padded list for the infinite loop effect
  const loopedProjects = useMemo(() => {
    if (projects.length > 0) {
      const firstItem = projects[0]
      const lastItem = projects[projects.length - 1]
      return [lastItem, ...projects, firstItem]
    }
    return []
  }, [projects])

  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const handlePrevBanner = () => {
    if (!isTransitionEnabled) return // Prevent clicks during the "jump" animation
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  const handleNextBanner = () => {
    if (!isTransitionEnabled) return // Prevent clicks during the "jump" animation
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  // This single, robust useEffect now handles both scrolling and the infinite loop logic.
  useEffect(() => {
    const container = scrollContainerRef.current
    const targetNode = itemRefs.current[currentIndex]

    if (container && targetNode) {
      const containerHalfWidth = container.offsetWidth / 2
      const elementHalfWidth = targetNode.offsetWidth / 2
      const targetScrollLeft = targetNode.offsetLeft - containerHalfWidth + elementHalfWidth

      // Perform the scroll
      container.scrollTo({
        left: targetScrollLeft,
        behavior: isTransitionEnabled ? 'smooth' : 'auto', // Use 'auto' for instant jumps
      })
    }

    // This function runs when the scroll transition ends
    const handleTransitionEnd = () => {
      if (currentIndex === 0) {
        // After scrolling to the cloned last item, jump to the real last item
        setIsTransitionEnabled(false) // Disable transitions for the silent jump
        setCurrentIndex(loopedProjects.length - 2)
      } else if (currentIndex === loopedProjects.length - 1) {
        // After scrolling to the cloned first item, jump to the real first item
        setIsTransitionEnabled(false) // Disable transitions for the silent jump
        setCurrentIndex(1)
      }
    }

    // Listen for the end of the scroll animation
    const scrollEndTimer = setTimeout(handleTransitionEnd, 500) // 500ms matches CSS duration

    // This effect runs right after the jump to re-enable transitions for the next user click
    if (!isTransitionEnabled) {
      requestAnimationFrame(() => {
        setIsTransitionEnabled(true)
      })
    }

    return () => clearTimeout(scrollEndTimer)
  }, [currentIndex, isTransitionEnabled, loopedProjects.length])

  return (
    <div className="relative w-full md:mb-16 mb-12">
      <div
        ref={scrollContainerRef}
        className="flex hide-scrollbar overflow-x-auto snap-x snap-mandatory scroll-smooth sm:px-6 px-4 md:px-10"
      >
        {loopedProjects.map((project, index) => {
          const isCenter = index === currentIndex
          return (
            <div
              ref={(el) => {
                itemRefs.current[index] = el
              }}
              key={`${project.id}-${index}`}
              className={`snap-center shrink-0 w-[90%] sm:w-[80%] md:w-[100%] lg:w-[85%] xl:w-[55%] p-2 ${
                isTransitionEnabled ? 'transition-all duration-500 ease-in-out' : ''
              } ${isCenter ? 'scale-100 opacity-100' : 'scale-100 brightness-50'}`}
            >
              {/* Wrapper with responsive layout */}
              <Link href={`/crowdfunding/${project.id}`} className="block">
                <div
                  className={`relative w-full shadow-lg overflow-hidden flex flex-col md:block rounded-2xl md:rounded-2xl cursor-pointer hover:shadow-xl transition-shadow ${lightMode ? 'h-[20rem]' : 'h-[28rem] sm:h-[32rem] md:h-[28rem] lg:h-[32rem] xl:h-[28rem]'}`}
                >
                {/* === Image Section === */}
                <div
                  className={`relative w-full ${lightMode ? 'h-2/3 md:h-full' : 'h-1/2 md:h-full'}`}
                >
                  <SmartImage
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
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
                  <div
                    className={`md:hidden w-full ${lightMode ? 'bg-white text-black h-1/3' : 'bg-[#262626] text-white h-1/2'} flex flex-col`}
                  >
                    {/* === Top Half (Title) === */}
                    <div className="flex-1 flex items-center justify-center px-4">
                      <p className="font-bold text-lg leading-snug text-center">{project.title}</p>
                    </div>

                    {/* Divider */}
                    <hr className="border-t border-white/30 mx-4" />

                    {/* === Bottom Half (Amount + Achievement Rate) === */}
                    {!lightMode && (
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
                            {typeof project.achievementRate === 'number'
                              ? `${project.achievementRate}%`
                              : project.achievementRate}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Large screens (overlay style, original) */}
                  <div
                    className={`${isCenter ? 'hidden md:block absolute bottom-0 right-0 w-full md:w-[60%] p-0' : 'hidden'}`}
                  >
                    <div className="bg-black/85 text-white p-8 rounded-tl-2xl">
                      <p className="font-bold text-md lg:text-lg leading-tight">{project.title}</p>
                      <hr className="my-3 border-t border-white/30" />
                      <div className="flex flex-wrap items-center text-sm space-x-4 lg:space-x-6">
                        {/* 調達金額 */}
                        <div className="flex items-baseline space-x-2">
                          <p className="text-sm lg:text-base text-white">調達金額</p>
                          <p className="font-bold text-lg lg:text-xl">{project.amount}</p>
                        </div>

                        {/* 達成率 */}
                        <div className="flex items-baseline space-x-2">
                          <p className="text-sm lg:text-base text-white">達成率</p>
                          <p className="font-bold text-lg lg:text-xl text-white">
                            {typeof project.achievementRate === 'number'
                              ? `${project.achievementRate}%`
                              : project.achievementRate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {/* Left Arrow */}
      <button
        type="button"
        onClick={handlePrevBanner}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-[#FF0066] hover:bg-[#FF0066]/80 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16  flex items-center justify-center z-20 transition-colors"
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
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-[#FF0066] hover:bg-[#FF0066]/80 text-white rounded-full w-12 h-12 sm:w-16 sm:h-16  flex items-center justify-center z-20 transition-colors"
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
  )
}

export default ProjectCarousel
