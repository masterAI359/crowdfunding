"use client";
import React, { useState, useEffect } from "react";
import { searchProjects, getProjects } from "@/app/lib/api";
import ProjectCard from "@/app/components/project-card";

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

const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("人気順");
  const [searchKeyword, setSearchKeyword] = useState("映画");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const sortTabs = ["人気順", "新着順", "終了日が近い順", "支援総額順"];

  // Map sort tab to backend sortBy parameter
  const getSortBy = (tab: string) => {
    switch (tab) {
      case "人気順":
        return "popular";
      case "新着順":
        return undefined; // default is newest
      case "終了日が近い順":
        return "ending";
      case "支援総額順":
        return "amount";
      default:
        return undefined;
    }
  };

  // Fetch projects based on search
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const sortBy = getSortBy(activeTab);
        let response;
        
        if (searchKeyword && searchKeyword.trim()) {
          response = await searchProjects(searchKeyword, currentPage, 12);
        } else {
          response = await getProjects(currentPage, 12, sortBy);
        }

        const transformedProjects = (response.projects || []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          amount: `¥${(project.totalAmount || 0).toLocaleString()}`,
          supporters: (project.supporterCount || 0).toLocaleString(),
          daysLeft: `${project.remainingDays || 0}日`,
          achievementRate: project.achievementRate || 0,
          image: project.image || '',
        }));

        setProjects(transformedProjects);
        setTotalCount(response.pagination?.total || 0);
      } catch (error) {
        console.error("プロジェクトの取得に失敗しました:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchKeyword, activeTab, currentPage]);

  return (
    <div className="min-h-screen bg-white text-black pb-5">
      <main className="mx-auto">

         {/* === Mobile Filters (Dropdown + Search Bar) === */}
        <div className="block lg:hidden max-w-full p-4 rounded-md mb-6 bg-[#ECEBD9]">
        {/* Dropdowns */}
        <div className="flex gap-2 mb-3">
            {/* Category Select */}
            <div className="relative flex-1">
            <label htmlFor="category-select" className="sr-only">カテゴリー</label>
            <select id="category-select" className="w-full appearance-none border border-[#d5d5d5] bg-white rounded-sm p-2 text-sm pr-8">
                <option>全カテゴリー</option>
                <option>映画</option>
                <option>音楽</option>
                <option>アート</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                width="12"
                height="15"
                viewBox="0 0 17 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M8.5 0L15.8612 9H1.13878L8.5 0Z" fill="#4E4A49" />
                <path d="M8.5 22L15.8612 13H1.13878L8.5 22Z" fill="#4E4A49" />
                </svg>
            </div>
            </div>

            {/* Region Select */}
            <div className="relative flex-1">
            <label htmlFor="region-select" className="sr-only">地域</label>
            <select id="region-select" className="w-full appearance-none border border-[#d5d5d5] bg-white rounded-sm p-2 text-sm pr-8">
                <option>全地域</option>
                <option>東京</option>
                <option>大阪</option>
                <option>福岡</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <svg
                width="12"
                height="15"
                viewBox="0 0 17 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M8.5 0L15.8612 9H1.13878L8.5 0Z" fill="#4E4A49" />
                <path d="M8.5 22L15.8612 13H1.13878L8.5 22Z" fill="#4E4A49" />
                </svg>
            </div>
            </div>
        </div>

        {/* Search Bar */}
        <div className="flex mb-3">
            <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-grow border border-[#d5d5d5] bg-white rounded-l-md p-2 text-sm"
            placeholder="キーワード検索"
            />
            <button className="bg-gray-700 text-white px-4 rounded-r-md text-sm">
            検索
            </button>
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-3 text-sm text-gray-800">
            {["人気順", "新着順", "終了順"].map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                activeTab === tab ? "font-bold text-[#FF0066]" : "text-black"
                }`}
            >
                {tab}
            </button>
            ))}
        </div>
        </div>

        {/* === Desktop Sorting Tabs === */}
        <div className="py-9 bg-[#ECEBD9] w-full hidden lg:block">
          <div className="max-w-5xl hidden md:flex items-center lg:flex-row gap-3 mx-auto">
            
            {/* Label for Sorting */}
            <span className="font-bold text-sm text-black whitespace-nowrap">
              並べ替え
            </span>

            {/* Sorting Tabs */}
            {sortTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium border flex-shrink-0 ${
                  activeTab === tab
                    ? "bg-[#FF0066] text-white border-red-500"
                    : "bg-[#F9F9F5] text-black hover:bg-gray-100 border-[#D5D5D5]"
                }`}
              >
                {tab}
              </button>
            ))}

            {/* Advanced Filter */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1.5 rounded-md text-sm font-medium border bg-[#F9F9F5] hover:bg-gray-100 border-gray-200 flex-shrink-0"
            >
              さらに絞り込む +
            </button>

            {/* User filters with Label */}
            <div className="ml-auto flex items-center flex-nowrap gap-3">
              <span className="font-bold text-sm text-black">マイページ</span>
              <button className="px-3 py-1.5 rounded-md text-sm font-medium border bg-[#F9F9F5] hover:bg-gray-100 border-gray-200 flex-shrink-0">
                気になる
              </button>
              <button className="px-3 py-1.5 rounded-md text-sm font-medium border bg-[#F9F9F5] hover:bg-gray-100 border-gray-200 flex-shrink-0">
                閲覧履歴
              </button>
            </div>
          </div>
        </div>

        {/* === Advanced Filter Dropdown === */}
        {showAdvanced && (
          <div className="max-w-5xl mx-auto bg-white border border-gray-300 rounded-md shadow-md p-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              {/* 目標金額 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* Yen Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v18m-6-6h12M6 9h12"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-800">目標金額</h3>
                </div>
                <hr className="mb-3 border-gray-300" />
                {["50万円以下","50万円〜300万円","300万円〜1000万円","1000万円〜3000万円","3000万円以上"].map((label, i) => (
                  <label key={i} className="flex items-center mb-2 text-sm text-gray-700">
                    <input type="checkbox" className="mr-2" /> {label}
                  </label>
                ))}
              </div>

              {/* リターン金額 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* Gift Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16 0H4m16 0V9a2 2 0 00-2-2h-3.5a1.5 1.5 0 01-3 0H6a2 2 0 00-2 2v3m16 0H4"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-800">リターン金額</h3>
                </div>
                <hr className="mb-3 border-gray-300" />
                {["1000円以下","1000円〜5000円","5000円〜1万円","1万円〜3万円","3万円以上"].map((label, i) => (
                  <label key={i} className="flex items-center mb-2 text-sm text-gray-700">
                    <input type="checkbox" className="mr-2" /> {label}
                  </label>
                ))}
              </div>

              {/* 達成率 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* Chart Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 11V3H5v18h14V11h-8z"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-800">達成率</h3>
                </div>
                <hr className="mb-3 border-gray-300" />
                {["70%未満","70%〜100%","100%以上"].map((label, i) => (
                  <label key={i} className="flex items-center mb-2 text-sm text-gray-700">
                    <input type="checkbox" className="mr-2" /> {label}
                  </label>
                ))}
              </div>

              {/* プロジェクトの種類 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {/* Calendar Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-800">プロジェクトの種類</h3>
                </div>
                <hr className="mb-3 border-gray-300" />
                {["もうすぐ公開","募集中のもの","終了したもの","コロナサポートプログラム","コミュニティのみ","ふるさと納税のみ"].map((label, i) => (
                  <label key={i} className="flex items-center mb-2 text-sm text-gray-700">
                    <input type="checkbox" className="mr-2" /> {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                条件をクリア
              </button>
              <button
                onClick={() => setShowAdvanced(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
              >
                閉じる
              </button>
            </div>
          </div>
        )}


        {/* === Search Heading === */}
        <h2 className="text-lg md:text-xl font-bold mb-8 max-w-5xl mx-auto mt-10 px-4 md:px-0">
          {searchKeyword && searchKeyword.trim() ? (
            <>
              「{searchKeyword}」で検索した結果
              <span className="mx-1">{totalCount}</span>件のプロジェクトが見つかりました。
            </>
          ) : (
            <>
              プロジェクト一覧
              <span className="mx-1">{totalCount}</span>件のプロジェクトが見つかりました。
            </>
          )}
        </h2>

        {/* === Project Grid === */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 sm:max-w-5xl max-w-md mx-auto gap-4 md:gap-y-8 mb-12 px-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
