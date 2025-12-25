'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminPayments, getAdminStripeStats } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'

interface Payment {
  id: string
  supportId: string
  userId: string
  stripePaymentId?: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  metadata?: any
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    email?: string
    name?: string
  }
  support?: {
    id: string
    projectId?: string
    returnId?: string
  }
}

interface StripeStats {
  totalPayments: number
  totalAmount: number
  completedPayments: number
  failedPayments: number
  refundedPayments: number
  pendingPayments: number
  payments30Days: number
  amount30Days: number
}

export default function StripePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<StripeStats | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        loadPayments()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter, currentPage])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([loadPayments(), loadStats()])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPayments = async () => {
    try {
      const response = await getAdminPayments(
        currentPage,
        50,
        searchQuery || undefined,
        statusFilter !== 'all' ? statusFilter : undefined
      )
      setPayments(response.payments || [])
      setTotalPages(response.totalPages || 1)
    } catch (error) {
      console.error('Failed to load payments:', error)
      setPayments([])
      setTotalPages(1)
    }
  }

  const loadStats = async () => {
    try {
      const response = await getAdminStripeStats()
      setStats(response)
    } catch (error) {
      console.error('Failed to load stats:', error)
      setStats({
        totalPayments: 0,
        totalAmount: 0,
        completedPayments: 0,
        failedPayments: 0,
        refundedPayments: 0,
        pendingPayments: 0,
        payments30Days: 0,
        amount30Days: 0,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      PENDING: { label: '保留中', className: 'bg-yellow-100 text-yellow-800' },
      COMPLETED: { label: '完了', className: 'bg-green-100 text-green-800' },
      FAILED: { label: '失敗', className: 'bg-red-100 text-red-800' },
      REFUNDED: { label: '返金済み', className: 'bg-gray-100 text-gray-800' },
    }

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
    )
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Stripe管理</h1>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">総決済数</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalPayments.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">総決済額</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalAmount ? formatCurrency(stats.totalAmount) : '¥0'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">過去30日間の決済数</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.payments30Days.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">過去30日間の決済額</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.amount30Days ? formatCurrency(stats.amount30Days) : '¥0'}
            </p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">完了</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats?.completedPayments.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">保留中</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {stats?.pendingPayments.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">失敗</h3>
            <p className="text-2xl font-bold text-red-600">
              {stats?.failedPayments.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm text-gray-600 mb-2">返金済み</h3>
            <p className="text-2xl font-bold text-gray-600">
              {stats?.refundedPayments.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="決済ID、ユーザーID、メールアドレスで検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF0066]"
              >
                <option value="all">すべてのステータス</option>
                <option value="PENDING">保留中</option>
                <option value="COMPLETED">完了</option>
                <option value="FAILED">失敗</option>
                <option value="REFUNDED">返金済み</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      決済ID
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      Stripe決済ID
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      ユーザー
                    </th>
                    <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      金額
                    </th>
                    <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      ステータス
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      作成日時
                    </th>
                    <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        決済情報が見つかりません
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900 font-mono">
                            {payment.id.substring(0, 12)}...
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900 font-mono">
                            {payment.stripePaymentId ? (
                              <a
                                href={`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF0066] hover:underline"
                              >
                                {payment.stripePaymentId.substring(0, 20)}...
                              </a>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900">
                              {payment.user?.name || payment.user?.email || payment.userId}
                            </p>
                            {payment.user?.email && (
                              <p className="text-[12px] text-gray-500">{payment.user.email}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[16px] text-center font-weight-[400] line-height-[140%] text-gray-900">
                            {formatCurrency(payment.amount)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center">
                            {getStatusBadge(payment.status)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900">
                            {formatDate(payment.createdAt)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 justify-center">
                            {payment.stripePaymentId && (
                              <a
                                href={`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-[#FF0066] hover:bg-gray-100 rounded transition-colors"
                                title="Stripeダッシュボードで開く"
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <polyline
                                    points="15 3 21 3 21 9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <line
                                    x1="10"
                                    y1="14"
                                    x2="21"
                                    y2="3"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                前へ
              </button>
              <span className="px-4 py-2 text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                次へ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
