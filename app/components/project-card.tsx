"use client";
import React from "react";
import Link from "next/link";

interface Project {
  id: string | number;
  title: string;
  amount: string;
  supporters: string;
  daysLeft: string;
  achievementRate: number;
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/crowdfunding/${project.id}`} passHref>
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-[#E9E9E9] cursor-pointer">
        {/* Project Image */}
        <img
          src={project.image}
          alt={project.title}
          className="w-full sm:h-48 h-30 object-cover rounded-t-lg"
        />

        <div className="p-4">
          {/* Project Title */}
          <h3 className="font-bold text-center sm:mb-3 mb-1 line-clamp-2 text-black text-sm sm:text-lg">
            {project.title}
          </h3>

          {/* Progress Bar */}
          <div className="w-full border border-black/20 rounded-full h-3 sm:mb-4 mb-1">
            <div
              className="bg-gradient-to-r from-[#FF0066] to-[#FFA101] h-3 rounded-full"
              style={{ width: `${Math.min(project.achievementRate, 100)}%` }}
            ></div>
          </div>

          {/* Project Metrics (Responsive) */}
          <div className="sm:mb-2 mb-1">
            {/* Small/Medium layout (below lg) */}
            <div className="block lg:hidden">
              {/* Amount row */}
              <div className="flex justify-center items-baseline space-x-2 sm:mb-2 mb-1 flex-wrap">
                <p className="text-xs sm:text-lg text-black">調達金額</p>
                <p className="text-sm sm:text-2xl font-bold break-keep">{project.amount}</p>
              </div>

              {/* Supporters + Days Left side by side */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-center items-baseline space-x-1 sm:space-x-2 flex-wrap">
                  <p className="text-xs sm:text-lg text-black">参加人数</p>
                  <p className="text-sm sm:text-xl font-bold break-keep">{project.supporters}</p>
                </div>
                <div className="flex justify-center items-baseline space-x-1 sm:space-x-2 flex-wrap">
                  <p className="text-xs sm:text-lg text-black">残り日数</p>
                  <p className="text-sm sm:text-xl font-bold break-keep">{project.daysLeft}</p>
                </div>
              </div>
            </div>

            {/* Large/Desktop layout */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-md text-black/90">調達金額</p>
                <p className="text-xl font-bold">{project.amount}</p>
              </div>
              <div className="text-center">
                <p className="text-md text-black/90">参加人数</p>
                <p className="text-xl font-bold">{project.supporters}</p>
              </div>
              <div className="text-center">
                <p className="text-md text-black/90">残り日数</p>
                <p className="text-xl font-bold">{project.daysLeft}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
