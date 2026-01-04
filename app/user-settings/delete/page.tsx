'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { getCurrentUser, deleteAccount } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'
import { showSuccess, handleApiError } from '@/app/lib/toast'

const DeleteAccountPage = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (confirmText !== '削除') {
      setError('確認のため「削除」と入力してください')
      return
    }

    if (!password) {
      setError('パスワードを入力してください')
      return
    }

    if (!window.confirm('本当にアカウントを削除しますか？この操作は取り消せません。')) {
      return
    }

    setIsLoading(true)

    try {
      await deleteAccount(password)
      showSuccess('アカウントが削除されました')
      logout()
      router.push('/')
    } catch (err: any) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">アカウントを削除</h1>

              <div className="max-w-2xl">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">警告</h3>
                  <p className="text-red-700 mb-4">
                    アカウントを削除すると、以下のデータが永久に削除されます：
                  </p>
                  <ul className="list-disc list-inside text-red-700 space-y-1 mb-4">
                    <li>プロフィール情報</li>
                    <li>購入履歴</li>
                    <li>お気に入り</li>
                    <li>その他のアカウント関連データ</li>
                  </ul>
                  <p className="text-red-700 font-semibold">
                    この操作は取り消せません。続行する場合は、パスワードを入力し、「削除」と入力してください。
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      パスワード
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      確認のため「削除」と入力してください
                    </label>
                    <input
                      type="text"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      required
                      placeholder="削除"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading && <LoadingSpinner size="sm" className="text-white" />}
                      アカウントを削除
                    </button>
                  </div>
                </form>
              </div>
            </div>
  )
}

export default DeleteAccountPage
