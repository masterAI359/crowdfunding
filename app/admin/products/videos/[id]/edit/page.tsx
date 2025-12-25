'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getVideoById, updateAdminVideo } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'
import { SmartImage } from '@/app/utils/image-helper'

interface Video {
  id: string
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  price: number
  purchaseCount?: number
  netProfit?: number
  viewCount?: number
  isVisible: boolean
  owner?: {
    id: string
    email?: string
  }
}

export default function VideoEditPage() {
  const router = useRouter()
  const params = useParams()
  const videoId = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [video, setVideo] = useState<Video | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    thumbnailUrl: '',
    price: 0,
    isVisible: true,
    totalSupportAmount: 0,
    commentsEnabled: true,
  })

  useEffect(() => {
    if (videoId) {
      loadVideo()
    }
  }, [videoId])

  const loadVideo = async () => {
    try {
      setLoading(true)
      const data = await getVideoById(videoId)
      setVideo(data)
      setFormData({
        title: data.title || '',
        description: data.description || '',
        url: data.url || '',
        thumbnailUrl: data.thumbnailUrl || '',
        price: data.price || 0,
        isVisible: data.isVisible !== undefined ? data.isVisible : true,
        totalSupportAmount:
          data.totalSupportAmount !== undefined && data.totalSupportAmount !== null
            ? data.totalSupportAmount
            : data.netProfit || 0,
        commentsEnabled: data.commentsEnabled !== undefined ? data.commentsEnabled : true,
      })
    } catch (error) {
      console.error('Failed to load video:', error)
      alert('動画の読み込みに失敗しました')
      router.back()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoId) return

    try {
      setSaving(true)
      await updateAdminVideo(videoId, {
        title: formData.title,
        description: formData.description || undefined,
        url: formData.url,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        price: formData.price,
        isVisible: formData.isVisible,
        commentsEnabled: formData.commentsEnabled,
        totalSupportAmount: formData.totalSupportAmount || undefined,
      })
      alert('動画情報を更新しました')
      router.push('/admin/products/videos')
    } catch (error) {
      console.error('Failed to update video:', error)
      alert('動画の更新に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/products/videos')
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">動画が見つかりません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">動画を編集</h1>
          <p className="text-gray-600">動画の情報を編集できます</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Video Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">プレビュー</label>
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video max-w-md">
              {formData.thumbnailUrl ? (
                <SmartImage
                  src={formData.thumbnailUrl}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                  width={640}
                  height={360}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  サムネイルなし
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              placeholder="動画のタイトルを入力"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              説明
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              placeholder="動画の説明を入力"
            />
          </div>

          {/* Video URL */}
          <div className="mb-6">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              動画URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              placeholder="https://example.com/video.mp4"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="mb-6">
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-2">
              サムネイルURL
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              価格（円）
            </label>
            <input
              type="number"
              id="price"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              placeholder="0"
            />
          </div>

          {/* Total Support Amount */}
          <div className="mb-6">
            <label
              htmlFor="totalSupportAmount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              現在の総支援額（円）
            </label>
            <input
              type="number"
              id="totalSupportAmount"
              min="0"
              value={formData.totalSupportAmount}
              onChange={(e) =>
                setFormData({ ...formData, totalSupportAmount: parseInt(e.target.value) || 0 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              placeholder="0"
            />
            <p className="mt-1 text-sm text-gray-500">管理者が手動で設定できる総支援額です</p>
          </div>

          {/* Visibility Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">公開ステータス</label>
            <select
              value={formData.isVisible ? 'VISIBLE' : 'DRAFT'}
              onChange={(e) =>
                setFormData({ ...formData, isVisible: e.target.value === 'VISIBLE' })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
            >
              <option value="VISIBLE">公開中</option>
              <option value="DRAFT">下書き</option>
            </select>
          </div>

          {/* Comments Enabled */}
          <div className="mb-6">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.commentsEnabled}
                onChange={(e) => setFormData({ ...formData, commentsEnabled: e.target.checked })}
                className="w-5 h-5 text-[#FF0066] border-gray-300 rounded focus:ring-[#FF0066]"
              />
              <span className="text-sm font-medium text-gray-700">コメントを有効にする</span>
            </label>
            <p className="mt-1 text-sm text-gray-500 ml-8">
              この動画へのコメントを有効または無効にします
            </p>
          </div>

          {/* Video Stats (Read-only) */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">統計情報</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">視聴回数</p>
                <p className="text-lg font-semibold text-gray-900">{video.viewCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">購入数</p>
                <p className="text-lg font-semibold text-gray-900">{video.purchaseCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">純利益</p>
                <p className="text-lg font-semibold text-gray-900">
                  ¥{(video.netProfit || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">所有者</p>
                <p className="text-sm font-medium text-gray-900">{video.owner?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
