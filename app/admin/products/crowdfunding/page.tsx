'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getAdminProjects,
  getAdminCrowdfundingStats,
  updateProject,
  deleteProject,
} from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'
import Image from 'next/image'
import { SmartImage } from '@/app/utils/image-helper'
import { SlMagnifier } from 'react-icons/sl'

interface Project {
  id: string
  title: string
  description?: string
  goalAmount: number
  endDate: string
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  totalAmount?: number
  supporterCount?: number
  medias?: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; order: number }>
  owner?: {
    id: string
    email?: string
  }
}

interface CrowdfundingStats {
  purchases30Days: number
  netRevenue30Days: number
  netRevenueAllTime: number
}

export default function CrowdfundingProductsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'projects' | 'returns'>('projects')
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<CrowdfundingStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null)
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        loadProjects()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadProjects(), loadStats()])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    try {
      const response = await getAdminProjects(1, 100, searchQuery || undefined)
      setProjects(response.projects || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
      // Fallback: try using regular getProjects if admin endpoint doesn't exist
      try {
        const { getProjects } = await import('@/app/lib/api')
        const response = await getProjects(1, 100)
        setProjects(response.projects || [])
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  const loadStats = async () => {
    try {
      const response = await getAdminCrowdfundingStats()
      setStats(response)
    } catch (error) {
      console.error('Failed to load stats:', error)
      // Fallback: use dashboard stats
      try {
        const { getAdminDashboardStats } = await import('@/app/lib/api')
        const dashboardStats = await getAdminDashboardStats('30days')
        setStats({
          purchases30Days: dashboardStats.crowdfundingPurchases30Days || 0,
          netRevenue30Days: dashboardStats.crowdfundingPurchases30Days || 0,
          netRevenueAllTime: dashboardStats.overallNetProfit || 0,
        })
      } catch (fallbackError) {
        console.error('Fallback stats also failed:', fallbackError)
        // Set default stats
        setStats({
          purchases30Days: 0,
          netRevenue30Days: 0,
          netRevenueAllTime: 0,
        })
      }
    }
  }

  const handleStatusChange = async (projectId: string, newStatus: 'DRAFT' | 'ACTIVE') => {
    setIsUpdatingStatus(projectId)
    try {
      await updateProject(projectId, { status: newStatus })
      await loadProjects()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('ステータスの更新に失敗しました')
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  const handlePreview = (projectId: string) => {
    window.open(`/crowdfunding/${projectId}`, '_blank')
  }

  const handleCopyLink = async (projectId: string) => {
    const link = `${window.location.origin}/crowdfunding/${projectId}`
    try {
      await navigator.clipboard.writeText(link)
      alert('リンクをコピーしました')
    } catch (error) {
      console.error('Failed to copy link:', error)
      alert('リンクのコピーに失敗しました')
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('このプロジェクトを削除してもよろしいですか？')) {
      return
    }
    try {
      await deleteProject(projectId)
      await loadProjects()
      alert('プロジェクトを削除しました')
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('プロジェクトの削除に失敗しました')
    }
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ja-JP')}円`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
  }

  const getProjectImage = (project: Project) => {
    if (project.medias && project.medias.length > 0) {
      const firstImage = project.medias.find((m) => m.type === 'IMAGE')
      if (firstImage) return firstImage.url
    }
    return '/assets/crowdfunding/cf-1.png'
  }

  if (loading && !stats) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">クラウドファンディング</h1>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">購入数 過去30日間</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.purchases30Days?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">純収益 過去30日間</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.netRevenue30Days ? formatCurrency(stats.netRevenue30Days) : '0円'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">純収益 オールタイム</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.netRevenueAllTime ? formatCurrency(stats.netRevenueAllTime) : '0円'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'projects'
                    ? 'border-b-2 border-[#FF0066] text-[#FF0066]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                プロジェクト
              </button>
              <button
                onClick={() => setActiveTab('returns')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'returns'
                    ? 'border-b-2 border-[#FF0066] text-[#FF0066]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                リターン
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'projects' ? (
              <div>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="検索"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066] pl-8"
                    />
                    <SlMagnifier className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                {/* Projects Table */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                            プロジェクト
                          </th>
                          <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                            調達金額
                          </th>
                          <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                            参加人数
                          </th>
                          <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                            締切日
                          </th>
                          <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                            ステータス
                          </th>
                          <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                            アクション
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              プロジェクトが見つかりません
                            </td>
                          </tr>
                        ) : (
                          projects.map((project) => (
                            <tr
                              key={project.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative rounded overflow-hidden flex-shrink-0">
                                    <SmartImage
                                      src={getProjectImage(project)}
                                      alt={project.title}
                                      className="border-radius-[4.53px]"
                                      width={125}
                                      height={68.24925994873047}
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[16px] font-weight-[400] line-height-[140%] vertical-align-middle text-gray-900 truncate">
                                      {project.title}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-[18px] font-weight-[400] line-height-[140%] vertical-align-middle text-gray-900">
                                  ¥{project.totalAmount?.toLocaleString() || 0}
                                </p>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-[18px] font-weight-[400] line-height-[140%] vertical-align-middle text-gray-900">
                                  {project.supporterCount || 0}人
                                </p>
                              </td>
                              <td className="py-4 px-4">
                                <p className="text-[18px] font-weight-[400] line-height-[140%] vertical-align-middle text-gray-900">
                                  {formatDate(project.endDate)}
                                </p>
                              </td>
                              <td className="py-4 px-4">
                                <select
                                  value={project.status === 'ACTIVE' ? 'ACTIVE' : 'DRAFT'}
                                  onChange={(e) => {
                                    const newStatus = e.target.value as 'DRAFT' | 'ACTIVE'
                                    handleStatusChange(project.id, newStatus)
                                  }}
                                  disabled={isUpdatingStatus === project.id}
                                  className="bg-[#ECFBF1] text-[15px] font-weight-[400] line-height-[140%] vertical-align-middle border border-gray-300 rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FF0066] disabled:opacity-50"
                                >
                                  <option value="ACTIVE">Published</option>
                                  <option value="DRAFT">Draft</option>
                                </select>
                                {isUpdatingStatus === project.id && (
                                  <span className="ml-2 text-xs text-gray-500">更新中...</span>
                                )}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  {/* Copy Link Button */}
                                  <button
                                    onClick={() => handleCopyLink(project.id)}
                                    className="p-2 text-gray-600 hover:text-[#FF0066] hover:bg-gray-100 rounded transition-colors"
                                    title="ページのリンクをコピー"
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M14.8279 12.0004L16.2429 13.4144L19.0709 10.5864C19.8211 9.83625 20.2425 8.81881 20.2425 7.75792C20.2425 6.69702 19.8211 5.67958 19.0709 4.92942C18.6995 4.55797 18.2585 4.26333 17.7732 4.0623C17.2879 3.86128 16.7677 3.75781 16.2424 3.75781C15.1815 3.75781 14.1641 4.17925 13.4139 4.92942L10.5859 7.75742L11.9999 9.17242L14.8279 6.34342C15.2031 5.96827 15.7119 5.75751 16.2424 5.75751C16.773 5.75751 17.2818 5.96827 17.6569 6.34342C18.0321 6.71856 18.2428 7.22738 18.2428 7.75792C18.2428 8.28846 18.0321 8.79727 17.6569 9.17242L14.8279 12.0004ZM11.9999 14.8294L13.4139 16.2434L10.5859 19.0714C9.83576 19.8216 8.81832 20.243 7.75743 20.243C6.69653 20.243 5.67909 19.8216 4.92893 19.0714C4.17876 18.3212 3.75732 17.3038 3.75732 16.2429C3.75732 15.182 4.17876 14.1646 4.92893 13.4144L7.75693 10.5864L9.17193 12.0004L6.34293 14.8294C5.96791 15.2046 5.75728 15.7133 5.75738 16.2438C5.75747 16.7742 5.96828 17.2829 6.34343 17.6579C6.71858 18.0329 7.22733 18.2436 7.75778 18.2435C8.28823 18.2434 8.79691 18.0326 9.17193 17.6574L11.9999 14.8294Z"
                                        fill="black"
                                      />
                                      <path
                                        d="M14.829 10.587C15.0166 10.3993 15.122 10.1448 15.122 9.87946C15.122 9.6141 15.0166 9.3596 14.829 9.17196C14.6413 8.98432 14.3869 8.87891 14.1215 8.87891C13.8561 8.87891 13.6016 8.98432 13.414 9.17196L9.17199 13.415C9.07648 13.5072 9.0003 13.6176 8.94789 13.7396C8.89548 13.8616 8.86789 13.9928 8.86674 14.1256C8.86558 14.2583 8.89088 14.39 8.94117 14.5129C8.99145 14.6358 9.0657 14.7475 9.15959 14.8414C9.25348 14.9352 9.36514 15.0095 9.48803 15.0598C9.61093 15.1101 9.74261 15.1354 9.87539 15.1342C10.0082 15.1331 10.1394 15.1055 10.2614 15.0531C10.3834 15.0007 10.4937 14.9245 10.586 14.829L14.829 10.587Z"
                                        fill="black"
                                      />
                                    </svg>
                                  </button>
                                  {/* Preview Button */}
                                  <button
                                    onClick={() => handlePreview(project.id)}
                                    className="p-2 text-gray-600 hover:text-[#FF0066] hover:bg-gray-100 rounded transition-colors"
                                    title="ページをプレビュー"
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12 18C17.523 18 22 12 22 12C22 12 17.523 6 12 6C6.477 6 2 12 2 12C2 12 6.477 18 12 18Z"
                                        stroke="black"
                                        stroke-width="2"
                                        stroke-linejoin="round"
                                      />
                                      <path
                                        d="M12 14.5C12.663 14.5 13.2989 14.2366 13.7678 13.7678C14.2366 13.2989 14.5 12.663 14.5 12C14.5 11.337 14.2366 10.7011 13.7678 10.2322C13.2989 9.76339 12.663 9.5 12 9.5C11.337 9.5 10.7011 9.76339 10.2322 10.2322C9.76339 10.7011 9.5 11.337 9.5 12C9.5 12.663 9.76339 13.2989 10.2322 13.7678C10.7011 14.2366 11.337 14.5 12 14.5Z"
                                        stroke="black"
                                        stroke-width="2"
                                        stroke-linejoin="round"
                                      />
                                    </svg>
                                  </button>

                                  {/* Action Menu Button */}
                                  <div className="relative">
                                    <button
                                      onClick={() =>
                                        setActionMenuOpen(
                                          actionMenuOpen === project.id ? null : project.id
                                        )
                                      }
                                      className="p-2 text-gray-600 hover:text-[#FF0066] hover:bg-gray-100 rounded transition-colors"
                                      title="その他のアクション"
                                    >
                                      <svg
                                        width="17"
                                        height="17"
                                        viewBox="0 0 17 17"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M1.95956 16.0309C2.50637 16.0309 2.94964 15.5877 2.94964 15.0409C2.94964 14.4941 2.50637 14.0508 1.95956 14.0508C1.41276 14.0508 0.969482 14.4941 0.969482 15.0409C0.969482 15.5877 1.41276 16.0309 1.95956 16.0309Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M15.0401 2.94891C15.5869 2.94891 16.0302 2.50564 16.0302 1.95883C16.0302 1.41202 15.5869 0.96875 15.0401 0.96875C14.4933 0.96875 14.05 1.41202 14.05 1.95883C14.05 2.50564 14.4933 2.94891 15.0401 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M11.7704 2.94891C12.3172 2.94891 12.7604 2.50564 12.7604 1.95883C12.7604 1.41202 12.3172 0.96875 11.7704 0.96875C11.2235 0.96875 10.7803 1.41202 10.7803 1.95883C10.7803 2.50564 11.2235 2.94891 11.7704 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M8.50009 2.94891C9.0469 2.94891 9.49017 2.50564 9.49017 1.95883C9.49017 1.41202 9.0469 0.96875 8.50009 0.96875C7.95328 0.96875 7.51001 1.41202 7.51001 1.95883C7.51001 2.50564 7.95328 2.94891 8.50009 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M5.22983 2.94891C5.77663 2.94891 6.21991 2.50564 6.21991 1.95883C6.21991 1.41202 5.77663 0.96875 5.22983 0.96875C4.68302 0.96875 4.23975 1.41202 4.23975 1.95883C4.23975 2.50564 4.68302 2.94891 5.22983 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M1.95956 2.94891C2.50637 2.94891 2.94964 2.50564 2.94964 1.95883C2.94964 1.41202 2.50637 0.96875 1.95956 0.96875C1.41276 0.96875 0.969482 1.41202 0.969482 1.95883C0.969482 2.50564 1.41276 2.94891 1.95956 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M15.0401 16.0309C15.5869 16.0309 16.0302 15.5877 16.0302 15.0409C16.0302 14.4941 15.5869 14.0508 15.0401 14.0508C14.4933 14.0508 14.05 14.4941 14.05 15.0409C14.05 15.5877 14.4933 16.0309 15.0401 16.0309Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M15.0401 12.7614C15.5869 12.7614 16.0302 12.3181 16.0302 11.7713C16.0302 11.2245 15.5869 10.7812 15.0401 10.7812C14.4933 10.7812 14.05 11.2245 14.05 11.7713C14.05 12.3181 14.4933 12.7614 15.0401 12.7614Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M15.0401 9.49188C15.5869 9.49188 16.0302 9.0486 16.0302 8.5018C16.0302 7.95499 15.5869 7.51172 15.0401 7.51172C14.4933 7.51172 14.05 7.95499 14.05 8.5018C14.05 9.0486 14.4933 9.49188 15.0401 9.49188Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M15.0401 6.22039C15.5869 6.22039 16.0302 5.77712 16.0302 5.23031C16.0302 4.68351 15.5869 4.24023 15.0401 4.24023C14.4933 4.24023 14.05 4.68351 14.05 5.23031C14.05 5.77712 14.4933 6.22039 15.0401 6.22039Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M11.8104 16.0309C12.3572 16.0309 12.8005 15.5877 12.8005 15.0409C12.8005 14.4941 12.3572 14.0508 11.8104 14.0508C11.2636 14.0508 10.8203 14.4941 10.8203 15.0409C10.8203 15.5877 11.2636 16.0309 11.8104 16.0309Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M11.8104 12.7614C12.3572 12.7614 12.8005 12.3181 12.8005 11.7713C12.8005 11.2245 12.3572 10.7812 11.8104 10.7812C11.2636 10.7812 10.8203 11.2245 10.8203 11.7713C10.8203 12.3181 11.2636 12.7614 11.8104 12.7614Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M11.8104 9.49188C12.3572 9.49188 12.8005 9.0486 12.8005 8.5018C12.8005 7.95499 12.3572 7.51172 11.8104 7.51172C11.2636 7.51172 10.8203 7.95499 10.8203 8.5018C10.8203 9.0486 11.2636 9.49188 11.8104 9.49188Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M11.8104 6.22039C12.3572 6.22039 12.8005 5.77712 12.8005 5.23031C12.8005 4.68351 12.3572 4.24023 11.8104 4.24023C11.2636 4.24023 10.8203 4.68351 10.8203 5.23031C10.8203 5.77712 11.2636 6.22039 11.8104 6.22039Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M8.58041 16.0309C9.12722 16.0309 9.57049 15.5877 9.57049 15.0409C9.57049 14.4941 9.12722 14.0508 8.58041 14.0508C8.03361 14.0508 7.59033 14.4941 7.59033 15.0409C7.59033 15.5877 8.03361 16.0309 8.58041 16.0309Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M8.58041 12.7614C9.12722 12.7614 9.57049 12.3181 9.57049 11.7713C9.57049 11.2245 9.12722 10.7812 8.58041 10.7812C8.03361 10.7812 7.59033 11.2245 7.59033 11.7713C7.59033 12.3181 8.03361 12.7614 8.58041 12.7614Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M8.58041 9.49188C9.12722 9.49188 9.57049 9.0486 9.57049 8.5018C9.57049 7.95499 9.12722 7.51172 8.58041 7.51172C8.03361 7.51172 7.59033 7.95499 7.59033 8.5018C7.59033 9.0486 8.03361 9.49188 8.58041 9.49188Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M8.58041 6.22039C9.12722 6.22039 9.57049 5.77712 9.57049 5.23031C9.57049 4.68351 9.12722 4.24023 8.58041 4.24023C8.03361 4.24023 7.59033 4.68351 7.59033 5.23031C7.59033 5.77712 8.03361 6.22039 8.58041 6.22039Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M5.18027 16.0309C5.72707 16.0309 6.17035 15.5877 6.17035 15.0409C6.17035 14.4941 5.72707 14.0508 5.18027 14.0508C4.63346 14.0508 4.19019 14.4941 4.19019 15.0409C4.19019 15.5877 4.63346 16.0309 5.18027 16.0309Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M5.18027 12.7614C5.72707 12.7614 6.17035 12.3181 6.17035 11.7713C6.17035 11.2245 5.72707 10.7812 5.18027 10.7812C4.63346 10.7812 4.19019 11.2245 4.19019 11.7713C4.19019 12.3181 4.63346 12.7614 5.18027 12.7614Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M5.18027 9.49188C5.72707 9.49188 6.17035 9.0486 6.17035 8.5018C6.17035 7.95499 5.72707 7.51172 5.18027 7.51172C4.63346 7.51172 4.19019 7.95499 4.19019 8.5018C4.19019 9.0486 4.63346 9.49188 5.18027 9.49188Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M5.18027 6.22039C5.72707 6.22039 6.17035 5.77712 6.17035 5.23031C6.17035 4.68351 5.72707 4.24023 5.18027 4.24023C4.63346 4.24023 4.19019 4.68351 4.19019 5.23031C4.19019 5.77712 4.63346 6.22039 5.18027 6.22039Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M1.95053 12.7614C2.49734 12.7614 2.94061 12.3181 2.94061 11.7713C2.94061 11.2245 2.49734 10.7812 1.95053 10.7812C1.40372 10.7812 0.960449 11.2245 0.960449 11.7713C0.960449 12.3181 1.40372 12.7614 1.95053 12.7614Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M1.95053 9.49188C2.49734 9.49188 2.94061 9.0486 2.94061 8.5018C2.94061 7.95499 2.49734 7.51172 1.95053 7.51172C1.40372 7.51172 0.960449 7.95499 0.960449 8.5018C0.960449 9.0486 1.40372 9.49188 1.95053 9.49188Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M1.95053 6.22039C2.49734 6.22039 2.94061 5.77712 2.94061 5.23031C2.94061 4.68351 2.49734 4.24023 1.95053 4.24023C1.40372 4.24023 0.960449 4.68351 0.960449 5.23031C0.960449 5.77712 1.40372 6.22039 1.95053 6.22039Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M15.0401 2.94891C15.5869 2.94891 16.0302 2.50564 16.0302 1.95883C16.0302 1.41202 15.5869 0.96875 15.0401 0.96875C14.4933 0.96875 14.05 1.41202 14.05 1.95883C14.05 2.50564 14.4933 2.94891 15.0401 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M11.7704 2.94891C12.3172 2.94891 12.7604 2.50564 12.7604 1.95883C12.7604 1.41202 12.3172 0.96875 11.7704 0.96875C11.2235 0.96875 10.7803 1.41202 10.7803 1.95883C10.7803 2.50564 11.2235 2.94891 11.7704 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M8.50009 2.94891C9.0469 2.94891 9.49017 2.50564 9.49017 1.95883C9.49017 1.41202 9.0469 0.96875 8.50009 0.96875C7.95328 0.96875 7.51001 1.41202 7.51001 1.95883C7.51001 2.50564 7.95328 2.94891 8.50009 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M5.22983 2.94891C5.77663 2.94891 6.21991 2.50564 6.21991 1.95883C6.21991 1.41202 5.77663 0.96875 5.22983 0.96875C4.68302 0.96875 4.23975 1.41202 4.23975 1.95883C4.23975 2.50564 4.68302 2.94891 5.22983 2.94891Z"
                                          fill="black"
                                        />
                                        <path
                                          d="M1.95956 2.94891C2.50637 2.94891 2.94964 2.50564 2.94964 1.95883C2.94964 1.41202 2.50637 0.96875 1.95956 0.96875C1.41276 0.96875 0.969482 1.41202 0.969482 1.95883C0.969482 2.50564 1.41276 2.94891 1.95956 2.94891Z"
                                          fill="black"
                                        />
                                      </svg>
                                    </button>
                                    {actionMenuOpen === project.id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-10 w-auto"
                                          onClick={() => setActionMenuOpen(null)}
                                        />
                                        <div className="w-[40px] absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                                          <button
                                            onClick={() => {
                                              handlePreview(project.id)
                                              setActionMenuOpen(null)
                                            }}
                                            className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center"
                                          >
                                            <svg
                                              className="w-6 h-6"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                              />
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                              />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleCopyLink(project.id)
                                              setActionMenuOpen(null)
                                            }}
                                            className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 text-wrap break-words"
                                          >
                                            <svg
                                              className="w-6 h-6"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                              />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleDelete(project.id)
                                              setActionMenuOpen(null)
                                            }}
                                            className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2 text-wrap break-words"
                                          >
                                            <svg
                                              className="w-6 h-6"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">リターン機能は今後実装予定です</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
