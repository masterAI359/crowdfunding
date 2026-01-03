'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { getCurrentUser } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'

export default function UserSettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, loading } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (isAuthenticated) {
      loadUserData()
    }
  }, [isAuthenticated, loading])

  const loadUserData = async () => {
    setIsLoadingData(true)
    try {
      const data = await getCurrentUser()
      setUserData(data)
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoadingData(false)
    }
  }

  // Don't apply common layout for seller pages (they have their own menu structure)
  if (pathname.startsWith('/user-settings/seller')) {
    return <>{children}</>
  }

  if (loading || isLoadingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
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

  // Add seller dashboard link if user is a seller or administrator
  if (user?.isSeller || user?.isAdministrator) {
    menuItems.unshift({ id: 'seller', label: '出品者管理ページ', href: '/user-settings/seller' })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-64 shrink-0">
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
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  )
}

