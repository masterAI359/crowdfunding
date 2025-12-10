"use client";
import React, { useEffect, useState } from "react";
import VideoCard from "../components/video-card";
import VideoCarousel from "../components/video-carousel";
import { getPublicVideos, getVideosByOwner } from "@/app/lib/api";

const VideofundingPage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [bannerVideos, setBannerVideos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        // Try to get videos - use owner/list if authenticated, otherwise we need a public endpoint
        let videosData;
        try {
          videosData = await getVideosByOwner(currentPage, 12);
        } catch {
          // If not authenticated, try public endpoint (may not exist yet)
          videosData = await getPublicVideos(currentPage, 12);
        }

        if (videosData?.videos) {
          const transformedVideos = videosData.videos.map((video: any) => ({
            id: video.id,
            title: video.title,
            image: video.thumbnailUrl || '/assets/crowdfunding/cf-1.png',
            categoryLabel: '動画', // You may want to add category to the backend
            userLabel: video.owner?.name || 'ユーザー',
            viewCount: video.viewCount ? `${Math.floor(video.viewCount / 10000)}万` : '0',
            viewDate: Math.floor((Date.now() - new Date(video.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          }));
          setVideos(transformedVideos);
          
          // Use first 5 videos for banner
          setBannerVideos(transformedVideos.slice(0, 5).map(v => ({
            id: v.id,
            image: v.image,
            categoryLabel: v.categoryLabel,
          })));
          
          setTotalPages(videosData.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-700 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-700">
      <main className="xl:max-w-[1440px] mx-auto px-0  py-16 pt-18">
        {bannerVideos.length > 0 && <VideoCarousel videos={bannerVideos} />}

        <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-md mx-auto gap-4 md:gap-y-8 mb-12 px-4 md:px-4  ">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p>動画が見つかりませんでした</p>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-0">
          <button
            type="button"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`h-8 w-8 flex items-center font-regular text-2xl justify-center rounded-full ${page === currentPage
                ? "bg-[#FF0066] text-white border border-[#FF0066]"
                : " hover:bg-gray-100"
                }`}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors ml-5 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default VideofundingPage;
