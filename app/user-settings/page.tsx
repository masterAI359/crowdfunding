'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { getCurrentUser, getPurchaseHistory, updateUserProfile } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'

const UserSettingsPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('account-info')
  const [userData, setUserData] = useState<any>(null)
  const [purchaseData, setPurchaseData] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated) {
      loadUserData()
      loadPurchaseData()
    }
  }, [isAuthenticated, loading])

  const loadUserData = async () => {
    try {
      const data = await getCurrentUser()
      setUserData(data)
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const loadPurchaseData = async () => {
    setIsLoadingData(true)
    try {
      const data = await getPurchaseHistory()
      setPurchaseData(data)
    } catch (error) {
      console.error('Failed to load purchase data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    { id: 'my-movies', label: 'マイムービー', href: '/user-settings/movies' },
    { id: 'account-info', label: 'アカウント情報', href: '/user-settings' },
    { id: 'account-security', label: 'アカウントセキュリティ', href: '/user-settings/security' },
    { id: 'privacy-settings', label: 'プライベート設定', href: '/user-settings/privacy' },
    { id: 'delete-account', label: 'アカウントを閉鎖', href: '/user-settings/delete' },
  ]

  // Add seller dashboard link if user is a seller
  if (user?.isSeller || user?.isAdministrator) {
    menuItems.unshift({ id: 'seller', label: '出品者管理ページ', href: '/user-settings/seller' })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {/* User Profile Section */}
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 mx-auto relative">
                  <span className="text-2xl text-gray-500">
                    {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{userData?.name || 'user_name'}</p>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive ? 'bg-[#FF0066] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AccountInfoContent
              userData={userData}
              purchaseData={purchaseData}
              isLoadingData={isLoadingData}
              onUpdate={loadUserData}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Account Information Content Component
const AccountInfoContent = ({
  userData,
  purchaseData,
  isLoadingData,
  onUpdate,
}: {
  userData: any
  purchaseData: any
  isLoadingData: boolean
  onUpdate: () => void
}) => {
  const [activeSubTab, setActiveSubTab] = useState('contact')

  const subTabs = [
    { id: 'contact', label: '連絡先と設定' },
    { id: 'billing', label: '請求' },
    { id: 'purchase-history', label: '購入履歴' },
  ]

  return (
    <div className="bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">アカウント情報</h1>

      {/* Sub-navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-[#FF0066] text-[#FF0066]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeSubTab === 'contact' && (
          <ContactAndSettingsTab userData={userData} onUpdate={onUpdate} />
        )}
        {activeSubTab === 'billing' && <BillingTab />}
        {activeSubTab === 'purchase-history' && (
          <PurchaseHistoryTab purchaseData={purchaseData} isLoading={isLoadingData} />
        )}
      </div>
    </div>
  )
}

// Contact and Settings Tab
const ContactAndSettingsTab = ({ userData, onUpdate }: { userData: any; onUpdate: () => void }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
      })
    }
  }, [userData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      await updateUserProfile({
        name: formData.name,
        address: formData.address,
        // Note: phone, dateOfBirth, and gender are not currently supported by the backend API
      })
      setSuccess('プロフィールが正常に更新されました')
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || 'プロフィールの更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">氏名</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
          <p className="mt-1 text-xs text-gray-500">メールアドレスは変更できません</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">電話番号</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
          >
            <option value="">選択してください</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
            <option value="other">その他</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">住所</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
          />
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <LoadingSpinner size="sm" className="text-white" />}
          保存
        </button>
      </div>
    </form>
  )
}

// Billing Tab
const BillingTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">登録されたクレジットカード</h3>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">カード番号</p>
              <p className="text-lg font-mono">**** **** **** 1234</p>
              <p className="text-sm text-gray-500 mt-2">有効期限: 12/25</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              変更
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Purchase History Tab
const PurchaseHistoryTab = ({
  purchaseData,
  isLoading,
}: {
  purchaseData: any
  isLoading: boolean
}) => {
  const videos = purchaseData?.videos || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">動画購入履歴</h3>
      {videos.length === 0 ? (
        <p className="text-gray-500">購入した動画はありません</p>
      ) : (
        <div className="space-y-4">
          {videos.map((video: any) => (
            <div
              key={video.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{video.title || '動画'}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(video.purchaseDate || video.date).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ¥{(video.price || video.amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserSettingsPage
