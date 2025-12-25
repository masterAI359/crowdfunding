'use client'
import React, { useState, useEffect } from 'react'
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
  uploadFiles,
} from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'
import Image from 'next/image'

export default function AdminReleaseCrowdfundingPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    endDate: '',
    medias: [] as Array<{ url: string; type: 'IMAGE'; order: number }>,
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    goalAmount: '',
    endDate: '',
    medias: [] as Array<{ url: string; type: 'IMAGE'; order: number }>,
    returns: [] as Array<{
      title: string
      amount: string
      description?: string
      notes?: string
      stock?: string
      order?: number
      isVisible?: boolean
      imageUrl?: string
    }>,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProjects()
  }, [searchQuery])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const data = await getAdminProjects(1, 100, searchQuery || undefined)
      setProjects(data.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
      alert('プロジェクトの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project: any) => {
    setEditingProject(project.id)
    setEditForm({
      title: project.title,
      description: project.description || '',
      goalAmount: project.goalAmount.toString(),
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      medias: project.medias || [],
    })
  }

  const handleSave = async (projectId: string) => {
    if (!editForm.title || !editForm.goalAmount || !editForm.endDate) {
      alert('タイトル、目標金額、終了日は必須です')
      return
    }

    try {
      setIsSubmitting(true)
      await updateProject(projectId, {
        title: editForm.title,
        description: editForm.description || undefined,
        goalAmount: parseInt(editForm.goalAmount),
        endDate: editForm.endDate,
        medias: editForm.medias.length > 0 ? editForm.medias : undefined,
      })
      setEditingProject(null)
      loadProjects()
    } catch (error: any) {
      console.error('Failed to update project:', error)
      alert(error.response?.data?.message || 'プロジェクトの更新に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('本当にこのプロジェクトを削除しますか？')) return
    try {
      await deleteProject(projectId)
      loadProjects()
    } catch (error: any) {
      console.error('Failed to delete project:', error)
      alert(error.response?.data?.message || 'プロジェクトの削除に失敗しました')
    }
  }

  const handlePublish = async (projectId: string) => {
    if (!confirm('このプロジェクトを公開しますか？')) return
    try {
      await publishProject(projectId)
      loadProjects()
      alert('プロジェクトを公開しました')
    } catch (error: any) {
      console.error('Failed to publish project:', error)
      alert(error.response?.data?.message || 'プロジェクトの公開に失敗しました')
    }
  }

  const handleCreate = async () => {
    if (!createForm.title || !createForm.goalAmount || !createForm.endDate) {
      alert('タイトル、目標金額、終了日は必須です')
      return
    }

    try {
      setIsSubmitting(true)
      await createProject({
        title: createForm.title,
        description: createForm.description || undefined,
        goalAmount: parseInt(createForm.goalAmount),
        endDate: createForm.endDate,
        status: 'DRAFT',
        medias: createForm.medias.length > 0 ? createForm.medias : undefined,
        returns:
          createForm.returns.length > 0
            ? createForm.returns.map((ret, index) => ({
                title: ret.title,
                amount: parseInt(ret.amount) || 0,
                description: ret.description || undefined,
                notes: ret.notes || undefined,
                stock: ret.stock ? parseInt(ret.stock) : null,
                order: ret.order !== undefined ? ret.order : index,
                isVisible: ret.isVisible !== undefined ? ret.isVisible : true,
                imageUrl: ret.imageUrl || undefined,
              }))
            : undefined,
      })
      setShowCreateModal(false)
      setCreateForm({
        title: '',
        description: '',
        goalAmount: '',
        endDate: '',
        medias: [],
        returns: [],
      })
      loadProjects()
    } catch (error: any) {
      console.error('Failed to create project:', error)
      alert(error.response?.data?.message || 'プロジェクトの作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMediaFileSelect = async (
    formType: 'edit' | 'create',
    file: File | null
  ) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    try {
      setUploadingMedia(true)
      const uploadResult = await uploadFiles([file])
      const uploadedFiles = uploadResult.files || []

      if (uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[0]
        const mediaUrl = uploadedFile.url

        if (formType === 'edit') {
          setEditForm({
            ...editForm,
            medias: [
              ...editForm.medias,
              { url: mediaUrl, type: 'IMAGE', order: editForm.medias.length },
            ],
          })
        } else {
          setCreateForm({
            ...createForm,
            medias: [
              ...createForm.medias,
              { url: mediaUrl, type: 'IMAGE', order: createForm.medias.length },
            ],
          })
        }
      } else {
        alert('ファイルのアップロードに失敗しました')
      }
    } catch (error: any) {
      console.error('Failed to upload media:', error)
      alert(error.response?.data?.message || 'ファイルのアップロードに失敗しました')
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleReturnImageUpload = async (returnIndex: number, file: File | null) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    try {
      setUploadingMedia(true)
      const uploadResult = await uploadFiles([file])
      const uploadedFiles = uploadResult.files || []

      if (uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[0]
        const imageUrl = uploadedFile.url
        updateReturn(returnIndex, 'imageUrl', imageUrl)
      } else {
        alert('ファイルのアップロードに失敗しました')
      }
    } catch (error: any) {
      console.error('Failed to upload return image:', error)
      alert(error.response?.data?.message || 'ファイルのアップロードに失敗しました')
    } finally {
      setUploadingMedia(false)
    }
  }

  const removeMedia = (formType: 'edit' | 'create', index: number) => {
    if (formType === 'edit') {
      setEditForm({
        ...editForm,
        medias: editForm.medias.filter((_, i) => i !== index),
      })
    } else {
      setCreateForm({
        ...createForm,
        medias: createForm.medias.filter((_, i) => i !== index),
      })
    }
  }

  const addReturn = () => {
    setCreateForm({
      ...createForm,
      returns: [
        ...createForm.returns,
        {
          title: '',
          amount: '',
          description: '',
          notes: '',
          stock: '',
          order: createForm.returns.length,
          isVisible: true,
          imageUrl: '',
        },
      ],
    })
  }

  const updateReturn = (index: number, field: string, value: any) => {
    const updatedReturns = [...createForm.returns]
    updatedReturns[index] = {
      ...updatedReturns[index],
      [field]: value,
    }
    setCreateForm({
      ...createForm,
      returns: updatedReturns,
    })
  }

  const removeReturn = (index: number) => {
    setCreateForm({
      ...createForm,
      returns: createForm.returns
        .filter((_, i) => i !== index)
        .map((ret, i) => ({
          ...ret,
          order: i,
        })),
    })
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">クラウドファンディング管理</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors"
          >
            プロジェクトを作成
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="プロジェクトを検索..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                プロジェクトがありません。新しいプロジェクトを作成してください。
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  {editingProject === project.id ? (
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
                        rows={4}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            目標金額（円）
                          </label>
                          <input
                            type="number"
                            value={editForm.goalAmount}
                            onChange={(e) => setEditForm({ ...editForm, goalAmount: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                            placeholder="1000000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            終了日
                          </label>
                          <input
                            type="date"
                            value={editForm.endDate}
                            onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          メディア（画像）
                        </label>
                        <div className="space-y-2 mb-2">
                          <label className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] || null
                                if (file) {
                                  handleMediaFileSelect('edit', file)
                                }
                                e.target.value = ''
                              }}
                              disabled={uploadingMedia}
                            />
                            {uploadingMedia ? 'アップロード中...' : '画像をアップロード'}
                          </label>
                        </div>
                        <div className="space-y-2">
                          {editForm.medias.map((media, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm text-gray-600 flex-1 truncate">
                                {media.url.length > 50 ? `${media.url.substring(0, 50)}...` : media.url}
                              </span>
                              <button
                                onClick={() => removeMedia('edit', index)}
                                className="ml-auto text-red-600 hover:text-red-800 text-sm"
                              >
                                削除
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(project.id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] disabled:opacity-50"
                        >
                          {isSubmitting ? '保存中...' : '保存'}
                        </button>
                        <button
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-6">
                        {project.image && (
                          <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                            <Image src={project.image} alt={project.title} fill className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{project.description || '説明なし'}</p>
                          <div className="grid grid-cols-4 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-500">目標金額</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrency(project.goalAmount)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">調達金額</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrency(project.totalAmount || 0)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">支援者数</div>
                              <div className="text-lg font-semibold text-gray-900">
                                {project.supporterCount || 0}人
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">ステータス</div>
                              <div className="text-lg font-semibold text-gray-900">{project.status}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                            >
                              編集
                            </button>
                            {project.status === 'DRAFT' && (
                              <button
                                onClick={() => handlePublish(project.id)}
                                className="px-4 py-2 bg-green-200 text-green-800 rounded-lg hover:bg-green-300"
                              >
                                公開
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="px-4 py-2 bg-red-200 text-red-800 rounded-lg hover:bg-red-300"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">プロジェクトを作成</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">タイトル *</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  placeholder="プロジェクトのタイトル"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">説明文</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  rows={4}
                  placeholder="プロジェクトの説明"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目標金額（円） *</label>
                  <input
                    type="number"
                    value={createForm.goalAmount}
                    onChange={(e) => setCreateForm({ ...createForm, goalAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                    placeholder="1000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">終了日 *</label>
                  <input
                    type="date"
                    value={createForm.endDate}
                    onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メディア（画像）</label>
                <div className="mb-2">
                  <label className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        if (file) {
                          handleMediaFileSelect('create', file)
                        }
                        e.target.value = ''
                      }}
                      disabled={uploadingMedia}
                    />
                    {uploadingMedia ? 'アップロード中...' : '画像をアップロード'}
                  </label>
                </div>
                <div className="space-y-2">
                  {createForm.medias.map((media, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600 flex-1 truncate">
                        {media.url.length > 50 ? `${media.url.substring(0, 50)}...` : media.url}
                      </span>
                      <button
                        onClick={() => removeMedia('create', index)}
                        className="ml-auto text-red-600 hover:text-red-800 text-sm"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Returns/Rewards Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    リターン（報酬）
                  </label>
                  <button
                    type="button"
                    onClick={addReturn}
                    className="px-3 py-1 text-sm bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C]"
                  >
                    + リターンを追加
                  </button>
                </div>
                <div className="space-y-4">
                  {createForm.returns.map((returnItem, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">リターン {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeReturn(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          削除
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            タイトル *
                          </label>
                          <input
                            type="text"
                            value={returnItem.title}
                            onChange={(e) => updateReturn(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                            placeholder="例: 【お礼のメッセージ動画】"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              金額（円） *
                            </label>
                            <input
                              type="number"
                              value={returnItem.amount}
                              onChange={(e) => updateReturn(index, 'amount', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                              placeholder="5000"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              在庫数（空欄で無制限）
                            </label>
                            <input
                              type="number"
                              value={returnItem.stock}
                              onChange={(e) => updateReturn(index, 'stock', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                              placeholder="100"
                              min="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            説明
                          </label>
                          <textarea
                            value={returnItem.description || ''}
                            onChange={(e) => updateReturn(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                            rows={2}
                            placeholder="リターンの詳細説明"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            備考・注意点
                          </label>
                          <textarea
                            value={returnItem.notes || ''}
                            onChange={(e) => updateReturn(index, 'notes', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                            rows={2}
                            placeholder="支援者様への注意事項など"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            画像（任意）
                          </label>
                          <div className="space-y-2">
                            <label className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer inline-block">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null
                                  if (file) {
                                    handleReturnImageUpload(index, file)
                                  }
                                  e.target.value = ''
                                }}
                                disabled={uploadingMedia}
                              />
                              {uploadingMedia ? 'アップロード中...' : '画像をアップロード'}
                            </label>
                            <p className="text-xs text-gray-500">または</p>
                            <input
                              type="url"
                              value={returnItem.imageUrl || ''}
                              onChange={(e) => updateReturn(index, 'imageUrl', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                              placeholder="画像URLを入力（例: https://example.com/image.jpg）"
                            />
                            {returnItem.imageUrl && (
                              <div className="mt-2">
                                <img
                                  src={returnItem.imageUrl}
                                  alt="Return preview"
                                  className="max-w-full h-32 object-contain rounded border border-gray-300"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`return-visible-${index}`}
                            checked={returnItem.isVisible !== false}
                            onChange={(e) => updateReturn(index, 'isVisible', e.target.checked)}
                            className="h-4 w-4 text-[#FF0066] rounded focus:ring-[#FF0066]"
                          />
                          <label
                            htmlFor={`return-visible-${index}`}
                            className="ml-2 text-xs text-gray-700"
                          >
                            公開する
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                  {createForm.returns.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      リターンがありません。追加ボタンでリターンを追加できます。
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateForm({
                    title: '',
                    description: '',
                    goalAmount: '',
                    endDate: '',
                    medias: [],
                    returns: [],
                  })
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreate}
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] disabled:opacity-50"
              >
                {isSubmitting ? '作成中...' : '作成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

