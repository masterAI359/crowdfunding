"use client";
import React, { useRef } from "react";
import VideoCard from "./video-card";

interface Video {
    id: string | number;
    title: string;
    image: string;
    categoryLabel: string;
    userLabel: string;
    viewCount: string;
    viewDate: number;
}

interface VideoRecommendationsFlowProps {
    title: string;
    videos: Video[];
    detail?: boolean;
    scrollAmount?: number;
}

const VideoRecommendationsFlow: React.FC<VideoRecommendationsFlowProps> = ({
    title,
    videos,
    detail = false,
    scrollAmount = 300,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <section className="hidden md:block bg-[#ECEBD9] py-12">
            <div className="max-w-[1320px] mx-auto px-2 sm:px-6">
                <h2 className="text-2xl font-bold text-black mb-8 text-center">
                    {title}
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
                                    <VideoCard video={video} detail={detail} />
                                </div>
                            )),
                        )}
                    </div>

                    {/* Navigation Arrows */}
                    <button
                        onClick={scrollLeft}
                        className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#EB4040] hover:bg-[#EB4040]/80 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -ml-5"
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
                        className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#EB4040] hover:bg-[#EB4040]/80 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -mr-5"
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
    );
};

export default VideoRecommendationsFlow;

