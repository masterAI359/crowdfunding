"use client";
import React, { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Heart } from "lucide-react";
import ProjectCarousel from "@/app/components/project-carousel";
import VideoRecommendationsFlow from "@/app/components/video-recommendations-flow";
import { getVideoById, getVideos } from "@/app/lib/api";

interface Video {
  id: string | number;
  title: string;
  image: string;
  categoryLabel: string;
  userLabel: string;
  viewCount: string;
  viewDate: number;
  description?: string;
  url?: string;
}

const ProjectDetailPage = ({
  params: paramsPromise,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const params = use(paramsPromise);
  const [video, setVideo] = useState<any>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarPlaying, setIsSidebarPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sidebarVideoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleSidebarPlayClick = () => {
    setIsSidebarPlaying(true);
    if (sidebarVideoRef.current) {
      sidebarVideoRef.current.play();
    }
  };

  // 動画詳細を取得
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const data = await getVideoById(params.projectId);
        setVideo(data);
      } catch (error) {
        console.error("動画の取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.projectId]);

  // レコメンド動画を取得
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await getVideos(1, 20);
        const transformedVideos = (response.videos || [])
          .filter((v: any) => v.id !== params.projectId)
          .slice(0, 10)
          .map((v: any) => ({
            id: v.id,
            title: v.title,
            image: v.thumbnailUrl || v.url || '',
            categoryLabel: '', // Category should come from backend
            userLabel: v.owner?.name || '',
            viewCount: v.viewCount?.toLocaleString() || '0',
            viewDate: Math.floor((Date.now() - new Date(v.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          }));
        setRecommendedVideos(transformedVideos);
      } catch (error) {
        console.error("レコメンド動画の取得に失敗しました:", error);
      }
    };

    fetchRecommended();
  }, [params.projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>動画が見つかりませんでした。</p>
      </div>
    );
  }

  // サムネイル画像
  const thumbnailUrl = video.thumbnailUrl || video.url || '';
  // Thumbnail videos should come from backend - for now use empty array
  const thumbnailVideos: Array<{ id: number; thumbnail: string }> = [];

  return (
    <div className="min-h-screen bg-white text-gray-700 mx-auto">
      <main className="max-w-[1440px] mx-auto">
        {/* Section 2: Media Gallery & Project Information */}
        <section className="px-6 md:px-16 xl:px-[100px] py-8">
          <div className="flex flex-col xl:flex-row gap-12">
            {/* Main Video */}
            <div className="w-full xl:w-3/5">
              <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-black shadow-lg">
                {isPlaying && video.url ? (
                  <video
                    ref={videoRef}
                    src={video.url}
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    onEnded={() => setIsPlaying(false)}
                  />
                ) : (
                  <>
                    {video.thumbnailUrl || video.url ? (
                      <Image
                        src={video.thumbnailUrl || video.url}
                        alt={video.title}
                        className="h-full w-full object-cover"
                        width={344}
                        height={200}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">画像なし</span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={handlePlayClick}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 transition-transform hover:scale-110 shadow-xl cursor-pointer"
                        aria-label="動画を再生"
                      >
                        <Play
                          className="ml-1 h-10 w-10 text-primary"
                          fill="currentColor"
                        />
                      </button>
                    </div>
                  </>
                )}
                <div className="absolute left-4 bottom-4">
                  <div className="rounded bg-[#FFD700] px-4 py-1.5 text-sm font-bold text-black shadow-md">
                    {video.title}
                  </div>
                </div>
              </div>

              {/* Thumbnail Grid */}
              {thumbnailVideos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {thumbnailVideos.map((video, index) => (
                  <button
                    key={index}
                    className="aspect-video overflow-hidden rounded transition-all hover:border-primary hover:scale-105"
                    aria-label="Previous banner"
                  >
                      {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={`Scene ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={344}
                      height={100}
                    />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">画像なし</span>
                        </div>
                      )}
                  </button>
                ))}
              </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-2/5">
              <div className="rounded-lg bg-card xl:px-6">
                <h3 className="mb-4 text-[26px] font-bold text-black">最新の動画</h3>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black shadow-md">
                  {isSidebarPlaying && video.url ? (
                    <video
                      ref={sidebarVideoRef}
                      src={video.url}
                      className="h-full w-full object-cover"
                      controls
                      autoPlay
                      onEnded={() => setIsSidebarPlaying(false)}
                    />
                  ) : (
                    <>
                      {video.thumbnailUrl || video.url ? (
                        <Image
                          src={video.thumbnailUrl || video.url}
                          alt={video.title}
                          className="h-full w-full object-cover"
                          width={344}
                          height={100}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">画像なし</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={handleSidebarPlayClick}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl cursor-pointer transition-transform hover:scale-110"
                          aria-label="動画を再生"
                        >
                          <Play
                            className="ml-1 h-8 w-8 text-primary"
                            fill="currentColor"
                          />
                        </button>
                      </div>
                    </>
                  )}
                  <div className="absolute left-4 bottom-4">
                    <div className="rounded bg-[#FFD700] px-4 py-1.5 text-sm font-bold text-black shadow-md">
                      {video.title}
                    </div>
                  </div>
                </div>
                <p className="mb-6 text-[20px] font-bold leading-relaxed text-black">
                  {video.description || '動画の説明がありません。'}
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3 flex flex-col gap-3 text-xl sm:text-[23px]">
                    <a
                      href={`/videofunding/${video.id}/support`}
                      className="w-full text-center rounded-full text-white font-bold sm:py-4 py-2 bg-[#FF0066]"
                    >
                      この動画を購入
                    </a>
                    <a
                      href={`/videofunding/checkout?projectId=${video.id}&series=true`}
                      className="w-full text-center rounded-full text-white font-bold sm:py-4 py-2 bg-[#FF0066]"
                    >
                      このシリーズを購入
                    </a>
                  </div>
                  <div className="flex flex-col justify-start">
                    <button className="col-span-1 self-center" aria-label="Previous banner">
                      <Heart className="h-10 sm:h-14 w-10 sm:w-14 text-[#D9D9D9]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Section 3: video Recommendations */}
        <VideoRecommendationsFlow
          title={`${video.owner?.name || 'このプロジェクト'}その他の映像`}
          videos={recommendedVideos}
        />

        {/* Section 3: video Recommendations */}
        <VideoRecommendationsFlow
          title="このプロジェクトを見た人はこちらもチェックしています"
          videos={recommendedVideos}
          detail={true}
        />
      </main>
    </div>
  );
};

export default ProjectDetailPage;