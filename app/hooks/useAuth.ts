// 認証状態管理フック
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { login, logout as apiLogout, getCurrentUser } from '../lib/api'
import { getUser, isAuthenticated, clearAuth } from '../lib/auth'

interface User {
  id: string
  email: string
  name?: string
  isSeller?: boolean
  isPurchaser?: boolean
  isAdministrator?: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
        } catch (error) {
          // トークンが無効な場合
          clearAuth()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // ログイン
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const response = await login(email, password)
      setUser(response.user)
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'ログインに失敗しました',
      }
    }
  }, [])

  // ログアウト
  const handleLogout = useCallback(() => {
    apiLogout()
    clearAuth()
    setUser(null)
    router.push('/login')
  }, [router])

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
  }
}
