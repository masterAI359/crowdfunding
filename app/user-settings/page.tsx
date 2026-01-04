'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser, getPurchaseHistory, updateUserProfile, updateCardInfo } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'

const UserSettingsPage = () => {
  const [userData, setUserData] = useState<any>(null)
  const [purchaseData, setPurchaseData] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    loadUserData()
    loadPurchaseData()
  }, [])

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

  return (
    <AccountInfoContent
      userData={userData}
      purchaseData={purchaseData}
      isLoadingData={isLoadingData}
      onUpdate={loadUserData}
    />
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
      <div className="mt-6 relative">
        <div className="grid grid-cols-1">
          <div
            className={`col-start-1 row-start-1 transition-opacity duration-200 ease-in-out ${
              activeSubTab === 'contact' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <ContactAndSettingsTab userData={userData} onUpdate={onUpdate} />
          </div>
          <div
            className={`col-start-1 row-start-1 transition-opacity duration-200 ease-in-out ${
              activeSubTab === 'billing' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <BillingTab userData={userData} onUpdate={onUpdate} />
          </div>
          <div
            className={`col-start-1 row-start-1 transition-opacity duration-200 ease-in-out ${
              activeSubTab === 'purchase-history' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <PurchaseHistoryTab purchaseData={purchaseData} isLoading={isLoadingData} />
          </div>
        </div>
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
const BillingTab = ({ userData, onUpdate }: { userData: any; onUpdate: () => void }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    cardNumber: userData?.cardNumber || '',
    cardLast4: userData?.cardLast4 || '',
    cardExpMonth: userData?.cardExpMonth || '',
    cardExpYear: userData?.cardExpYear || '',
    cardBrand: userData?.cardBrand || '',
  })
  const [showFullCardNumber, setShowFullCardNumber] = useState(false)

  useEffect(() => {
    if (userData) {
      setFormData({
        cardNumber: userData.cardNumber || '',
        cardLast4: userData.cardLast4 || '',
        cardExpMonth: userData.cardExpMonth || '',
        cardExpYear: userData.cardExpYear || '',
        cardBrand: userData.cardBrand || '',
      })
    }
  }, [userData])

  const handleEdit = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      cardNumber: userData?.cardNumber || '',
      cardLast4: userData?.cardLast4 || '',
      cardExpMonth: userData?.cardExpMonth || '',
      cardExpYear: userData?.cardExpYear || '',
      cardBrand: userData?.cardBrand || '',
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSaving(true)

    try {
      // バリデーション
      if (formData.cardNumber) {
        const cardNumberDigits = formData.cardNumber.replace(/\D/g, '')
        if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
          throw new Error('カード番号は13-19桁の数字である必要があります')
        }
      }

      if (formData.cardLast4 && !/^\d{4}$/.test(formData.cardLast4)) {
        throw new Error('カード番号の下4桁は4桁の数字である必要があります')
      }

      if (formData.cardExpMonth && (Number(formData.cardExpMonth) < 1 || Number(formData.cardExpMonth) > 12)) {
        throw new Error('有効期限の月は1-12の間で指定してください')
      }

      const currentYear = new Date().getFullYear()
      if (formData.cardExpYear && Number(formData.cardExpYear) < currentYear) {
        throw new Error('有効期限の年が無効です')
      }

      await updateCardInfo({
        cardNumber: formData.cardNumber || undefined,
        cardLast4: formData.cardLast4 || undefined,
        cardExpMonth: formData.cardExpMonth ? Number(formData.cardExpMonth) : undefined,
        cardExpYear: formData.cardExpYear ? Number(formData.cardExpYear) : undefined,
        cardBrand: formData.cardBrand || undefined,
      })

      setSuccess('クレジットカード情報が正常に更新されました')
      setIsEditing(false)
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'カード情報の更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  const hasCardInfo = userData?.cardLast4 || userData?.cardExpMonth || userData?.cardExpYear

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">登録されたクレジットカード</h3>
        {!isEditing ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            {hasCardInfo ? (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">カード番号</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-mono">
                      {showFullCardNumber && userData?.cardNumber
                        ? userData.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                        : `${userData?.cardBrand ? userData.cardBrand + ' ' : ''}**** **** **** ${userData?.cardLast4 || '****'}`}
                    </p>
                    {userData?.cardNumber && (
                      <button
                        onMouseDown={() => setShowFullCardNumber(true)}
                        onMouseUp={() => setShowFullCardNumber(false)}
                        onMouseLeave={() => setShowFullCardNumber(false)}
                        onTouchStart={() => setShowFullCardNumber(true)}
                        onTouchEnd={() => setShowFullCardNumber(false)}
                        className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                      >
                        {showFullCardNumber ? '離すと非表示' : '長押しで表示'}
                      </button>
                    )}
                  </div>
                  {userData?.cardExpMonth && userData?.cardExpYear && (
                    <p className="text-sm text-gray-500 mt-2">
                      有効期限: {String(userData.cardExpMonth).padStart(2, '0')}/{String(userData.cardExpYear).slice(-2)}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ml-4"
                >
                  変更
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">カード情報が登録されていません</p>
                </div>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors"
                >
                  カードを登録
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">カード番号</label>
                <input
                  type="text"
                  maxLength={23}
                  value={formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setFormData({
                      ...formData,
                      cardNumber: value,
                      cardLast4: value.slice(-4) || formData.cardLast4,
                    })
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent font-mono"
                />
                <p className="mt-1 text-xs text-gray-500">カード番号を入力してください（数字のみ）</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カードブランド</label>
                <select
                  value={formData.cardBrand}
                  onChange={(e) => setFormData({ ...formData, cardBrand: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="JCB">JCB</option>
                  <option value="American Express">American Express</option>
                  <option value="Diners Club">Diners Club</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カード番号（下4桁）</label>
                <input
                  type="text"
                  maxLength={4}
                  value={formData.cardLast4}
                  onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value.replace(/\D/g, '') })}
                  placeholder="1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
                  readOnly
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">カード番号から自動入力されます</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">有効期限（月）</label>
                <select
                  value={formData.cardExpMonth}
                  onChange={(e) => setFormData({ ...formData, cardExpMonth: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {String(month).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">有効期限（年）</label>
                <input
                  type="number"
                  min={new Date().getFullYear()}
                  max={new Date().getFullYear() + 20}
                  value={formData.cardExpYear}
                  onChange={(e) => setFormData({ ...formData, cardExpYear: e.target.value })}
                  placeholder={new Date().getFullYear().toString()}
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
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                キャンセル
              </button>
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
        )}
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
              <div className="w-24 h-16 bg-gray-200 rounded shrink-0"></div>
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
