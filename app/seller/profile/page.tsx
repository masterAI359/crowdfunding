'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import {
  getCurrentUser,
  getProjectsByOwner,
  getVideosByOwner,
  getDashboardStats,
} from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'
import ProjectCard from '@/app/components/project-card'
import VideoCard from '@/app/components/video-card'
import { SmartImage } from '@/app/utils/image-helper'

interface Project {
  id: string
  title: string
  description?: string
  amount: string
  supporters: string
  daysLeft: string
  achievementRate: number
  image: string
}

interface Video {
  id: string
  title: string
  image: string
  categoryLabel: string
  userLabel: string
  viewCount: string
  viewDate: number
}

const SellerProfilePage = () => {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated && user) {
      if (!user.isSeller && !user.isAdministrator) {
        router.push('/user-settings')
        return
      }
      loadData()
    }
  }, [isAuthenticated, loading, user])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [userDataRes, projectsRes, videosRes, statsRes] = await Promise.all([
        getCurrentUser(),
        getProjectsByOwner(1, 100),
        getVideosByOwner(1, 100),
        getDashboardStats().catch(() => null),
      ])

      setUserData(userDataRes)

      // Transform projects
      const transformedProjects: Project[] = (projectsRes.projects || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        amount: `¥${(p.totalAmount || 0).toLocaleString()}`,
        supporters: `${p.supporterCount || 0}人`,
        daysLeft: `${p.remainingDays || 0}日`,
        achievementRate: p.achievementRate || 0,
        image: p.image || '/assets/crowdfunding/cf-1.png',
      }))
      setProjects(transformedProjects)

      // Transform videos
      const transformedVideos: Video[] = (videosRes.videos || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        image: v.thumbnailUrl || v.url || '/assets/videofunding/video-1.png',
        categoryLabel: v.categoryLabel || 'バラエティー',
        userLabel: userDataRes?.name || 'Michael patternUSER',
        viewCount: String(v.viewCount || 150000),
        viewDate: 4, // Number of days ago
      }))
      setVideos(transformedVideos)

      setDashboardStats(statsRes)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const sellerName = userData?.name || user?.name || 'videofactory'
  const projectCount = projects.length
  const showcaseCount = dashboardStats?.showcaseCount || videos.length || 3
  const followerCount = dashboardStats?.followerCount || 20345
  const followingCount = dashboardStats?.followingCount || 10
  const collectionCount = dashboardStats?.collectionCount || 9
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' })
    : 'Jun 2025'

  // Get frequently purchased videos (top 4)
  const frequentlyPurchasedVideos = videos.slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Left: Small Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                <SmartImage
                  src={userData?.profileImage || '/assets/crowdfunding/creator-1.png'}
                  alt={sellerName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center: Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-black">{sellerName}</h1>
                <span className="bg-[#FF0066] text-white px-4 py-1 rounded-md text-sm font-semibold">
                  プロジェクトオーナー
                </span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="text-gray-700">
                  これまでに{projectCount}件のプロジェクトを投稿しています
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600">
                <p>在住国: 日本</p>
                <p>出身国: 東京</p>
                <p>現在地: 東京</p>
              </div>
            </div>

            {/* Right: Large Profile Image */}
            <div className="hidden md:block flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-200">
                <SmartImage
                  src={userData?.profileImage || '/assets/crowdfunding/creator-1.png'}
                  alt={sellerName}
                  width={192}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT Section */}
        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">PROJECT</h2>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">プロジェクトがありません</p>
          )}
        </section>

        {/* MOVIE Section */}
        <section className="mb-12 bg-white">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">MOVIE</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Activity Stats Box */}
            <div className="col-span-1 max-w-[300px] rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-black mb-6">アクティビティ</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="mb-1">ショーケース</p>
                  <p className="text-black">{showcaseCount}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="mb-1">フォロワー</p>
                  <p className="text-black">{followerCount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="mb-1">フォロー中</p>
                  <p className="text-black">{followingCount}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="mb-1">コレクション</p>
                  <p className="text-black">{collectionCount}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="mb-1">メンバー登録</p>
                  <p className="text-black">{memberSince}</p>
                </div>
              </div>
            </div>

            {/* Video Grid */}
            <div className="col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {videos.slice(0, 3).map((video) => (
                <Link
                  key={video.id}
                  href={`/videofunding/${video.id}`}
                  passHref
                  className="col-span-1"
                >
                  <div className="relative bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <img src={video.image} alt={video.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-black mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Frequently Purchased Videos Section */}
        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">よく購入されている動画</h2>
          {frequentlyPurchasedVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {frequentlyPurchasedVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <Link href={`/videofunding/${video.id}`}>
                    <div className="relative">
                      <SmartImage
                        src={video.image}
                        alt={video.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-black mb-2 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">{video.userLabel || sellerName}</p>
                      <p className="text-sm text-gray-500">
                        視聴回数: {parseInt(video.viewCount || '0').toLocaleString()}・
                        {video.viewDate}日前
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">動画がありません</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default SellerProfilePage
