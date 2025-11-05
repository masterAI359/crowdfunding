"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";


interface Video {
  id: number;
  title: string;
  image: string;
  categoryLabel: string;
}

interface VideoCardProps {
  video: Video;
}

type CategoryType = "バラエティー" | "スピリチュアル" | "ミュージック" | "ドキュメンタリー";



const categoryStyles: Record<CategoryType, string> = {
  バラエティー: "bg-[#06C755] text-white",
  スピリチュアル: "bg-[#FFA101] text-white",
  ミュージック: "bg-[#4285F4] text-white",
  ドキュメンタリー: "bg-[#A442F4] text-white"
};

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link href={`/videofunding/${video.id}`} passHref>
      <div className="relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-[#E9E9E9] cursor-pointer">
        {/* Project Image */}
        <Image
          src={video.image}
          alt={video.title}
          className="w-full sm:h-48 h-30 object-cover rounded-t-lg"
          width={319}
          height={201}
        />

        <span className={`absolute top-0 right-0 rounded-tr-2.5 rounded-bl-[5px] px-1.5 py-0.5 text-base ${categoryStyles[video.categoryLabel as CategoryType]}`}>
          {video.categoryLabel}
        </span>

        <div className="p-4">
          {/* video Title */}
          <h3 className="font-bold text-center sm:mb-3 mb-1 line-clamp-2 text-black text-sm sm:text-lg">
            {video.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
