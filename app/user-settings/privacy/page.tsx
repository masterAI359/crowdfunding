'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser } from '@/app/lib/api'
import { showSuccess } from '@/app/lib/toast'

const PrivacyPage = () => {
  const [userData, setUserData] = useState<any>(null)
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    emailVisibility: false,
    showPurchaseHistory: true,
    allowMessages: true,
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const data = await getCurrentUser()
      setUserData(data)
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const handleChange = (key: string, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    // TODO: Implement API call to save privacy settings
    showSuccess('プライバシー設定が保存されました')
  }

  return (
    <div className="bg-white">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">プライベート設定</h1>

              <div className="space-y-6 max-w-2xl">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    プロフィールの公開設定
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="public"
                        checked={privacySettings.profileVisibility === 'public'}
                        onChange={(e) => handleChange('profileVisibility', e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">公開</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value="private"
                        checked={privacySettings.profileVisibility === 'private'}
                        onChange={(e) => handleChange('profileVisibility', e.target.value)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">非公開</span>
                    </label>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">メールアドレスの表示</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.emailVisibility}
                      onChange={(e) => handleChange('emailVisibility', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">メールアドレスを他のユーザーに表示する</span>
                  </label>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">購入履歴の表示</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.showPurchaseHistory}
                      onChange={(e) => handleChange('showPurchaseHistory', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">購入履歴を表示する</span>
                  </label>
                </div>

                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">メッセージの受信</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={privacySettings.allowMessages}
                      onChange={(e) => handleChange('allowMessages', e.target.checked)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">他のユーザーからのメッセージを受信する</span>
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
  )
}

export default PrivacyPage
