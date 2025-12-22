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
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    products: false,
    sales: false,
    contacts: false,
  });

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

  // Auto-expand sections if their children are active
  useEffect(() => {
    setExpandedSections(prev => {
      const newExpanded: { [key: string]: boolean } = { ...prev };
      
      // Check Products section
      if (activeTab === "crowdfunding" || activeTab === "videos") {
        newExpanded.products = true;
      }
      
      // Check Sales section
      if (activeTab === "payment") {
        newExpanded.sales = true;
      }
      
      // Check Contacts section
      if (activeTab === "notifications") {
        newExpanded.contacts = true;
      }
      
      return newExpanded;
    });
  }, [activeTab]);

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

  // Menu structure with categories
  const menuStructure = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/user-settings/seller",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      type: "single" as const,
    },
    {
      id: "products",
      label: "Products",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      type: "category" as const,
      children: [
        { id: "crowdfunding", label: "クラウドファンディング", href: "/user-settings/seller?tab=crowdfunding" },
        { id: "videos", label: "動画コンテンツ", href: "/user-settings/seller?tab=videos" },
      ],
    },
    {
      id: "sales",
      label: "販売",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      type: "category" as const,
      children: [
        { id: "payment", label: "支払い", href: "/user-settings/seller?tab=payment" },
      ],
    },
    {
      id: "contacts",
      label: "連絡先",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      type: "category" as const,
      children: [
        { id: "notifications", label: "全ての連絡先", href: "/user-settings/seller?tab=notifications" },
      ],
    },
    {
      id: "customer",
      label: "カスタマー",
      href: "/user-settings/seller?tab=customer",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      type: "single" as const,
    },
  ];

  // Add logs tab for admin
  if (isAdmin) {
    menuStructure.push({
      id: "logs",
      label: "ユーザーログ",
      href: "/user-settings/seller?tab=logs",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      type: "single" as const,
    });
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="min-h-screen bg-white text-black">
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
              <nav className="space-y-1">
                {menuStructure.map((item) => {
                  if (item.type === "single") {
                    const isActive = activeTab === item.id || (item.id === "dashboard" && !activeTab);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (item.href) {
                            router.push(item.href);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                          isActive
                            ? "bg-[#FF0066] text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  } else if (item.type === "category" && item.children) {
                    const isExpanded = expandedSections[item.id] || false;
                    const hasActiveChild = item.children.some(child => activeTab === child.id);

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          onClick={() => toggleSection(item.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                            hasActiveChild
                              ? "bg-gray-50 text-gray-900"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isExpanded && (
                          <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                            {item.children.map((child) => {
                              const isActive = activeTab === child.id;
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    setActiveTab(child.id);
                                    router.push(child.href);
                                  }}
                                  className={`w-full text-left px-2 py-2 rounded-lg text-sm transition-colors ${
                                    isActive
                                      ? "bg-[#FF0066] text-white"
                                      : "text-gray-800 hover:bg-gray-100"
                                  }`}
                                >
                                  {child.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-auto">
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
  const [dateRange, setDateRange] = useState("7days");
  const [currency, setCurrency] = useState("USD");
  const [purchaseData, setPurchaseData] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // USD to JPY conversion rate
  const USD_TO_JPY = 150;

  // Conversion helper function
  const convertToCurrency = (jpyValue: number) => {
    if (currency === "USD") {
      return Math.round(jpyValue / USD_TO_JPY);
    }
    return jpyValue;
  };

  const formatCurrency = (value: number) => {
    if (currency === "USD") {
      return `$${value.toLocaleString()}`;
    }
    return `¥${value.toLocaleString()}`;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Use real data from stats if available
    let currentPurchaseData: any[] = [];
    let currentSalesData: any[] = [];
    
    if (stats?.purchaseData && stats?.salesData) {
      currentPurchaseData = stats.purchaseData;
      currentSalesData = stats.salesData;
      setPurchaseData(currentPurchaseData);
      setSalesData(currentSalesData);
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
      
      currentPurchaseData = purchases;
      currentSalesData = sales;
      setPurchaseData(purchases);
      setSalesData(sales);
    }

    // Generate revenue trend data for the main chart using actual backend data
    const generateRevenueData = (salesDataToUse: any[]) => {
      const now = new Date();
      const currentPeriod: any[] = [];
      const previousPeriod: any[] = [];
      
      // Current period: Last 7 days (today - 6 days ago to today)
      const currentPeriodData: { [key: string]: number } = {};
      salesDataToUse.forEach((sale) => {
        const saleDate = new Date(sale.date);
        const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 0 && daysDiff < 7) {
          const dateKey = saleDate.toISOString().split('T')[0];
          currentPeriodData[dateKey] = (currentPeriodData[dateKey] || 0) + sale.amount;
        }
      });

      // Previous period: 7 days before current period (7-13 days ago)
      const previousPeriodData: { [key: string]: number } = {};
      salesDataToUse.forEach((sale) => {
        const saleDate = new Date(sale.date);
        const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 7 && daysDiff < 14) {
          const dateKey = saleDate.toISOString().split('T')[0];
          previousPeriodData[dateKey] = (previousPeriodData[dateKey] || 0) + sale.amount;
        }
      });

      // Generate current period dates (last 7 days)
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const dateLabel = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
        currentPeriod.push({
          x: dateLabel,
          y: currentPeriodData[dateKey] || 0
        });
      }

      // Generate previous period dates - use same x-axis labels as current period but data from 7 days earlier
      for (let i = 6; i >= 0; i--) {
        const currentDate = new Date(now);
        currentDate.setDate(currentDate.getDate() - i);
        const dateLabel = currentDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
        
        // Get data from 7 days before this date
        const previousDate = new Date(currentDate);
        previousDate.setDate(previousDate.getDate() - 7);
        const previousDateKey = previousDate.toISOString().split('T')[0];
        
        previousPeriod.push({
          x: dateLabel, // Same label as current period for alignment
          y: previousPeriodData[previousDateKey] || 0
        });
      }

      // Format period labels for legend
      const currentStart = new Date(now);
      currentStart.setDate(currentStart.getDate() - 6);
      const currentEnd = new Date(now);
      const previousStart = new Date(now);
      previousStart.setDate(previousStart.getDate() - 13);
      const previousEnd = new Date(now);
      previousEnd.setDate(previousEnd.getDate() - 7);

      setRevenueData({
        current: currentPeriod,
        previous: previousPeriod,
        currentLabel: `${currentStart.getMonth() + 1}月${currentStart.getDate()}日~${currentEnd.getMonth() + 1}月${currentEnd.getDate()}日`,
        previousLabel: `${previousStart.getMonth() + 1}月${previousStart.getDate()}日~${previousEnd.getMonth() + 1}月${previousEnd.getDate()}日`
      });
    };

    generateRevenueData(currentSalesData);
  }, [stats]);

  // Calculate totals from actual backend data (in JPY)
  const totalPurchases = purchaseData.reduce((sum, d) => sum + d.count, 0);
  const totalSalesLast30DaysJPY = salesData.reduce((sum, d) => sum + d.amount, 0);
  const netRevenueJPY = stats?.totalSales || 0; // All-time high net revenue from backend (JPY)

  // Calculate metrics using only real backend data
  const totalRevenueJPY = totalSalesLast30DaysJPY; // Use actual sales data
  const subscriptionRevenueJPY = 0; // No subscription data available in backend
  const optIns = 0; // No opt-in data available in backend
  const offersSold = totalPurchases; // Use actual purchase count

  // Convert to selected currency
  const totalRevenue = convertToCurrency(totalRevenueJPY);
  const subscriptionRevenue = convertToCurrency(subscriptionRevenueJPY);
  const netRevenue = convertToCurrency(netRevenueJPY);
  const totalSalesLast30Days = convertToCurrency(totalSalesLast30DaysJPY);

  // Main revenue chart configuration
  const mainChartOptions: any = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#9333EA', '#FF6B35'],
    plotOptions: {
      area: {
        fillTo: 'end'
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: revenueData?.current.map((d: any) => d.x) || [],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        },
        formatter: (val: number) => {
          // Convert JPY value to display currency
          const displayVal = currency === "USD" ? val / USD_TO_JPY : val;
          if (currency === "USD") {
            if (displayVal >= 1000) {
              return `$${Math.round(displayVal / 1000)}k`;
            }
            return `$${Math.round(displayVal)}`;
          } else {
            if (displayVal >= 1000000) {
              return `¥${Math.round(displayVal / 1000000)}m`;
            } else if (displayVal >= 1000) {
              return `¥${Math.round(displayVal / 1000)}k`;
            }
            return `¥${Math.round(displayVal)}`;
          }
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        width: 8,
        height: 8,
        radius: 4
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          // val is in JPY, convert if needed
          const displayVal = currency === "USD" ? val / USD_TO_JPY : val;
          return formatCurrency(displayVal);
        }
      }
    }
  };

  const mainChartSeries = revenueData ? [
    {
      name: revenueData.previousLabel || '前週',
      data: revenueData.previous.map((d: any) => {
        // Convert JPY to selected currency
        return currency === "USD" ? d.y / USD_TO_JPY : d.y;
      }),
      stroke: {
        width: 2,
        dashArray: 5
      }
    },
    {
      name: revenueData.currentLabel || '今週',
      data: revenueData.current.map((d: any) => {
        // Convert JPY to selected currency
        return currency === "USD" ? d.y / USD_TO_JPY : d.y;
      }),
      stroke: {
        width: 3
      }
    }
  ] : [];

  // Mini chart for purchases (last 30 days) - using actual backend data
  const purchaseChartOptions: any = {
    chart: {
      type: 'area',
      height: 100,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#9333EA']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      labels: { show: false },
      categories: purchaseData.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
      })
    },
    yaxis: {
      labels: { show: false }
    },
    grid: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => val.toLocaleString()
      }
    }
  };

  const purchaseChartSeries = [{
    name: '購入',
    data: purchaseData.map(d => d.count)
  }];

  // Mini chart for total revenue (last 30 days) - using actual backend data
  const revenueChartOptions: any = {
    chart: {
      type: 'area',
      height: 100,
      toolbar: { show: false },
      sparkline: { enabled: true }
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: ['#9333EA']
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      labels: { show: false },
      categories: salesData.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
      })
    },
    yaxis: {
      labels: { show: false }
    },
    grid: { show: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => {
          // val is in JPY, convert if needed
          const displayVal = currency === "USD" ? val / USD_TO_JPY : val;
          return formatCurrency(displayVal);
        }
      }
    }
  };

  const revenueChartSeries = [{
    name: '総収益',
    data: salesData.map(d => d.amount)
  }];

  return (
    <div className="space-y-8">
      {/* Net Revenue - All-time High Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 p-auto">
        <div className="text-sm text-gray-800 mb-2">純収益 - 過去最高</div>
        <div className="text-4xl font-bold text-gray-900 text-center">
          {formatCurrency(netRevenue)}
        </div>
      </div>

      {/* Controls and Main Metrics Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF0066] text-black"
            >
              <option value="7days">過去7日間</option>
              <option value="30days">過去30日間</option>
              <option value="90days">過去90日間</option>
            </select>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF0066] text-black"
            >
              <option value="USD">米ドル</option>
              <option value="JPY">日本円</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Four Key Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <div className="text-sm text-gray-800 mb-1">総収益</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatCurrency(totalRevenue)}
            </div>
            {/* Trend indicator - calculated from actual data */}
            {revenueData && revenueData.previous && revenueData.current && (() => {
              const previousTotal = revenueData.previous.reduce((sum: number, d: any) => sum + d.y, 0);
              const currentTotal = revenueData.current.reduce((sum: number, d: any) => sum + d.y, 0);
              if (previousTotal > 0) {
                const changePercent = ((currentTotal - previousTotal) / previousTotal) * 100;
                const isPositive = changePercent >= 0;
                return (
                  <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      {isPositive ? (
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span>{Math.abs(changePercent).toFixed(1)}%</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <div className="text-sm text-gray-800 mb-1">サブスクリプション収益</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatCurrency(subscriptionRevenue)}
            </div>
            {/* No trend data available for subscription revenue */}
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-800 mb-1">オプトイン</div>
            <div className="text-2xl font-bold text-gray-900">{optIns}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-800 mb-1">販売済みオファー</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{offersSold}</div>
            {/* Trend indicator - can be calculated if previous period purchase data is available */}
            {purchaseData.length > 0 && (() => {
              // Compare last 7 days vs previous 7 days
              const now = new Date();
              const last7Days = purchaseData.filter(d => {
                const saleDate = new Date(d.date);
                const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff >= 0 && daysDiff < 7;
              });
              const prev7Days = purchaseData.filter(d => {
                const saleDate = new Date(d.date);
                const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
                return daysDiff >= 7 && daysDiff < 14;
              });
              const last7DaysCount = last7Days.reduce((sum, d) => sum + d.count, 0);
              const prev7DaysCount = prev7Days.reduce((sum, d) => sum + d.count, 0);
              if (prev7DaysCount > 0) {
                const changePercent = ((last7DaysCount - prev7DaysCount) / prev7DaysCount) * 100;
                const isPositive = changePercent >= 0;
                return (
                  <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      {isPositive ? (
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span>{Math.abs(changePercent).toFixed(1)}%</span>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* Main Revenue Trend Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {isMounted && (
            <Chart
              options={mainChartOptions}
              series={mainChartSeries}
              type="area"
              height={350}
            />
          )}
        </div>
      </div>

      {/* Bottom Three Metric Cards with Mini Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchases - Last 30 Days */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 relative">
          <div className="text-sm text-gray-800 mb-2">購入 - 過去30日間</div>
          <div className="text-3xl font-bold text-gray-900 mb-4">{totalPurchases.toLocaleString()}</div>
          {isMounted && (
            <Chart
              options={purchaseChartOptions}
              series={purchaseChartSeries}
              type="area"
              height={100}
            />
          )}
        </div>

        {/* Total Revenue - Last 30 Days */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 relative">
          <div className="text-sm text-gray-800 mb-2">総収益 - 過去30日間</div>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {formatCurrency(totalSalesLast30Days)}
          </div>
          {isMounted && (
            <Chart
              options={revenueChartOptions}
              series={revenueChartSeries}
              type="area"
              height={100}
            />
          )}
        </div>

        {/* Net Revenue - All-time High */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-800 mb-2">純収益 - 過去最高</div>
          <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-900">
            {formatCurrency(netRevenue)}
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
                    <p className="text-sm text-gray-800 mb-4">{video.description || "説明なし"}</p>
                    
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
                    <p className="text-sm text-gray-800">
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
                    <p className="text-sm text-gray-800">
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

