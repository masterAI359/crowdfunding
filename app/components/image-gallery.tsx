"use client";
import React, { useState } from 'react';
import { SmartImage } from '@/app/utils/image-helper';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="lg:h-full h-[800px]">
      {/* Main Image Display with Navigation */}
      <div className="relative h-[70%] bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        {images && images.length > 0 ? (
          <SmartImage
            src={images[selectedImage]}
            alt={`Project image ${selectedImage + 1}`}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          // Placeholder for when there are no images
          <div className="text-gray-400 text-6xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-24 h-24"
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
        {images && images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute cursor-pointer left-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black/50 text-white font-extrabold rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-black/50 text-white font-extrabold rounded-full w-10 h-10 flex items-center justify-center transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Slider */}
      {images && images.length > 0 && (
        <div className="flex overflow-x-auto w-full hide-scrollbar">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-1/3 h-36.5 cursor-pointer px-1 overflow-hidden`}
            >
              <button
                className={`border-2 rounded-lg w-full h-full ${selectedImage === index ? 'border-red-500' : 'border-gray-300'
                  }`}
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
  );
};

export default ImageGallery;

