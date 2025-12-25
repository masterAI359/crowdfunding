'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminContacts, deleteAdminContact } from '@/app/lib/api'
import LoadingSpinner from '@/app/components/loading-spinner'

interface Contact {
  id: string
  name: string
  email: string
  phoneNumber?: string
  purchaseAmount: number
  addedDate: string
  userId?: string
  isSeller?: boolean
  isPurchaser?: boolean
  // Note: isAdministrator is intentionally excluded - managers should not be displayed
}

export default function AllContactsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadContacts()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAdminContacts(searchQuery || undefined)
      // Backend should filter out administrators (isAdministrator = false)
      // Frontend receives only buyers and sellers
      setContacts(response.contacts || [])
    } catch (err: any) {
      // Handle 404 gracefully (backend endpoint not implemented yet)
      if (err.response?.status === 404) {
        setError('バックエンドAPIが実装されていません。後で実装予定です。')
        setContacts([])
        // Don't log 404 errors as they're expected until backend is implemented
      } else {
        console.error('Failed to load contacts:', err)
        setError(err.response?.data?.message || 'データの取得に失敗しました')
        setContacts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const getContactType = (contact: Contact): string => {
    if (contact.isSeller && contact.isPurchaser) {
      return '出品者・購入者'
    } else if (contact.isSeller) {
      return '出品者'
    } else if (contact.isPurchaser) {
      return '購入者'
    }
    return '-'
  }

  const getContactTypeBadge = (contact: Contact) => {
    if (contact.isSeller && contact.isPurchaser) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          出品者・購入者
        </span>
      )
    } else if (contact.isSeller) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          出品者
        </span>
      )
    } else if (contact.isPurchaser) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          購入者
        </span>
      )
    }
    return <span className="text-gray-400 text-xs">-</span>
  }

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
  }

  const handlePreview = (contact: Contact) => {
    // Navigate to contact detail page or open preview modal
    // For now, we'll just log it
    console.log('Preview contact:', contact)
    // router.push(`/admin/contacts/${contact.id}`)
  }

  const handleCopyLink = async (contact: Contact) => {
    try {
      const url = `${window.location.origin}/admin/contacts/${contact.id}`
      await navigator.clipboard.writeText(url)
      alert('リンクをコピーしました')
    } catch (err) {
      console.error('Failed to copy link:', err)
      alert('リンクのコピーに失敗しました')
    }
  }

  const handleDelete = async (contact: Contact) => {
    if (!confirm(`本当に「${contact.name}」を削除しますか？`)) {
      return
    }

    try {
      await deleteAdminContact(contact.id)
      // Reload contacts after deletion
      loadContacts()
      alert('削除しました')
    } catch (err: any) {
      console.error('Failed to delete contact:', err)
      alert('削除に失敗しました')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">顧客情報</h1>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="検索"
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

            {/* Filter Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>絞り込み</span>
            </button>
          </div>

          {/* Filter Panel (can be expanded later) */}
          {showFilter && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">フィルター機能は今後実装予定です</p>
            </div>
          )}
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">{error}</p>
              {error.includes('バックエンドAPI') && (
                <p className="text-sm text-yellow-700 mt-2">
                  この機能を使用するには、バックエンドに `/api/admin/contacts` エンドポイントを実装する必要があります。
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      名前
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      電話番号
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      タイプ
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      購入金額
                    </th>
                    <th className="text-left py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      追加日
                    </th>
                    <th className="text-center py-3 px-4 text-[16px] font-weight-[400] line-height-[140%] letterspacing-[3%] text-gray-700">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        連絡先情報が見つかりません
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900">
                            {contact.name}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900">
                            {contact.email}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900">
                            {contact.phoneNumber || '-'}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          {getContactTypeBadge(contact)}
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[16px] font-weight-[400] line-height-[140%] text-gray-900">
                            {formatCurrency(contact.purchaseAmount)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-[14px] font-weight-[400] line-height-[140%] text-gray-900">
                            {formatDate(contact.addedDate)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 justify-center">
                            {/* Preview Icon */}
                            <button
                              onClick={() => handlePreview(contact)}
                              className="p-2 text-gray-600 hover:text-[#FF0066] hover:bg-gray-100 rounded transition-colors"
                              title="ページをプレビュー"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="3"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            {/* Copy Link Icon */}
                            <button
                              onClick={() => handleCopyLink(contact)}
                              className="p-2 text-gray-600 hover:text-[#FF0066] hover:bg-gray-100 rounded transition-colors"
                              title="リンクをコピー"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            {/* Delete Icon */}
                            <button
                              onClick={() => handleDelete(contact)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="削除"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10 11v6M14 11v6"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
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
      </div>
    </div>
  )
}

