'use client'
import React, { useState, useEffect } from 'react'
import {
  getAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoStats,
  getVideoComments,
  hideVideoComment,
  showVideoComment,
  uploadFiles,
} from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'
import Image from 'next/image'

export default function AdminReleaseVideoPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingVideo, setEditingVideo] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '' })
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    url: '',
    thumbnailUrl: '',
    price: '',
  })
  const [showSeriesModal, setShowSeriesModal] = useState(false)
  const [selectedVideoForSeries, setSelectedVideoForSeries] = useState<string | null>(null)
  const [seriesForm, setSeriesForm] = useState({
    seriesName: '',
    selectedVideos: [] as string[],
  })
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [videoComments, setVideoComments] = useState<any[]>([])
  const [videoStats, setVideoStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadVideos()
  }, [searchQuery])

  const loadVideos = async () => {
    setLoading(true)
    try {
      const data = await getAdminVideos(1, 100, searchQuery || undefined)
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Failed to load videos:', error)
      alert('動画の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (video: any) => {
    setEditingVideo(video.id)
    setEditForm({
      title: video.title,
      description: video.description || '',
      price: video.price?.toString() || '0',
    })
  }

  const handleSave = async (videoId: string) => {
    try {
      await updateVideo(videoId, {
        title: editForm.title,
        description: editForm.description,
        price: editForm.price ? parseInt(editForm.price) : undefined,
      })
      setEditingVideo(null)
      loadVideos()
    } catch (error) {
      console.error('Failed to update video:', error)
      alert('動画の更新に失敗しました')
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('本当にこの動画を削除しますか？')) return
    try {
      await deleteVideo(videoId)
      loadVideos()
    } catch (error) {
      console.error('Failed to delete video:', error)
      alert('動画の削除に失敗しました')
    }
  }

  const handleToggleVisibility = async (video: any) => {
    try {
      await updateVideo(video.id, { isVisible: !video.isVisible })
      loadVideos()
    } catch (error) {
      console.error('Failed to update video visibility:', error)
      alert('動画の表示設定の更新に失敗しました')
    }
  }

  const handleFileSelect = (type: 'video' | 'thumbnail', file: File | null) => {
    if (type === 'video') {
      setSelectedVideoFile(file)
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setVideoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setVideoPreview(null)
      }
    } else {
      setSelectedThumbnailFile(file)
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setThumbnailPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setThumbnailPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.title) {
      alert('タイトルを入力してください')
      return
    }

    if (!selectedVideoFile) {
      alert('動画ファイルを選択してください')
      return
    }

    try {
      setIsUploading(true)
      let videoUrl = ''
      let thumbnailUrl = ''

      const filesToUpload: File[] = []
      if (selectedVideoFile) filesToUpload.push(selectedVideoFile)
      if (selectedThumbnailFile) filesToUpload.push(selectedThumbnailFile)

      const uploadResult = await uploadFiles(filesToUpload)
      const uploadedFiles = uploadResult.files || []

      uploadedFiles.forEach((file: any) => {
        if (file.mimetype.startsWith('video/')) {
          videoUrl = file.url
        } else if (file.mimetype.startsWith('image/')) {
          thumbnailUrl = file.url
        }
      })

      if (!videoUrl || videoUrl.trim() === '') {
        alert('動画ファイルのアップロードに失敗しました')
        setIsUploading(false)
        return
      }

      const videoData: {
        title: string
        description?: string
        url: string
        thumbnailUrl?: string
        price?: number
      } = {
        title: uploadForm.title,
        description: uploadForm.description || undefined,
        url: videoUrl,
        price: uploadForm.price ? parseInt(uploadForm.price) : 0,
      }

      if (thumbnailUrl && thumbnailUrl.trim() !== '') {
        videoData.thumbnailUrl = thumbnailUrl
      }

      await createVideo(videoData)

      setShowUploadModal(false)
      setUploadForm({ title: '', description: '', url: '', thumbnailUrl: '', price: '' })
      setSelectedVideoFile(null)
      setSelectedThumbnailFile(null)
      setVideoPreview(null)
      setThumbnailPreview(null)
      loadVideos()
    } catch (error: any) {
      console.error('Failed to upload video:', error)
      alert(error.response?.data?.message || '動画のアップロードに失敗しました')
    } finally {
      setIsUploading(false)
    }
  }

  const loadVideoDetails = async (videoId: string) => {
    try {
      const [comments, stats] = await Promise.all([
        getVideoComments(videoId),
        getVideoStats(videoId),
      ])
      setVideoComments(comments || [])
      setVideoStats(stats)
    } catch (error) {
      console.error('Failed to load video details:', error)
    }
  }

  const handleToggleCommentVisibility = async (commentId: string, isHidden: boolean) => {
    try {
      if (isHidden) {
        await showVideoComment(commentId)
      } else {
        await hideVideoComment(commentId)
      }
      if (selectedVideo) {
        loadVideoDetails(selectedVideo)
      }
    } catch (error) {
      console.error('Failed to toggle comment visibility:', error)
      alert('コメントの表示設定の更新に失敗しました')
    }
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">動画コンテンツ管理</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors"
          >
            動画をアップロード
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="動画を検索..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {videos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                動画がありません。新しい動画をアップロードしてください。
              </div>
            ) : (
              videos.map((video) => (
                <div key={video.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                      {video.thumbnailUrl ? (
                        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1">
                      {editingVideo === video.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                            placeholder="タイトル"
                          />
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                            placeholder="説明文"
                            rows={3}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              価格（円）
                            </label>
                            <input
                              type="number"
                              value={editForm.price}
                              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(video.id)}
                              className="px-4 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C]"
                            >
                              保存
                            </button>
                            <button
                              onClick={() => setEditingVideo(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              キャンセル
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                          <p className="text-sm text-gray-800 mb-4">{video.description || '説明なし'}</p>
                          <div className="mb-4">
                            <span className="text-sm text-gray-500">価格: </span>
                            <span className="text-lg font-semibold text-gray-900">
                              {video.price ? `¥${video.price.toLocaleString()}` : '無料'}
                            </span>
                          </div>

                          {/* Statistics */}
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">視聴回数</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {video.viewCount?.toLocaleString() || 0}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">購入数</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {video.purchaseCount?.toLocaleString() || 0}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">アクセス数</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {video.accessCount?.toLocaleString() || 0}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">コメント数</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {video.commentCount?.toLocaleString() || 0}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(video)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleToggleVisibility(video)}
                              className={`px-4 py-2 rounded-lg ${
                                video.isVisible
                                  ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                                  : 'bg-green-200 text-green-800 hover:bg-green-300'
                              }`}
                            >
                              {video.isVisible ? '非表示' : '表示'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVideo(video.id)
                                loadVideoDetails(video.id)
                              }}
                              className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300"
                            >
                              コメント確認
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVideoForSeries(video.id)
                                setSeriesForm({
                                  seriesName: '',
                                  selectedVideos: [video.id],
                                })
                                setShowSeriesModal(true)
                              }}
                              className="px-4 py-2 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300"
                            >
                              シリーズ設定
                            </button>
                            <button
                              onClick={() => handleDelete(video.id)}
                              className="px-4 py-2 bg-red-200 text-red-800 rounded-lg hover:bg-red-300"
                            >
                              削除
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">動画をアップロード</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">タイトル *</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  placeholder="動画のタイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">説明文</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  rows={4}
                  placeholder="動画の説明を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">価格（円）</label>
                <input
                  type="number"
                  value={uploadForm.price}
                  onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  placeholder="0（無料の場合）"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">0を入力すると無料になります</p>
              </div>

              {/* Video Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">動画ファイル *</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect('video', e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  />
                  {videoPreview && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <video src={videoPreview} controls className="w-full h-full object-contain" />
                    </div>
                  )}
                  {selectedVideoFile && (
                    <p className="text-sm text-gray-800">
                      選択中: {selectedVideoFile.name} ({(selectedVideoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">サムネイル画像</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect('thumbnail', e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  />
                  {thumbnailPreview && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {selectedThumbnailFile && (
                    <p className="text-sm text-gray-800">
                      選択中: {selectedThumbnailFile.name} ({(selectedThumbnailFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadForm({ title: '', description: '', url: '', thumbnailUrl: '', price: '' })
                  setSelectedVideoFile(null)
                  setSelectedThumbnailFile(null)
                  setVideoPreview(null)
                  setThumbnailPreview(null)
                }}
                disabled={isUploading}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading && <LoadingSpinner size="sm" className="text-white" />}
                {isUploading ? 'アップロード中...' : 'アップロード'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">コメント一覧</h2>
              <button
                onClick={() => {
                  setSelectedVideo(null)
                  setVideoComments([])
                  setVideoStats(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {videoStats && (
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">視聴回数</div>
                  <div className="text-lg font-semibold">
                    {videoStats.viewCount?.toLocaleString() || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">購入数</div>
                  <div className="text-lg font-semibold">
                    {videoStats.purchaseCount?.toLocaleString() || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">アクセス数</div>
                  <div className="text-lg font-semibold">
                    {videoStats.accessCount?.toLocaleString() || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">コメント数</div>
                  <div className="text-lg font-semibold">
                    {videoComments.length.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {videoComments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">コメントがありません</div>
              ) : (
                videoComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg border ${
                      comment.isHidden ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {comment.user?.name || comment.user?.email || '匿名ユーザー'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString('ja-JP')}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleCommentVisibility(comment.id, comment.isHidden)}
                        className={`px-3 py-1 rounded text-sm ${
                          comment.isHidden
                            ? 'bg-green-200 text-green-800 hover:bg-green-300'
                            : 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                        }`}
                      >
                        {comment.isHidden ? '表示' : '非表示'}
                      </button>
                    </div>
                    <div className={`text-gray-800 ${comment.isHidden ? 'opacity-50' : ''}`}>
                      {comment.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Series Management Modal */}
      {showSeriesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">シリーズ設定</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  シリーズ名
                </label>
                <input
                  type="text"
                  value={seriesForm.seriesName}
                  onChange={(e) => setSeriesForm({ ...seriesForm, seriesName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  placeholder="例: 基礎講座シリーズ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  シリーズに含める動画を選択
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {videos.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">動画がありません</p>
                  ) : (
                    <div className="space-y-2">
                      {videos.map((video) => (
                        <label
                          key={video.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={seriesForm.selectedVideos.includes(video.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSeriesForm({
                                  ...seriesForm,
                                  selectedVideos: [...seriesForm.selectedVideos, video.id],
                                })
                              } else {
                                setSeriesForm({
                                  ...seriesForm,
                                  selectedVideos: seriesForm.selectedVideos.filter((id) => id !== video.id),
                                })
                              }
                            }}
                            className="h-4 w-4 text-[#FF0066] rounded focus:ring-[#FF0066]"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{video.title}</div>
                            <div className="text-sm text-gray-500">
                              {video.price ? `¥${video.price.toLocaleString()}` : '無料'}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowSeriesModal(false)
                  setSelectedVideoForSeries(null)
                  setSeriesForm({ seriesName: '', selectedVideos: [] })
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  if (!seriesForm.seriesName.trim()) {
                    alert('シリーズ名を入力してください')
                    return
                  }
                  if (seriesForm.selectedVideos.length < 2) {
                    alert('シリーズには2つ以上の動画を選択してください')
                    return
                  }
                  // TODO: Implement series save functionality
                  // For now, just show an alert
                  alert(
                    `シリーズ「${seriesForm.seriesName}」に${seriesForm.selectedVideos.length}本の動画を設定しました。\n\n注意: シリーズ機能の完全な実装には、データベースモデルの追加が必要です。`
                  )
                  setShowSeriesModal(false)
                  setSelectedVideoForSeries(null)
                  setSeriesForm({ seriesName: '', selectedVideos: [] })
                }}
                className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C]"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

