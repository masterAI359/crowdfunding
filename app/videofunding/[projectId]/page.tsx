"use client";
import React, { use } from "react";
import Image from "next/image";
import { videos, bannerProjects } from "@/app/data/projects";
import { Play, Heart } from "lucide-react";
import ProjectCarousel from "@/app/components/project-carousel";
import VideoRecommendationsFlow from "@/app/components/video-recommendations-flow";
const ProjectDetailPage = ({
  params: paramsPromise,
}: {
  params: Promise<{ projectId: string }>;
}) => {
  const params = use(paramsPromise);

  //  Find the project by ID from your projects array
  const video = videos.find((p) => p.id.toString() === params.projectId);
  console.log("video===>", video);
  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>プロジェクトが見つかりませんでした。</p>
      </div>
    );
  }

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
    {
      id: 5,
      thumbnail: "/assets/videofunding/video-1.png",
    },
    {
      id: 6,
      thumbnail: "/assets/videofunding/video-1.png",
    },
    {
      id: 7,
      thumbnail: "/assets/videofunding/video-1.png",
    },
    {
      id: 8,
      thumbnail: "/assets/videofunding/video-1.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-700 mx-auto pt-21">
      <main className="max-w-[1440px] mx-auto">
        {/* Section 2: Media Gallery & Project Information */}
        <section className="px-6 md:px-16 xl:px-[100px] py-8">
          <div className="flex flex-col xl:flex-row gap-12">
            {/* Main Video */}
            <div className="w-full xl:w-3/5">
              <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-black shadow-lg">
                <Image
                  src={video.image}
                  alt="The Last Message - 人生最後の暴露トーク"
                  className="h-full w-full object-cover"
                  width={344}
                  height={200}
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
                    className="aspect-video overflow-hidden rounded transition-all hover:border-primary hover:scale-105"
                    aria-label="Previous banner"
                  >
                    <Image
                      src={video.thumbnail}
                      alt={`Scene ${index + 1}`}
                      className="h-full w-full object-cover"
                      width={344}
                      height={100}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full xl:w-2/5">
              <div className="rounded-lg bg-card xl:px-6">
                <h3 className="mb-4 text-[26px] font-bold text-black">最新の動画</h3>
                <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-black shadow-md">
                  <Image
                    src={video.image}
                    alt="Latest video"
                    className="h-full w-full object-cover"
                    width={344}
                    height={100}
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
                <p className="mb-6 text-[20px] font-bold leading-relaxed text-black">
                  この文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3 flex flex-col gap-3 text-xl sm:text-[23px]">
                    <a
                      href={`/videofunding/${video.id}/support`}
                      className="w-full text-center rounded-full text-white font-bold sm:py-4 py-2 bg-[#FF0066]"
                    >
                      この動画を購入
                    </a>
                    <a className="w-full text-center rounded-full text-white font-bold sm:py-4 py-2 bg-[#FF0066]">
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
          title="〇〇プロジェクトその他の映像"
          videos={videos}
        />

        {/* Section 3: video Recommendations */}
        <VideoRecommendationsFlow
          title="このプロジェクトを見た人はこちらもチェックしています"
          videos={videos}
          detail={true}
        />

        {/* Section 5 (for mobile screens only)  */}
        <section className="md:hidden">
          <ProjectCarousel projects={bannerProjects} lightMode={true} />
        </section>

        <section className="md:hidden">
          <ProjectCarousel projects={bannerProjects} lightMode={true} />
        </section>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
