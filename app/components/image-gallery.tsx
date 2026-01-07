'use client'
import React, { useState, useRef, useEffect } from 'react'
import { SmartImage } from '@/app/utils/image-helper'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right'>('right')
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([])
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null)

  // 選択された画像が変更された時に、対応するサムネイルをスクロールして表示
  useEffect(() => {
    const selectedThumbnail = thumbnailRefs.current[selectedImage]
    if (selectedThumbnail && thumbnailContainerRef.current) {
      selectedThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [selectedImage])

  const handlePrevious = () => {
    setDirection('left')
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))
      setIsTransitioning(false)
    }, 150)
  }

  const handleNext = () => {
    setDirection('right')
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))
      setIsTransitioning(false)
    }, 150)
  }

  const handleThumbnailClick = (index: number) => {
    setDirection(index > selectedImage ? 'right' : 'left')
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedImage(index)
      setIsTransitioning(false)
    }, 150)
  }

  return (
    <div className="lg:h-full h-[400px] md:h-[500px]">
      {/* Main Image Display with Navigation */}
      <div className="relative h-[60%] md:h-[70%] bg-gray-200 rounded-lg mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
        {images && images.length > 0 ? (
          <div className="relative w-full h-full">
            <SmartImage
              src={images[selectedImage]}
              alt={`Project image ${selectedImage + 1}`}
              fill
              className={`object-cover rounded-lg transition-all duration-300 ease-in-out ${
                isTransitioning
                  ? direction === 'right'
                    ? 'opacity-0 translate-x-4'
                    : 'opacity-0 -translate-x-4'
                  : 'opacity-100 translate-x-0'
              }`}
            />
          </div>
        ) : (
          // Placeholder for when there are no images
          <div className="text-gray-400 text-4xl md:text-6xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 md:w-24 md:h-24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        )}

        {/* Navigation Buttons */}
        {images && images.length > 0 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute cursor-pointer left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/90 hover:bg-black/80 shadow-lg hover:shadow-xl active:bg-black/80 text-white-800 font-extrabold rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-200 z-10 touch-manipulation group"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              className="absolute cursor-pointer right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/90 hover:bg-black/80 shadow-lg hover:shadow-xl active:bg-black/80 text-white-800 font-extrabold rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all duration-200 z-10 touch-manipulation group"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Slider */}
      {images && images.length > 0 && (
        <div
          ref={thumbnailContainerRef}
          className="flex overflow-x-auto w-full hide-scrollbar pb-1 snap-x snap-mandatory"
        >
          {images.map((image, index) => (
            <div
              key={index}
              ref={(el) => {
                thumbnailRefs.current[index] = el
              }}
              onClick={() => handleThumbnailClick(index)}
              className="shrink-0 w-1/3 md:w-1/4 h-20 md:h-36 cursor-pointer px-1 overflow-hidden snap-center touch-manipulation"
            >
              <button
                className={`border-2 rounded-lg w-full h-full ${
                  selectedImage === index ? 'border-[#FF0066] border-2' : 'border-gray-300'
                } transition-colors active:opacity-70`}
                aria-label={`View image ${index + 1}`}
              >
                <SmartImage
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery
