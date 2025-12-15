"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { 
  getCurrentUser, 
  getVideosByOwner, 
  createVideo, 
  updateVideo, 
  deleteVideo,
  getDashboardStats,
  getVideoStats,
  getVideoComments,
  hideVideoComment,
  showVideoComment,
  getUserLogs,
  uploadFiles
} from "@/app/lib/api";
import LoadingSpinner from "@/app/components/loading-spinner";
import Image from "next/image";

const SellerDashboardPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get active tab from URL or state - MUST be called before any conditional returns
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      loadUserData();
      loadDashboardData();
      setIsAdmin(user?.isAdministrator || false);
    }
  }, [isAuthenticated, loading, user]);

  const loadUserData = async () => {
    try {
      const data = await getCurrentUser();
      setUserData(data);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const loadDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const [videosData, stats] = await Promise.all([
        getVideosByOwner(1, 100),
        getDashboardStats()
      ]);
      setVideos(videosData.videos || []);
      setDashboardStats(stats);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", href: "/user-settings/seller" },
    { id: "products", label: "Products", href: "/user-settings/seller?tab=products" },
    { id: "crowdfunding", label: "クラウドファンディング", href: "/user-settings/seller?tab=crowdfunding" },
    { id: "videos", label: "動画コンテンツ", href: "/user-settings/seller?tab=videos" },
    { id: "payment", label: "支払い", href: "/user-settings/seller?tab=payment" },
    { id: "notifications", label: "全ての通知", href: "/user-settings/seller?tab=notifications" },
    { id: "customer", label: "カスタマー", href: "/user-settings/seller?tab=customer" },
  ];

  // Add logs tab for admin
  if (isAdmin) {
    menuItems.push({ id: "logs", label: "ユーザーログ", href: "/user-settings/seller?tab=logs" });
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-6">出品者管理ページ</h1>
              
              {/* User Profile Section */}
              <div className="mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4 mx-auto relative">
                  <span className="text-2xl text-gray-500">
                    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">{userData?.name || "user_name"}</p>
                  <p className="text-sm text-gray-500">{userData?.email}</p>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id || (item.id === "dashboard" && !activeTab);
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        router.push(item.href);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#FF0066] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {isLoadingData ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {activeTab === "dashboard" && (
                  <DashboardTab stats={dashboardStats} videos={videos} />
                )}
                {activeTab === "videos" && (
                  <VideosTab 
                    videos={videos} 
                    onRefresh={loadDashboardData}
                    isAdmin={isAdmin}
                  />
                )}
                {activeTab === "products" && (
                  <ProductsTab />
                )}
                {activeTab === "crowdfunding" && (
                  <CrowdfundingTab />
                )}
                {activeTab === "payment" && (
                  <PaymentTab />
                )}
                {activeTab === "notifications" && (
                  <NotificationsTab />
                )}
                {activeTab === "customer" && (
                  <CustomerTab />
                )}
                {activeTab === "logs" && isAdmin && (
                  <LogsTab />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, videos }: { stats: any; videos: any[] }) => {
  const [purchaseData, setPurchaseData] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    // Use real data from stats if available
    if (stats?.purchaseData && stats?.salesData) {
      setPurchaseData(stats.purchaseData);
      setSalesData(stats.salesData);
    } else {
      // Fallback: Generate empty data for last 30 days if no data available
      const days = 30;
      const purchases: any[] = [];
      const sales: any[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        purchases.push({
          date: date.toISOString().split('T')[0],
          count: 0,
          amount: 0,
        });
        sales.push({
          date: date.toISOString().split('T')[0],
          count: 0,
          amount: 0,
        });
      }
      
      setPurchaseData(purchases);
      setSalesData(sales);
    }
  }, [stats]);

  const totalPurchases = purchaseData.reduce((sum, d) => sum + d.count, 0);
  const totalSales = salesData.reduce((sum, d) => sum + d.amount, 0);
  const totalPurchasesAmount = purchaseData.reduce((sum, d) => sum + d.amount, 0);

  const maxPurchaseCount = Math.max(...purchaseData.map(d => d.count), 1);
  const maxSalesAmount = Math.max(...salesData.map(d => d.amount), 1);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Overall Financials */}
      <div className="bg-gradient-to-r from-[#FF0066] to-[#FFA101] rounded-lg p-8 text-white">
        <div className="text-4xl font-bold mb-2">
          ¥{(stats?.totalSales || totalSales).toLocaleString()}
        </div>
        <div className="text-lg opacity-90">総売上</div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-gray-900">
            {stats?.totalVideos || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">総動画数</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-gray-900">
            {(stats?.totalViews || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">総視聴回数</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-gray-900">
            {(stats?.totalPurchases || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">総購入数</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-2xl font-bold text-gray-900">
            {(stats?.totalAccess || 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">総アクセス数</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchases Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            購入、過去30日間 ({totalPurchases})
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {purchaseData.map((data, index) => (
              <div
                key={index}
                className="flex-1 bg-[#FF0066] rounded-t"
                style={{
                  height: `${(data.count / maxPurchaseCount) * 100}%`,
                  minHeight: '4px',
                }}
                title={`${data.date}: ${data.count}`}
              />
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            総売上、過去30日間 (¥{totalPurchasesAmount.toLocaleString()})
          </h3>
          <div className="h-64 flex items-end justify-between gap-1">
            {salesData.map((data, index) => (
              <div
                key={index}
                className="flex-1 bg-[#FFA101] rounded-t"
                style={{
                  height: `${(data.amount / maxSalesAmount) * 100}%`,
                  minHeight: '4px',
                }}
                title={`${data.date}: ¥${data.amount.toLocaleString()}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Videos Tab Component
const VideosTab = ({ videos, onRefresh, isAdmin }: { videos: any[]; onRefresh: () => void; isAdmin: boolean }) => {
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", url: "", thumbnailUrl: "" });
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoComments, setVideoComments] = useState<any[]>([]);
  const [videoStats, setVideoStats] = useState<any>(null);

  const handleEdit = (video: any) => {
    setEditingVideo(video.id);
    setEditForm({ title: video.title, description: video.description || "" });
  };

  const handleSave = async (videoId: string) => {
    try {
      await updateVideo(videoId, {
        title: editForm.title,
        description: editForm.description,
      });
      setEditingVideo(null);
      onRefresh();
    } catch (error) {
      console.error("Failed to update video:", error);
      alert("動画の更新に失敗しました");
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("本当にこの動画を削除しますか？")) return;
    try {
      await deleteVideo(videoId);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete video:", error);
      alert("動画の削除に失敗しました");
    }
  };

  const handleToggleVisibility = async (video: any) => {
    try {
      await updateVideo(video.id, { isVisible: !video.isVisible });
      onRefresh();
    } catch (error) {
      console.error("Failed to update video visibility:", error);
      alert("動画の表示設定の更新に失敗しました");
    }
  };

  const handleFileSelect = (type: 'video' | 'thumbnail', file: File | null) => {
    if (type === 'video') {
      setSelectedVideoFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setVideoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setVideoPreview(null);
      }
    } else {
      setSelectedThumbnailFile(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setThumbnailPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setThumbnailPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title) {
      alert("タイトルを入力してください");
      return;
    }

    // Either file upload or URL must be provided
    if (!selectedVideoFile && !uploadForm.url) {
      alert("動画ファイルを選択するか、動画URLを入力してください");
      return;
    }

    try {
      setIsUploading(true);
      let videoUrl = uploadForm.url;
      let thumbnailUrl = uploadForm.thumbnailUrl;

      // Upload files if selected
      if (selectedVideoFile || selectedThumbnailFile) {
        const filesToUpload: File[] = [];
        if (selectedVideoFile) filesToUpload.push(selectedVideoFile);
        if (selectedThumbnailFile) filesToUpload.push(selectedThumbnailFile);

        const uploadResult = await uploadFiles(filesToUpload);
        const uploadedFiles = uploadResult.files || [];

        // Assign URLs based on file types
        uploadedFiles.forEach((file: any) => {
          if (file.mimetype.startsWith('video/')) {
            videoUrl = file.url;
          } else if (file.mimetype.startsWith('image/')) {
            thumbnailUrl = file.url;
          }
        });
      }

      // Ensure videoUrl is valid (either from upload or user input)
      if (!videoUrl || videoUrl.trim() === '') {
        alert("動画URLが無効です。動画ファイルを選択するか、動画URLを入力してください。");
        setIsUploading(false);
        return;
      }

      // Validate videoUrl is a proper URL
      try {
        new URL(videoUrl);
      } catch (e) {
        alert("動画URLの形式が正しくありません");
        setIsUploading(false);
        return;
      }

      // Only include thumbnailUrl if it's a valid non-empty string
      const videoData: {
        title: string;
        description?: string;
        url: string;
        thumbnailUrl?: string;
      } = {
        title: uploadForm.title,
        description: uploadForm.description || undefined,
        url: videoUrl,
      };

      // Only add thumbnailUrl if it's a valid URL
      if (thumbnailUrl && thumbnailUrl.trim() !== '') {
        try {
          new URL(thumbnailUrl);
          videoData.thumbnailUrl = thumbnailUrl;
        } catch (e) {
          // If thumbnailUrl is invalid, just skip it
          console.warn('Invalid thumbnail URL, skipping:', thumbnailUrl);
        }
      }

      await createVideo(videoData);
      
      // Reset form
      setShowUploadModal(false);
      setUploadForm({ title: "", description: "", url: "", thumbnailUrl: "" });
      setSelectedVideoFile(null);
      setSelectedThumbnailFile(null);
      setVideoPreview(null);
      setThumbnailPreview(null);
      onRefresh();
    } catch (error: any) {
      console.error("Failed to upload video:", error);
      alert(error.response?.data?.message || "動画のアップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const loadVideoDetails = async (videoId: string) => {
    try {
      const [comments, stats] = await Promise.all([
        getVideoComments(videoId),
        getVideoStats(videoId),
      ]);
      setVideoComments(comments || []);
      setVideoStats(stats);
    } catch (error) {
      console.error("Failed to load video details:", error);
    }
  };

  const handleToggleCommentVisibility = async (commentId: string, isHidden: boolean) => {
    try {
      if (isHidden) {
        await showVideoComment(commentId);
      } else {
        await hideVideoComment(commentId);
      }
      if (selectedVideo) {
        loadVideoDetails(selectedVideo);
      }
    } catch (error) {
      console.error("Failed to toggle comment visibility:", error);
      alert("コメントの表示設定の更新に失敗しました");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">動画コンテンツ</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] transition-colors"
        >
          動画をアップロード
        </button>
      </div>

      {/* Video List */}
      <div className="space-y-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex gap-6">
              {/* Thumbnail */}
              <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden">
                {video.thumbnailUrl ? (
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="flex-1">
                {editingVideo === video.id ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                      placeholder="タイトル"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                      placeholder="説明文"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(video.id)}
                        className="px-4 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C]"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingVideo(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{video.description || "説明なし"}</p>
                    
                    {/* Statistics */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">視聴回数</div>
                        <div className="text-lg font-semibold text-gray-900">{video.viewCount?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">購入数</div>
                        <div className="text-lg font-semibold text-gray-900">{video.purchaseCount?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">アクセス数</div>
                        <div className="text-lg font-semibold text-gray-900">{video.accessCount?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">コメント数</div>
                        <div className="text-lg font-semibold text-gray-900">{video.commentCount?.toLocaleString() || 0}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(video)}
                        className={`px-4 py-2 rounded-lg ${
                          video.isVisible
                            ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
                            : "bg-green-200 text-green-800 hover:bg-green-300"
                        }`}
                      >
                        {video.isVisible ? "非表示" : "表示"}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVideo(video.id);
                          loadVideoDetails(video.id);
                        }}
                        className="px-4 py-2 bg-blue-200 text-blue-800 rounded-lg hover:bg-blue-300"
                      >
                        コメント確認
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="px-4 py-2 bg-red-200 text-red-800 rounded-lg hover:bg-red-300"
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">動画をアップロード</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">タイトル *</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  placeholder="動画のタイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">説明文</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  rows={4}
                  placeholder="動画の説明を入力"
                />
              </div>

              {/* Video Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  動画ファイル *
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect('video', e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  />
                  {videoPreview && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {selectedVideoFile && (
                    <p className="text-sm text-gray-600">
                      選択中: {selectedVideoFile.name} ({(selectedVideoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">または</p>
                <input
                  type="url"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] mt-2"
                  placeholder="動画URLを入力"
                />
              </div>

              {/* Thumbnail Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サムネイル画像
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect('thumbnail', e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066]"
                  />
                  {thumbnailPreview && (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {selectedThumbnailFile && (
                    <p className="text-sm text-gray-600">
                      選択中: {selectedThumbnailFile.name} ({(selectedThumbnailFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">または</p>
                <input
                  type="url"
                  value={uploadForm.thumbnailUrl}
                  onChange={(e) => setUploadForm({ ...uploadForm, thumbnailUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF0066] mt-2"
                  placeholder="サムネイルURLを入力"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: "", description: "", url: "", thumbnailUrl: "" });
                  setSelectedVideoFile(null);
                  setSelectedThumbnailFile(null);
                  setVideoPreview(null);
                  setThumbnailPreview(null);
                }}
                disabled={isUploading}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-6 py-2 bg-[#FF0066] text-white rounded-lg hover:bg-[#E6005C] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading && <LoadingSpinner size="sm" className="text-white" />}
                {isUploading ? "アップロード中..." : "アップロード"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">コメント一覧</h2>
              <button
                onClick={() => {
                  setSelectedVideo(null);
                  setVideoComments([]);
                  setVideoStats(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {videoStats && (
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">視聴回数</div>
                  <div className="text-lg font-semibold">{videoStats.viewCount?.toLocaleString() || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">購入数</div>
                  <div className="text-lg font-semibold">{videoStats.purchaseCount?.toLocaleString() || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">アクセス数</div>
                  <div className="text-lg font-semibold">{videoStats.accessCount?.toLocaleString() || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">コメント数</div>
                  <div className="text-lg font-semibold">{videoStats.commentCount?.toLocaleString() || 0}</div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {videoComments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">コメントはありません</p>
              ) : (
                videoComments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className={`p-4 border rounded-lg ${
                      comment.isHidden ? "bg-gray-100 opacity-60" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {comment.user?.name || "匿名ユーザー"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleString("ja-JP")}
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleToggleCommentVisibility(comment.id, comment.isHidden)}
                          className={`px-3 py-1 rounded text-sm ${
                            comment.isHidden
                              ? "bg-green-200 text-green-800 hover:bg-green-300"
                              : "bg-red-200 text-red-800 hover:bg-red-300"
                          }`}
                        >
                          {comment.isHidden ? "表示" : "非表示"}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder tabs
const ProductsTab = () => <div className="p-8"><h1 className="text-2xl font-bold">Products</h1></div>;
const CrowdfundingTab = () => <div className="p-8"><h1 className="text-2xl font-bold">クラウドファンディング</h1></div>;
const PaymentTab = () => <div className="p-8"><h1 className="text-2xl font-bold">支払い</h1></div>;
const NotificationsTab = () => <div className="p-8"><h1 className="text-2xl font-bold">全ての通知</h1></div>;
const CustomerTab = () => <div className="p-8"><h1 className="text-2xl font-bold">カスタマー</h1></div>;

// Logs Tab Component (Admin only)
const LogsTab = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ userId: "", action: "" });

  useEffect(() => {
    loadLogs();
  }, [filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getUserLogs(filters.userId || undefined, filters.action || undefined);
      setLogs(data.logs || []);
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">ユーザーログ</h1>
      
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="ユーザーID"
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="アクション"
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ユーザーID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクション</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">詳細</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.createdAt).toLocaleString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.userId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.action}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {JSON.stringify(log.metadata || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerDashboardPage;

