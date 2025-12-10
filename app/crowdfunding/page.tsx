"use client"
import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/project-card';
import ProjectCarousel from '../components/project-carousel';
import { getProjects, getRecommendedProjects } from "@/app/lib/api";

interface Project {
  id: string;
  title: string;
  description?: string;
  amount: string;
  supporters: string;
  daysLeft: string;
  achievementRate: number;
  image: string;
}

const CrowdfundingPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [bannerProjects, setBannerProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // プロジェクト一覧を取得
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getProjects(currentPage, 12);
        setProjects(response.projects || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        console.error("プロジェクトの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]);

  // バナープロジェクト（レコメンド）を取得
  useEffect(() => {
    const fetchBannerProjects = async () => {
      try {
        const recommended = await getRecommendedProjects(undefined, 5);
        setBannerProjects(recommended || []);
      } catch (error) {
        console.error("レコメンドプロジェクトの取得に失敗しました:", error);
      }
    };

    fetchBannerProjects();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-700">

      <main className="xl:max-w-[1440px] mx-auto md:py-20 px-0 py-25">
        {bannerProjects.length > 0 && <ProjectCarousel projects={bannerProjects} />}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-md mx-auto gap-4 md:gap-y-8 mb-12  px-4 md:px-4  ">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center space-x-0">
          <button 
            type="button" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5 disabled:opacity-50 disabled:cursor-not-allowed" 
            aria-label="Previous page"
          >
            <svg width="10" height="10" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5307 19.6687L6.66191 12.7999H21.9995V9.59995H6.66191L13.5307 2.73115L11.2683 0.46875L0.537109 11.1999L11.2683 21.9312L13.5307 19.6687Z" fill="black" />
            </svg>

          </button>

          {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 flex items-center font-regular text-2xl justify-center rounded-full ${page === currentPage
                ? 'bg-[#FF0066] text-white border border-[#FF0066]'
                : ' hover:bg-gray-100'}`}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button 
            type="button" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors ml-5 disabled:opacity-50 disabled:cursor-not-allowed" 
            aria-label="Next page"
          >
            <svg width="10" height="12" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.26861 19.6687L11.531 21.9312L22.2622 11.1999L11.531 0.46875L9.26861 2.73115L16.1374 9.59995H0.799805V12.7999H16.1374L9.26861 19.6687Z" fill="black" />
            </svg>
          </button>
        </div>
      </main>

    </div>
  );
};

export default CrowdfundingPage;