'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import LoadingSpinner from '@/app/components/loading-spinner'
import apiClient from '@/app/lib/api'
import Link from 'next/link'
import Image from 'next/image'

interface Video {
  id: string
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  price: number
  viewCount: number
  purchaseCount: number
  createdAt: string
  owner: {
    id: string
    name?: string
    email?: string
  }
}

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name?: string
  }
}

interface RelatedVideo {
  id: string
  title: string
  thumbnailUrl?: string
  price: number
  description?: string
  viewCount?: number
  createdAt: string
  owner?: {
    name?: string
  }
}

const WatchVideoPage = () => {
  const router = useRouter()
  const params = useParams()
  const videoId = params.videoId as string
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [video, setVideo] = useState<Video | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [relatedVideos, setRelatedVideos] = useState<RelatedVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated && videoId) {
      fetchVideoData()
    }
  }, [isAuthenticated, authLoading, videoId])

  const fetchVideoData = async () => {
    try {
      setLoading(true)
      const [videoResponse, commentsResponse] = await Promise.all([
        apiClient.get(`/videos/${videoId}`),
        apiClient.get(`/videos/${videoId}/comments`),
      ])

      setVideo(videoResponse.data)
      setComments(commentsResponse.data || [])

      // Fetch related videos (you can adjust this logic)
      try {
        const relatedResponse = await apiClient.get('/videos/list', {
          params: { page: 1, limit: 6 },
        })
        setRelatedVideos(relatedResponse.data.videos || [])
      } catch (error) {
        console.error('Failed to load related videos:', error)
        // Set empty array if fetch fails
        setRelatedVideos([])
      }
    } catch (error: any) {
      console.error('Failed to load video:', error)
      if (error.response?.status === 404) {
        router.push('/user-settings/movies')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setIsSubmittingComment(true)
      await apiClient.post(`/videos/${videoId}/comments`, {
        content: newComment,
      })
      setNewComment('')
      // Reload comments
      const commentsResponse = await apiClient.get(`/videos/${videoId}/comments`)
      setComments(commentsResponse.data || [])
    } catch (error) {
      console.error('Failed to post comment:', error)
      alert('コメントの投稿に失敗しました')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return '今日'
    if (diffDays === 1) return '昨日'
    if (diffDays < 30) return `${diffDays}日前`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`
    return `${Math.floor(diffDays / 365)}年前`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-900 text-center">
          <p className="text-xl mb-4">動画が見つかりません</p>
          <Link href="/user-settings/movies" className="text-[#FF0066] hover:underline">
            マイムービーに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Video Player Section */}
      <div className="w-full bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              {video.url ? (
                <video
                  src={video.url}
                  controls
                  autoPlay
                  className="w-full h-full"
                  poster={video.thumbnailUrl}
                >
                  お使いのブラウザは動画タグをサポートしていません。
                </video>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">動画を読み込めません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Info and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6">こんな動画も購入されています</h3>
            <div className="flex flex-col gap-4 bg-[#ECEBD9] p-4 rounded-lg">
              {relatedVideos
                .filter((v) => v.id !== videoId)
                .slice(0, 6)
                .map((relatedVideo) => (
                  <Link
                    key={relatedVideo.id}
                    href={`/user-settings/movies/watch/${relatedVideo.id}`}
                    className="w-full flex md:flex-row flex-col gap-0 bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full md:w-80 h-48 flex-shrink-0">
                      {relatedVideo.thumbnailUrl ? (
                        <Image
                          src={relatedVideo.thumbnailUrl}
                          alt={relatedVideo.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-6 bg-white relative">
                      <h4 className="font-bold text-xl leading-tight mb-3 text-gray-900 break-words text-wrap">
                        {relatedVideo.title}
                      </h4>
                      <div className="text-sm text-gray-700 leading-relaxed max-w-full">
                        <p className="line-clamp-3 break-words text-wrap max-w-full">
                          {relatedVideo.description ||
                            'この文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーですこの文章はダミーです'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            {/* Video Title and Info */}
            <div className=" border border-gray-200 rounded-lg p-6 mb-6">
              {/* Title */}
              <h1 className="text-4xl font-bold mb-4">{video.title}</h1>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">{formatDate(video.createdAt)}</span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded border border-gray-300">
                  成人向け
                </span>
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded border border-gray-300">
                  AIを含む
                </span>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-6 mb-2 pb-2 border-b border-gray-200">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="font-semibold">{video.purchaseCount || 172}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>
              </div>

              {/* Creator Info */}
              {video.owner && (
                <div className="flex items-center justify-between mb-2 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      <span className="text-lg font-semibold">
                        {video.owner.name?.charAt(0)?.toUpperCase() || 'M'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {video.owner.name || 'Meat Dept.'}
                      </p>
                    </div>
                  </div>
                  <button className="px-2 py-1 bg-[#FF0066] text-white text-xs rounded hover:bg-[#E6005C] transition-colors font-medium">
                    フォロー
                  </button>
                </div>
              )}

              {/* Description */}
              {video.description && (
                <div className="mb-2 pb-2">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words">
                    {video.description}
                  </p>
                </div>
              )}

              {/* Upload Date */}
              <div className="mb-2 pb-2">
                <p className="text-sm text-gray-600">
                  {new Date(video.createdAt).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  にアップロードされました
                </p>
              </div>

              {/* Categories */}
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900 mb-3">カテゴリー</h3>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-[#ECEBD9] text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer">
                    アニメーション
                  </span>
                  <span className="px-2 py-1 bg-[#ECEBD9] text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer">
                    コメディ
                  </span>
                  <span className="px-2 py-1 bg-[#ECEBD9] text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer">
                    3D/CG
                  </span>
                  <span className="px-2 py-1 bg-[#ECEBD9] text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors cursor-pointer">
                    ドキュメンタリー
                  </span>
                </div>
              </div>

              {/* License */}
              <div className="text-sm text-gray-600">
                <span className="font-semibold">ライセンス：</span>
                <span>表示</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className=" border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">コメント</h2>
                <span className="text-sm text-gray-600">{comments.length}</span>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    まだコメントがありません。最初のコメントを投稿しましょう！
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 text-white">
                        <span className="text-sm font-semibold">
                          {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {comment.user?.name || 'Tom Brown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        <button className="text-sm text-gray-500 hover:text-gray-700 mt-2">
                          返信
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Videos Section */}
        <div className="w-full mt-6 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">こんな動画も人気です</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedVideos
              .filter((v) => v.id !== videoId)
              .slice(0, 4)
              .map((popularVideo, index) => (
                <Link
                  key={popularVideo.id}
                  href={`/user-settings/movies/watch/${popularVideo.id}`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
                    {/* Thumbnail */}
                    <div className="relative w-full h-40 bg-gray-200">
                      {popularVideo.thumbnailUrl ? (
                        <Image
                          src={popularVideo.thumbnailUrl}
                          alt={popularVideo.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="font-bold text-sm line-clamp-2 mb-2 text-gray-900 group-hover:text-[#FF0066] transition-colors">
                        {popularVideo.title}
                      </h3>

                      {/* Creator */}
                      <p className="text-xs text-gray-600 mb-2">
                        {popularVideo.owner?.name || 'Meat Dept.'}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <span>
                          視聴回数：{popularVideo.viewCount?.toLocaleString() || '150,000'}
                        </span>
                        <span>•</span>
                        <span>{formatDate(popularVideo.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchVideoPage
