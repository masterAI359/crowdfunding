"use client"
import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/project-card';
import ProjectCarousel from '../components/project-carousel';
import { getProjects, getRecommendedProjects } from '@/app/lib/api';
import { transformProject, transformBannerProject } from '@/app/lib/utils';

const CrowdfundingPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [bannerProjects, setBannerProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch main projects list
        const projectsData = await getProjects(currentPage, 12);
        const transformedProjects = projectsData.projects.map(transformProject);
        setProjects(transformedProjects);
        setTotalPages(projectsData.pagination?.totalPages || 1);

        // Fetch recommended projects for banner
        const recommended = await getRecommendedProjects(undefined, 5);
        const transformedBanner = recommended.map(transformBannerProject);
        setBannerProjects(transformedBanner);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

      <main className="xl:max-w-[1440px] mx-auto px-0  py-16 pt-20">
        {bannerProjects.length > 0 && <ProjectCarousel projects={bannerProjects} />}

        <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-md mx-auto gap-4 md:gap-y-8 mb-12  px-4 md:px-4  ">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-0">
          <button 
            type="button" 
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
              onClick={() => handlePageChange(page)}
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
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
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