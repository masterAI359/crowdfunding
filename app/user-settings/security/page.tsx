'use client'
import React, { useState, useEffect } from 'react'
import { getCurrentUser, changePassword } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'

const SecurityPage = () => {
  const [userData, setUserData] = useState<any>(null)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードが一致しません')
      return
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上である必要があります')
      return
    }

    setIsLoading(true)

    try {
      await changePassword(oldPassword, newPassword)
      setSuccess('パスワードが正常に変更されました')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'パスワードの変更に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">アカウントセキュリティ</h1>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    現在のパスワード
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新しいパスワード
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500">8文字以上で入力してください</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新しいパスワード（確認）
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] focus:border-transparent"
                  />
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
                    disabled={isLoading}
                    className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading && <LoadingSpinner size="sm" className="text-white" />}
                    パスワードを変更
                  </button>
                </div>
              </form>
            </div>
  )
}

export default SecurityPage
