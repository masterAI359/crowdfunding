"use client";
import React, { useState, use, useRef, useEffect } from 'react';
import Image from 'next/image';
import { SmartImage } from '@/app/utils/image-helper';
import ProjectCard from '@/app/components/project-card';
import ImageGallery from '@/app/components/image-gallery';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { getProjectById, toggleFavorite, getRecommendedProjects } from '@/app/lib/api';
import LoadingSpinner from '@/app/components/loading-spinner';

interface Project {
  id: string;
  title: string;
  description?: string;
  amount: string;
  goalAmount: string;
  supporters: string;
  daysLeft: string;
  achievementRate: number;
  image: string;
  media?: Array<{ url: string; type: string }>;
  returns?: Array<{ id: string; title: string; amount: number; description?: string; notes?: string }>;
  isFavorited?: boolean;
  owner?: {
    id: string;
    name?: string;
    email?: string;
  };
}

const ProjectDetailPage = ({ params: paramsPromise }: { params: Promise<{ projectId: string }> }) => {
  const params = use(paramsPromise);
  const [project, setProject] = useState<Project | null>(null);
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null);

  // プロジェクト詳細を取得
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(params.projectId);
        
        // お気に入り状態を明示的に取得（boolean値として確実に扱う）
        const favoriteStatus = Boolean(data.isFavorite);
        
        // データを変換してフロントエンドの形式に合わせる
        const transformedProject: Project = {
          id: data.id,
          title: data.title,
          description: data.description,
          amount: `¥${(data.totalAmount || 0).toLocaleString()}`,
          goalAmount: `¥${(data.goalAmount || 0).toLocaleString()}`,
          supporters: (data.supporterCount || 0).toLocaleString(),
          daysLeft: `${data.remainingDays || 0}日`,
          achievementRate: data.achievementRate || 0,
          image: data.image || '',
          media: data.medias || [],
          returns: (data.returns || []).map((ret: any) => ({
            id: ret.id,
            title: ret.title,
            amount: ret.amount || 0,
            description: ret.description || ret.notes || '',
            notes: ret.notes,
          })),
          isFavorited: favoriteStatus,
          owner: data.owner, // Add owner information
        };
        setProject(transformedProject);
        setIsFavorited(favoriteStatus);
      } catch (error) {
        console.error("プロジェクトの取得に失敗しました:", error);
        // エラー時はお気に入り状態をfalseにリセット
        setIsFavorited(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.projectId]);

  // レコメンドプロジェクトを取得
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const recommended = await getRecommendedProjects(params.projectId, 20);
        // データを変換してフロントエンドの形式に合わせる
        const transformedProjects = (recommended || []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          amount: `¥${(project.totalAmount || 0).toLocaleString()}`,
          supporters: (project.supporterCount || 0).toLocaleString(),
          daysLeft: `${project.remainingDays || 0}日`,
          achievementRate: project.achievementRate || 0,
          image: project.image || '',
        }));
        setRecommendedProjects(transformedProjects);
      } catch (error) {
        console.error("レコメンドプロジェクトの取得に失敗しました:", error);
      }
    };

    fetchRecommended();
  }, [params.projectId]);

  // Reset current page if it exceeds available pages
  useEffect(() => {
    const itemsPerPage = 6;
    const totalPages = Math.ceil(recommendedProjects.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [recommendedProjects.length, currentPage]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // お気に入り切り替え
  const handleToggleFavorite = async () => {
    if (!project || isTogglingFavorite) return;
    try {
      setIsTogglingFavorite(true);
      const response = await toggleFavorite(project.id);
      // Use the response from the API to ensure UI is in sync with server state
      setIsFavorited(response?.isFavorite ?? !isFavorited);
    } catch (error) {
      console.error("お気に入りの更新に失敗しました:", error);
      // On error, don't change the state to keep UI consistent
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>プロジェクトが見つかりませんでした。</p>
      </div>
    );
  }

  // メディア画像を取得
  const images = project.media?.filter(m => m.type === 'IMAGE').map(m => m.url) || [project.image].filter(Boolean);

  // リターン情報
  const returns = project.returns || [];

  // Creator information from project owner
  const creators = project.owner ? [
    { 
      id: project.owner.id, 
      title: project.owner.name || "", 
      image: project.image, 
      text: project.description || "" 
    },
  ] : [];

  return (
    <div className="min-h-screen  bg-white text-gray-700 mx-auto">

      <main className='max-w-[1440px] mx-auto'>
        {/* Section 1: Hero Banner */}
        <section className="relative ">
          {/* Desktop Layout */}
          <div className="hidden lg:flex h-[50vh] relative">
            {/* Left Black Background */}
            <div className="w-[60%] bg-black flex items-center justify-center p-5 absolute left-0 top-0 bottom-0">
              <div className="text-white max-w-3xl md:ml-10">
                <h1 className="xl:text-6xl lg:text-4xl sm:text-3xl  font-bold mb-6">{project.title}</h1>
                <p className="text-lg mb-8 leading-relaxed">{project.description}</p>
                <Link
                  href={`/crowdfunding/${project.id}/support`}
                  className="bg-[#FF0066] hover:bg-[#FF0066]/80 text-white font-bold py-4 px-8 sm:w-1/2 rounded-full transition-colors text-center"
                >
                  プロジェクトを支援する
                </Link>
              </div>
            </div>

            {/* Right Image with Gradient Overlay */}
            <div className="w-[48%] h-[50vh] overflow-hidden absolute right-0 top-0 bottom-0 flex-1">
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
              <SmartImage
                src={project.image}
                alt={project.title}
                fill
                className="w-full h-full"
                priority
              />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden h-[60vh] mb-10 flex flex-col">
            {/* Top Image */}
            <div className="h-[30vh] relative">
              <SmartImage
                src={project.image}
                alt={project.title}
                fill
                className="stretch"
                priority
              />
            </div>

            {/* Bottom Black Background */}
            <div className="h-[20vh] bg-black flex items-center p-6">
              <div className="text-white">
                <h1 className="sm:text-2xl text-xl  font-bold mb-4">{project.title}</h1>
                <p className="sm:text-sm text-xs mb-4 line-clamp-3">{project.description}</p>
                <Link
                  href={`/crowdfunding/${project.id}/support`}
                  className="bg-[#FF0066] hover:bg-[#FF0066]/80 text-white font-bold py-1 px-2 rounded-full transition-colors sm:text-sm text-xs inline-block text-center"
                >
                  プロジェクトを支援する
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Media Gallery & Project Information */}
        <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-6 md:gap-8">
            <ImageGallery images={images} />

            <div className="space-y-4 md:space-y-6 lg:ml-4">
              <div>
                <h2 className="text-sm md:text-md text-black font-bold mb-2 md:mb-4">現在の支援総額</h2>
                <p className="text-3xl md:text-4xl lg:text-7xl font-bold text-gray-900">{project.amount}</p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full border-1 border-[#D9D9D9] rounded-full h-8 md:h-10 mb-2 overflow-hidden ">
                  <div
                    className="flex  items-center bg-gradient-to-r from-[#FF0066] to-[#FFA101] h-8 md:h-10 rounded-full"
                    style={{ width: `${project.achievementRate}%` }}
                  >
                    <p className="text-base md:text-xl text-white font-bold ml-2 md:ml-6 whitespace-nowrap ">
                      {project.achievementRate}%
                    </p>
                  </div>
                </div>

                <p className="text-xl md:text-3xl text-black font-bold">目標金額：{project.goalAmount}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-rows-2 gap-3 md:gap-4 lg:gap-8">
                <div>
                  <p className="text-sm md:text-md text-black font-bold">支援者数</p>
                  <p className="text-2xl md:text-3xl lg:text-6xl text-black font-bold">{project.supporters}</p>
                </div>
                <div>
                  <p className="text-sm md:text-md text-black font-bold">募集終了までの残り</p>
                  <p className="text-2xl md:text-3xl lg:text-6xl text-black font-bold">{project.daysLeft}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Link
                  href={`/crowdfunding/${project.id}/support`}
                  className="flex-1 cursor-pointer bg-[#FF0066] hover:bg-[#FF0066]/80 text-white text-base md:text-xl font-bold py-3 px-4 md:px-6 rounded-full transition-colors text-center"
                >
                  プロジェクトを支援する
                </Link>
                <button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFavorite}
                  className="w-10 h-10 md:w-12 md:h-12 cursor-pointer flex items-center justify-center rounded-3xl hover:bg-gray-50/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  {isTogglingFavorite ? (
                    <LoadingSpinner size="sm" className="text-[#FF0066]" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 md:h-8 md:w-8 ${isFavorited ? 'text-[#FF0066]' : 'text-gray-400'}`}
                      fill={isFavorited ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isFavorited ? 3 : 2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Project Recommendations */}
        <section className="hidden md:block bg-[#ECEBD9] py-12">
          <div className="max-w-[1320px] mx-auto px-2 sm:px-6">
            <h2 className="text-2xl font-bold text-black mb-8 text-center">
              このプロジェクトを見た人はこちらもチェックしています
            </h2>

            <div className="relative">
              <div
                ref={scrollRef}
                className="flex space-x-6 overflow-x-auto pb-4 hide-scrollbar"
              >
                {recommendedProjects.map((recProject) => (
                  <div
                    key={recProject.id}
                    className="flex-shrink-0 w-75"
                  >
                    <ProjectCard project={recProject} />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={scrollLeft}
                className="cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#FF0066] hover:bg-[#FF0066]/80 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -ml-5"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={scrollRight}
                className="cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#FF0066] hover:bg-[#FF0066]/80 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors -mr-5"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </section>



        {/* Section 4: About the Creator & Rewards */}
        <section className="py-8 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">

              {/* Left Column: About the Creator (60% width on desktop) */}
              <div className="lg:col-span-3 space-y-6 md:space-y-8">

                {/* First Content Block */}
                {creators.map((creator) => (
                  <div key={creator.id} className="bg-white rounded-lg pb-10">
                    <div className="flex flex-col gap-6">
                      <div className="w-full">
                        <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#FF0066]">プロジェクト実行者について</h3>
                        <div className="relative h-[30vh] md:h-auto bg-gray-200 rounded-lg overflow-hidden shadow">
                          <SmartImage src={creator.image} alt="クリエイターとの対話" fill className="w-full h-full shadow" />
                        </div>
                      </div>
                      <div className="w-full">
                        <p className="text-sm md:text-base text-black leading-relaxed">{creator.text}</p>
                      </div>
                    </div>
                  </div>
                ))}



              </div>

              {/* Right Column: Rewards List (40% width on desktop) */}
              <div className="space-y-4 md:space-y-6 lg:col-span-2">

                {/* Reward Card  */}
                {returns.map((reward, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="relative h-40 md:h-52 w-full rounded-md mb-3 md:mb-4 overflow-hidden bg-gray-200">
                      {project.image ? (
                        <Image src={project.image} alt={reward.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm md:text-base">画像なし</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-6 pt-0">
                      <h3 className="text-lg md:text-xl font-bold text-black mb-2">{reward.title}</h3>
                      <p className="text-2xl md:text-3xl font-bold text-black mb-3 md:mb-4">¥{(reward.amount || 0).toLocaleString()}</p>
                      <p className="text-xs md:text-sm text-black whitespace-pre-line mb-4 md:mb-6">{reward.description}</p>
                      <Link
                        href={`/crowdfunding/${project.id}/support?returnId=${reward.id}`}
                        className="block w-full bg-[#FF0066] hover:bg-[#FF0066]/80 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-3xl transition-colors text-center text-sm md:text-base"
                      >
                        このリターンを選択する
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 (for mobile screens only)  */}
        <section className='md:hidden '>
          {/* Project Grid Section */}
          <h2 className="text-2xl font-bold text-black mb-8 text-center px-4">
            「映画」で検索した結果1944件のプロジェクトが見つかりました。
          </h2>
          {(() => {
            const itemsPerPage = 6;
            const totalPages = Math.ceil(recommendedProjects.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedProjects = recommendedProjects.slice(startIndex, endIndex);

            return (
              <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-lg mx-auto gap-4 md:gap-y-8 mb-12  px-4  ">
                {paginatedProjects.map(recProject => (
                  <ProjectCard key={recProject.id} project={recProject} />
                ))}
              </div>
            );
          })()}
        </section>


        {/* Section 6: only for mobile screens  */}
        <section>
          {/* Pagination */}
          {(() => {
            const itemsPerPage = 6;
            const totalPages = Math.ceil(recommendedProjects.length / itemsPerPage);
            
            return (
              <div className="flex md:hidden justify-center space-x-0 ">
                <button 
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors mr-5 mb-10 disabled:opacity-50 disabled:cursor-not-allowed" 
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 flex items-center justify-center rounded-full border border-black hover:bg-gray-100 transition-colors ml-5 disabled:opacity-50 disabled:cursor-not-allowed" 
                  aria-label="Next page"
                >
                  <svg width="10" height="12" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.26861 19.6687L11.531 21.9312L22.2622 11.1999L11.531 0.46875L9.26861 2.73115L16.1374 9.59995H0.799805V12.7999H16.1374L9.26861 19.6687Z" fill="black" />
                  </svg>
                </button>
              </div>
            );
          })()}
        </section>

      </main>

    </div>
  );
};

export default ProjectDetailPage;