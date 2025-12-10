// APIクライアントライブラリ
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// APIベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Axiosインスタンスを作成
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// リクエストインターセプター: トークンを自動的に追加
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ローカルストレージからトークンを取得
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター: エラーハンドリング
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 認証エラーの場合、トークンを削除してログインページへリダイレクト
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== 認証関連API ====================

/**
 * サインアップ開始（メール認証コード送信）
 */
export const initiateSignup = async (email: string, name?: string) => {
  const response = await apiClient.post('/auth/signup/initiate', { email, name });
  return response.data;
};

/**
 * サインアップ完了（コード検証）
 */
export const verifySignupCode = async (email: string, code: string) => {
  const response = await apiClient.post('/auth/signup/verify', { email, code });
  return response.data;
};

/**
 * パスワード設定
 */
export const setPassword = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/password/set', { email, password });
  return response.data;
};

/**
 * ログイン
 */
export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  // トークンをローカルストレージに保存
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

/**
 * 現在のユーザー情報取得
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

/**
 * ログアウト
 */
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

/**
 * OAuth認証URL取得（リダイレクト用）
 */
export const getOAuthUrl = (provider: 'google' | 'apple' | 'facebook') => {
  return `${API_BASE_URL}/auth/${provider}`;
};

/**
 * OAuth認証を開始（リダイレクト）
 */
export const startOAuth = (provider: 'google' | 'apple' | 'facebook') => {
  window.location.href = getOAuthUrl(provider);
};

// ==================== プロジェクト関連API ====================

/**
 * プロジェクト一覧取得
 */
export const getProjects = async (page: number = 1, limit: number = 12, sortBy?: string) => {
  const response = await apiClient.get('/projects', {
    params: { page, limit, sortBy },
  });
  return response.data;
};

/**
 * プロジェクト詳細取得
 */
export const getProjectById = async (id: string) => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
};

/**
 * プロジェクトのリターン一覧取得
 */
export const getProjectReturns = async (projectId: string) => {
  const response = await apiClient.get(`/projects/${projectId}/returns`);
  return response.data;
};

/**
 * プロジェクト検索
 */
export const searchProjects = async (query: string, page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/projects/search/query', {
    params: { q: query, page, limit },
  });
  return response.data;
};

/**
 * お気に入り追加/削除
 */
export const toggleFavorite = async (projectId: string) => {
  const response = await apiClient.post(`/projects/${projectId}/favorite`);
  return response.data;
};

/**
 * お気に入り一覧取得
 */
export const getFavorites = async (page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/projects/favorites/list', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * 閲覧履歴取得
 */
export const getViewHistory = async (page: number = 1, limit: number = 12) => {
  const response = await apiClient.get('/projects/history/list', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * レコメンドプロジェクト取得
 */
export const getRecommendedProjects = async (projectId?: string, limit: number = 10) => {
  const response = await apiClient.get('/projects/recommended/list', {
    params: { projectId, limit },
  });
  return response.data;
};

// ==================== 決済関連API ====================

/**
 * 決済インテント作成
 */
export const createPayment = async (projectId: string, returnIds: string[], quantities: Record<string, number>) => {
  const response = await apiClient.post('/payment/create', {
    projectId,
    returnIds,
    quantities,
  });
  return response.data;
};

/**
 * 決済確認
 */
export const confirmPayment = async (paymentIntentId: string) => {
  const response = await apiClient.post(`/payment/confirm/${paymentIntentId}`);
  return response.data;
};

// ==================== 動画関連API ====================

/**
 * 動画一覧取得（出品者用）
 */
export const getVideosByOwner = async (page: number = 1, limit: number = 20) => {
  const response = await apiClient.get('/videos/owner/list', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * 動画詳細取得
 */
export const getVideoById = async (id: string) => {
  const response = await apiClient.get(`/videos/${id}`);
  return response.data;
};

/**
 * 動画作成
 */
export const createVideo = async (data: {
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
}) => {
  const response = await apiClient.post('/videos', data);
  return response.data;
};

/**
 * 動画更新
 */
export const updateVideo = async (id: string, data: {
  title?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  isVisible?: boolean;
}) => {
  const response = await apiClient.put(`/videos/${id}`, data);
  return response.data;
};

/**
 * 動画削除
 */
export const deleteVideo = async (id: string) => {
  const response = await apiClient.delete(`/videos/${id}`);
  return response.data;
};

/**
 * コメント追加
 */
export const addVideoComment = async (videoId: string, content: string) => {
  const response = await apiClient.post(`/videos/${videoId}/comments`, { content });
  return response.data;
};

/**
 * 動画統計情報取得
 */
export const getVideoStats = async (id: string) => {
  const response = await apiClient.get(`/videos/${id}/stats`);
  return response.data;
};

/**
 * ダッシュボード統計情報取得
 */
export const getDashboardStats = async () => {
  const response = await apiClient.get('/videos/dashboard/stats');
  return response.data;
};

export default apiClient;

