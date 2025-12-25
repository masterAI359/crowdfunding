'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/hooks/useAuth'
import { isAuthenticated as checkAuth, getUser as getStoredUser } from '@/app/lib/auth'
import LoadingSpinner from '@/app/components/loading-spinner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  // Auto-expand sections based on current pathname
  const getInitialExpandedState = () => {
    const state: Record<string, boolean> = {
      products: pathname.startsWith('/admin/products'),
      sales: pathname.startsWith('/admin/sales') || pathname.startsWith('/admin/stripe'),
      website: pathname.startsWith('/admin/website'),
      contacts: pathname.startsWith('/admin/contacts'),
    }
    return state
  }

  const [expandedSections, setExpandedSections] =
    useState<Record<string, boolean>>(getInitialExpandedState())

  // Don't protect the login page itself
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Wait for auth to finish loading
      if (loading) {
        return
      }

      // If on login page, allow access
      if (isLoginPage) {
        setIsChecking(false)
        return
      }

      // Check if user has a token
      const hasToken = checkAuth()

      // If not authenticated, redirect to login
      if (!hasToken) {
        router.push('/admin/login')
        return
      }

      // Get user from state or localStorage as fallback
      const currentUser = user || getStoredUser()

      // If authenticated but not an admin, redirect to login
      if (!currentUser?.isAdministrator) {
        router.push('/admin/login')
        return
      }

      // User is authenticated and is an admin
      setIsChecking(false)
    }

    checkAdminAccess()
  }, [loading, user, router, isLoginPage])

  // Update expanded sections when pathname changes
  useEffect(() => {
    setExpandedSections({
      products: pathname.startsWith('/admin/products'),
      sales: pathname.startsWith('/admin/sales') || pathname.startsWith('/admin/stripe'),
      website: pathname.startsWith('/admin/website'),
      contacts: pathname.startsWith('/admin/contacts'),
    })
  }, [pathname])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Show loading spinner while checking authentication
  if (isChecking && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't show sidebar on login page
  if (isLoginPage) {
    return <>{children}</>
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      type: 'single' as const,
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 3.16602H15.8333V7.91602H9.5V3.16602ZM9.5 16.6243V8.70768H15.8333V16.6243H9.5ZM2.375 16.6243V11.8743H8.70833V16.6243H2.375ZM2.375 11.0827V3.16602H8.70833V11.0827H2.375ZM3.16667 3.95768V10.291H7.91667V3.95768H3.16667ZM10.2917 3.95768V7.12435H15.0417V3.95768H10.2917ZM10.2917 9.49935V15.8327H15.0417V9.49935H10.2917ZM3.16667 12.666V15.8327H7.91667V12.666H3.16667Z"
            fill="black"
            stroke="black"
            stroke-width="0.2"
          />
        </svg>
      ),
    },
    {
      id: 'products',
      label: 'Products',
      type: 'category' as const,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.0002 1.125L16.8002 5.025V14.775L9.0002 18.6656L1.2002 14.775V5.025L9.0002 1.125ZM14.8596 5.4L9.0002 2.475L6.74082 3.6L12.5627 6.54375L14.8596 5.4ZM9.0002 8.325L11.2314 7.21875L5.4002 4.275L3.14082 5.4L9.0002 8.325ZM2.4002 6.375V14.025L8.4002 17.025V9.375L2.4002 6.375ZM9.6002 17.025L15.6002 14.025V6.375L9.6002 9.375V17.025Z"
            fill="black"
          />
        </svg>
      ),
      children: [
        {
          id: 'crowdfunding',
          label: 'クラウドファンディング',
          href: '/admin/products/crowdfunding',
        },
        { id: 'videos', label: '動画コンテンツ', href: '/admin/products/videos' },
      ],
    },
    {
      id: 'sales',
      label: '販売',
      type: 'category' as const,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.4003 6V16.2H1.80029V6M17.4003 6L14.4003 3H4.80029L1.80029 6M17.4003 6H1.80029M7.20029 12.6H12.0003C12.3186 12.6 12.6238 12.4736 12.8488 12.2485C13.0739 12.0235 13.2003 11.7183 13.2003 11.4C13.2003 11.0817 13.0739 10.7765 12.8488 10.5515C12.6238 10.3264 12.3186 10.2 12.0003 10.2H6.60029L8.40029 8.4"
            stroke="black"
            stroke-width="1.2"
          />
        </svg>
      ),
      children: [{ id: 'stripe', label: '支払い', href: '/admin/stripe' }],
    },
    {
      id: 'website',
      label: 'Webサイト',
      type: 'category' as const,
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.9603 1.51953H2.28027V16.7195H15.9603V1.51953Z"
            stroke="black"
            stroke-width="1.14"
          />
          <path
            d="M2.28027 15.1563L6.37135 11.9217L13.181 16.7188M9.32471 3.79883H4.55951M13.6803 6.34027H4.56027M15.9603 8.78671H2.28027M12.6581 10.7581C12.9917 10.7581 13.3116 10.8907 13.5475 11.1265C13.7834 11.3624 13.9159 11.6824 13.9159 12.0159C13.9159 12.3495 13.7834 12.6695 13.5475 12.9053C13.3116 13.1412 12.9917 13.2737 12.6581 13.2737C12.3245 13.2737 12.0046 13.1412 11.7687 12.9053C11.5328 12.6695 11.4003 12.3495 11.4003 12.0159C11.4003 11.6824 11.5328 11.3624 11.7687 11.1265C12.0046 10.8907 12.3245 10.7581 12.6581 10.7581Z"
            stroke="black"
            stroke-width="1.14"
          />
        </svg>
      ),
      children: [{ id: 'management', label: '管理画面', href: '/admin/website/management' }],
    },
    {
      id: 'contacts',
      label: '連絡先',
      type: 'category' as const,
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5786 11.7187C11.9446 11.3163 12.1468 10.7916 12.1455 10.2478C12.1455 9.04179 11.1734 8.06572 9.97519 8.06572C8.77703 8.06572 7.80485 9.04179 7.80485 10.2478C7.80485 10.8147 8.01916 11.329 8.37179 11.7187C7.94927 11.9805 7.5964 12.3407 7.34331 12.7685C7.09023 13.1963 6.94444 13.679 6.9184 14.1754C6.91735 14.1965 6.9206 14.2176 6.92795 14.2374C6.93531 14.2573 6.94662 14.2754 6.9612 14.2907C6.97578 14.306 6.99332 14.3182 7.01276 14.3265C7.0322 14.3348 7.05312 14.3391 7.07426 14.3391H7.92954C8.01137 14.3391 8.07761 14.2748 8.08345 14.1929C8.15749 13.2071 8.97964 12.4298 9.97714 12.4298C10.9746 12.4298 11.7968 13.2091 11.8708 14.1929C11.8767 14.2748 11.9429 14.3391 12.0247 14.3391H12.8781C12.8992 14.3391 12.9201 14.3348 12.9396 14.3265C12.959 14.3182 12.9766 14.306 12.9911 14.2907C13.0057 14.2754 13.017 14.2573 13.0244 14.2374C13.0317 14.2176 13.035 14.1965 13.0339 14.1754C12.9794 13.137 12.4105 12.233 11.5786 11.7187ZM9.97519 11.2608C9.41995 11.2608 8.96795 10.8069 8.96795 10.2478C8.96795 9.68861 9.41995 9.23467 9.97519 9.23467C10.5304 9.23467 10.9824 9.68861 10.9824 10.2478C10.9824 10.8069 10.5304 11.2608 9.97519 11.2608ZM18.0799 4.36406H14.9627V3.27305C14.9627 3.18732 14.8926 3.11719 14.8068 3.11719H13.7158C13.6301 3.11719 13.56 3.18732 13.56 3.27305V4.36406H10.6766V3.27305C10.6766 3.18732 10.6064 3.11719 10.5207 3.11719H9.42969C9.34396 3.11719 9.27383 3.18732 9.27383 3.27305V4.36406H6.39043V3.27305C6.39043 3.18732 6.32029 3.11719 6.23457 3.11719H5.14355C5.05783 3.11719 4.9877 3.18732 4.9877 3.27305V4.36406H1.87051C1.52567 4.36406 1.24707 4.64266 1.24707 4.9875V16.2094C1.24707 16.5542 1.52567 16.8328 1.87051 16.8328H18.0799C18.4247 16.8328 18.7033 16.5542 18.7033 16.2094V4.9875C18.7033 4.64266 18.4247 4.36406 18.0799 4.36406ZM17.3006 15.4301H2.6498V5.7668H4.9877V6.85781C4.9877 6.94353 5.05783 7.01367 5.14355 7.01367H6.23457C6.32029 7.01367 6.39043 6.94353 6.39043 6.85781V5.7668H9.27383V6.85781C9.27383 6.94353 9.34396 7.01367 9.42969 7.01367H10.5207C10.6064 7.01367 10.6766 6.94353 10.6766 6.85781V5.7668H13.56V6.85781C13.56 6.94353 13.6301 7.01367 13.7158 7.01367H14.8068C14.8926 7.01367 14.9627 6.94353 14.9627 6.85781V5.7668H17.3006V15.4301Z"
            fill="black"
          />
        </svg>
      ),
      children: [
        { id: 'all', label: '全ての連絡先', href: '/admin/contacts/all' },
        { id: 'exhibitors', label: '出品者', href: '/admin/contacts/exhibitors' },
        { id: 'customers', label: 'カスタマー', href: '/admin/contacts/customers' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">管理者画面</h1>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                if (item.type === 'single') {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex font-bold font-weight-[700] text-[16px] items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive ? 'bg-[#FF0066] text-white' : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )
                } else {
                  const isExpanded = expandedSections[item.id]
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleSection(item.id)}
                        className={`w-full font-bold flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                          pathname.startsWith(`/admin/${item.id}`)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isExpanded && item.children && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href
                            return (
                              <Link
                                key={child.id}
                                href={child.href}
                                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                                  isChildActive
                                    ? 'bg-[#FF0066] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
