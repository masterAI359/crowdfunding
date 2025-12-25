// APIクライアントライブラリ
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

// APIベースURL
// Strategy: Use relative URL if NEXT_PUBLIC_API_URL is not set or is '/api'
// This allows Next.js rewrites to proxy requests to the backend
// Otherwise, use the explicit URL from environment variable
const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL

  // If explicitly set to relative path or not set, use relative URL
  // This enables Next.js rewrites to work
  if (!envUrl || envUrl === '/api' || envUrl.endsWith('/api')) {
    return '/api'
  }

  // If set to a full URL, use it directly
  return envUrl
}

const API_BASE_URL = getApiBaseUrl()

// Axiosインスタンスを作成
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// リクエストインターセプター: トークンを自動的に追加
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ローカルストレージからトークンを取得
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    // FormDataの場合はContent-Typeを自動設定させる（boundaryを設定するため）
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type']
    }
    // Debug logging for API requests
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        baseURL: config.baseURL,
      })
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプター: エラーハンドリング
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Enhanced error logging
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        data: error.response.data,
      })
    } else if (error.request) {
      console.error('API Error Request:', {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
        message: 'No response received from server',
      })
    } else {
      console.error('API Error:', error.message)
    }

    if (error.response?.status === 401) {
      // 認証エラーの場合、トークンを削除してログインページへリダイレクト
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==================== 認証関連API ====================

/**
 * サインアップ開始（メール認証コード送信）
 */
export const initiateSignup = async (
  email: string,
  name?: string,
  isSeller?: boolean,
  isPurchaser?: boolean
) => {
  const response = await apiClient.post('/auth/signup/initiate', {
    email,
    name,
    isSeller,
    isPurchaser,
  })
  return response.data
}

/**
 * サインアップ完了（コード検証）
 */
export const verifySignupCode = async (email: string, code: string) => {
  const response = await apiClient.post('/auth/signup/verify', { email, code })
  return response.data
}

/**
 * 認証コード再送信
 */
export const resendVerificationCode = async (
  email: string,
  name?: string,
  isSeller?: boolean,
  isPurchaser?: boolean
) => {
  const response = await apiClient.post('/auth/signup/resend', {
    email,
    name,
    isSeller,
    isPurchaser,
  })
  return response.data
}

/**
 * パスワード設定
 */
export const setPassword = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/password/set', { email, password })
  return response.data
}

/**
 * ログイン
 */
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password })
  // トークンをローカルストレージに保存
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

/**
 * 現在のユーザー情報取得
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me')
  return response.data
}

/**
 * ユーザープロフィール更新
 */
export const updateUserProfile = async (data: {
  name?: string
  postalCode?: string
  prefecture?: string
  city?: string
  address?: string
  address2?: string
}) => {
  const response = await apiClient.put('/users/profile', data)
  return response.data
}

/**
 * パスワード変更
 */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await apiClient.post('/users/password/change', { oldPassword, newPassword })
  return response.data
}

/**
 * 購入したリターン一覧取得
 */
export const getPurchasedReturns = async () => {
  const response = await apiClient.get('/users/purchases/returns')
  return response.data
}

/**
 * 購入した動画一覧取得
 */
export const getPurchasedVideos = async () => {
  const response = await apiClient.get('/users/purchases/videos')
  return response.data
}

/**
 * 購入履歴取得
 */
export const getPurchaseHistory = async () => {
  const response = await apiClient.get('/users/purchases/history')
  return response.data
}

/**
 * アカウント削除
 */
export const deleteAccount = async (password: string) => {
  const response = await apiClient.delete('/users/account', { data: { password } })
  return response.data
}

/**
 * ログアウト
 */
export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
}

/**
 * OAuth認証URL取得（リダイレクト用）
 */
export const getOAuthUrl = (provider: 'google' | 'apple' | 'facebook') => {
  return `${API_BASE_URL}/auth/${provider}`
}

/**
 * OAuth認証を開始（リダイレクト）
 */
export const startOAuth = (provider: 'google' | 'apple' | 'facebook') => {
  window.location.href = getOAuthUrl(provider)
}

// ==================== プロジェクト関連API ====================

/**
 * プロジェクト一覧取得
 */
export const getProjects = async (page: number = 1, limit: number = 12, sortBy?: string) => {
  const response = await apiClient.get('/projects', {
    params: { page, limit, sortBy },
  })
  return response.data
}

/**
 * プロジェクト詳細取得
 */
export const getProjectById = async (id: string) => {
  const response = await apiClient.get(`/projects/${id}`)
  return response.data
}

/**
 * プロジェクトのリターン一覧取得
 */
export const getProjectReturns = async (projectId: string) => {
  const response = await apiClient.get(`/projects/${projectId}/returns`)
  return response.data
}

/**
 * プロジェクト検索
 */
export const searchProjects = async (query: string, page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/projects/search/query', {
    params: { q: query, page, limit },
  })
  return response.data
}

/**
 * お気に入り追加/削除
 */
export const toggleFavorite = async (projectId: string) => {
  const response = await apiClient.post(`/projects/${projectId}/favorite`)
  return response.data
}

/**
 * お気に入り一覧取得
 */
export const getFavorites = async (page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/projects/favorites/list', {
    params: { page, limit },
  })
  return response.data
}

/**
 * 閲覧履歴取得
 */
export const getViewHistory = async (page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/projects/history/list', {
    params: { page, limit },
  })
  return response.data
}

/**
 * レコメンドプロジェクト取得
 */
export const getRecommendedProjects = async (projectId?: string, limit: number = 10) => {
  const response = await apiClient.get('/projects/recommended/list', {
    params: { projectId, limit },
  })
  return response.data
}

/**
 * プロジェクト一覧取得（出品者用）
 */
export const getProjectsByOwner = async (page: number = 1, limit: number = 20) => {
  const response = await apiClient.get('/projects/owner/list', {
    params: { page, limit },
  })
  return response.data
}

/**
 * プロジェクト作成
 */
export const createProject = async (data: {
  title: string
  description?: string
  goalAmount: number
  endDate: string
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  medias?: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; order?: number }>
  returns?: Array<{
    title: string
    amount: number
    description?: string
    notes?: string
    stock?: number | null
    order?: number
    isVisible?: boolean
    imageUrl?: string
  }>
}) => {
  const response = await apiClient.post('/projects', data)
  return response.data
}

/**
 * プロジェクト更新
 */
export const updateProject = async (
  id: string,
  data: {
    title?: string
    description?: string
    goalAmount?: number
    endDate?: string
    status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    medias?: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; order?: number }>
  }
) => {
  const response = await apiClient.put(`/projects/${id}`, data)
  return response.data
}

/**
 * プロジェクト削除
 */
export const deleteProject = async (id: string) => {
  const response = await apiClient.delete(`/projects/${id}`)
  return response.data
}

/**
 * プロジェクト公開
 */
export const publishProject = async (id: string) => {
  const response = await apiClient.post(`/projects/${id}/publish`)
  return response.data
}

// ==================== 決済関連API ====================

/**
 * 決済インテント作成
 */
export const createPayment = async (
  projectId: string,
  returnIds: string[],
  quantities: Record<string, number>
) => {
  const response = await apiClient.post('/payment/create', {
    projectId,
    returnIds,
    quantities,
  })
  return response.data
}

/**
 * 決済確認
 */
export const confirmPayment = async (paymentIntentId: string) => {
  const response = await apiClient.post(`/payment/confirm/${paymentIntentId}`)
  return response.data
}

/**
 * 動画決済インテント作成（動画購入用）
 */
export const createVideoPayment = async (
  videoId: string,
  seriesIds: string[],
  quantities: Record<string, number>,
  customAmount?: number
) => {
  // For now, we'll use the existing payment API structure
  // In a real implementation, you might have a separate video payment endpoint
  // For series purchase, we'll treat each series as a "return" item
  const response = await apiClient.post('/payment/create', {
    projectId: videoId, // Using videoId as projectId for compatibility
    returnIds: seriesIds,
    quantities,
    customAmount, // Optional custom amount for funding
  })
  return response.data
}

/**
 * Checkout Sessionを検証
 */
export const verifyCheckoutSession = async (sessionId: string) => {
  const response = await apiClient.get(`/payment/verify-session/${sessionId}`)
  return response.data
}

// ==================== 動画関連API ====================

/**
 * 動画一覧取得（公開動画）
 */
export const getVideos = async (page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/videos/list', {
    params: { page, limit },
  })
  return response.data
}

/**
 * 動画一覧取得（出品者用）
 */
export const getVideosByOwner = async (page: number = 1, limit: number = 20) => {
  const response = await apiClient.get('/videos/owner/list', {
    params: { page, limit },
  })
  return response.data
}

/**
 * 動画詳細取得
 */
export const getVideoById = async (id: string) => {
  const response = await apiClient.get(`/videos/${id}`)
  return response.data
}

/**
 * ファイルアップロード（動画・サムネイル）
 */
export const uploadFiles = async (files: File[]) => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await apiClient.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * 動画作成
 */
export const createVideo = async (data: {
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  price?: number
}) => {
  const response = await apiClient.post('/videos', data)
  return response.data
}

/**
 * 動画更新
 */
export const updateVideo = async (
  id: string,
  data: {
    title?: string
    description?: string
    url?: string
    thumbnailUrl?: string
    isVisible?: boolean
    price?: number
  }
) => {
  const response = await apiClient.put(`/videos/${id}`, data)
  return response.data
}

/**
 * 動画削除
 */
export const deleteVideo = async (id: string) => {
  const response = await apiClient.delete(`/videos/${id}`)
  return response.data
}

/**
 * コメント追加
 */
export const addVideoComment = async (videoId: string, content: string) => {
  const response = await apiClient.post(`/videos/${videoId}/comments`, { content })
  return response.data
}

/**
 * 動画統計情報取得
 */
export const getVideoStats = async (id: string) => {
  const response = await apiClient.get(`/videos/${id}/stats`)
  return response.data
}

/**
 * ダッシュボード統計情報取得
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/videos/dashboard/stats')
  return response.data
}

/**
 * 動画コメント一覧取得
 */
export const getVideoComments = async (videoId: string) => {
  const response = await apiClient.get(`/videos/${videoId}/comments`)
  return response.data
}

/**
 * コメント非表示（管理者用）
 */
export const hideVideoComment = async (commentId: string) => {
  const response = await apiClient.post(`/videos/comments/${commentId}/hide`)
  return response.data
}

/**
 * コメント表示（管理者用）
 */
export const showVideoComment = async (commentId: string) => {
  const response = await apiClient.post(`/videos/comments/${commentId}/show`)
  return response.data
}

/**
 * ユーザーログ取得（管理者用）
 */
export const getUserLogs = async (
  userId?: string,
  action?: string,
  page: number = 1,
  limit: number = 50
) => {
  const response = await apiClient.get('/admin/logs', {
    params: { userId, action, page, limit },
  })
  return response.data
}

/**
 * 管理者ダッシュボード統計情報取得
 */
export const getAdminDashboardStats = async (dateRange: string = '7days') => {
  const response = await apiClient.get('/admin/dashboard/stats', {
    params: { dateRange },
  })
  return response.data
}

/**
 * 管理者用：全プロジェクト取得（ステータス問わず）
 */
export const getAdminProjects = async (page: number = 1, limit: number = 100, search?: string) => {
  const response = await apiClient.get('/admin/projects', {
    params: { page, limit, search },
  })
  return response.data
}

/**
 * 管理者用：クラウドファンディング統計情報取得
 */
export const getAdminCrowdfundingStats = async () => {
  const response = await apiClient.get('/admin/crowdfunding/stats')
  return response.data
}

/**
 * 管理者用：全動画取得（表示状態問わず）
 */
export const getAdminVideos = async (page: number = 1, limit: number = 100, search?: string) => {
  const response = await apiClient.get('/admin/videos', {
    params: { page, limit, search },
  })
  return response.data
}

/**
 * 管理者用：動画コンテンツ統計情報取得
 */
export const getAdminVideoStats = async () => {
  const response = await apiClient.get('/admin/videos/stats')
  return response.data
}

/**
 * 管理者用：動画更新（所有者チェックなし）
 */
export const updateAdminVideo = async (
  id: string,
  data: {
    title?: string
    description?: string
    url?: string
    thumbnailUrl?: string
    isVisible?: boolean
    price?: number
    commentsEnabled?: boolean
    totalSupportAmount?: number
  }
) => {
  const response = await apiClient.put(`/admin/videos/${id}`, data)
  return response.data
}

/**
 * 管理者用：動画削除（所有者チェックなし）
 */
export const deleteAdminVideo = async (id: string) => {
  const response = await apiClient.delete(`/admin/videos/${id}`)
  return response.data
}

/**
 * 管理者用：決済履歴取得
 */
export const getAdminPayments = async (
  page: number = 1,
  limit: number = 50,
  search?: string,
  status?: string
) => {
  const response = await apiClient.get('/admin/stripe/payments', {
    params: { page, limit, search, status },
  })
  return response.data
}

/**
 * 管理者用：Stripe統計情報取得
 */
export const getAdminStripeStats = async () => {
  const response = await apiClient.get('/admin/stripe/stats')
  return response.data
}

/**
 * 管理者用：連絡先一覧取得
 */
export const getAdminContacts = async (search?: string) => {
  const response = await apiClient.get('/admin/contacts', {
    params: { search },
  })
  return response.data
}

/**
 * 管理者用：連絡先削除
 */
export const deleteAdminContact = async (contactId: string) => {
  const response = await apiClient.delete(`/admin/contacts/${contactId}`)
  return response.data
}

export default apiClient
