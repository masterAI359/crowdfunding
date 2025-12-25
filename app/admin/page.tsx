"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/hooks/useAuth";
import { getAdminDashboardStats } from "@/app/lib/api";
import LoadingSpinner from "@/app/components/loading-spinner";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface DashboardStats {
    overallNetProfit: number;
    latestNetProfit: number;
    netProfitTrend: Array<{ date: string; amount: number }>;
    videoPurchases30Days: number;
    videoPurchasesData: Array<{ date: string; amount: number }>;
    crowdfundingPurchases30Days: number;
    crowdfundingPurchasesData: Array<{ date: string; amount: number }>;
    soldVideosAmount: number;
    soldReturnsAmount: number;
}

export default function AdminPage() {
    const { user } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [dateRange, setDateRange] = useState("7days");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAdminDashboardStats(dateRange);
                setStats(data);
            } catch (err: any) {
                console.error("Failed to fetch dashboard stats:", err);
                setError(err.response?.data?.message || "データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dateRange]);

    if (loading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <p className="text-red-800">{error || "データの取得に失敗しました"}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Format dates for net profit trend chart based on dateRange
    const netProfitTrendDates = stats.netProfitTrend.map((item) => {
        const date = new Date(item.date);
        // For longer date ranges, show month/day format; for 7 days, show full date
        if (dateRange === "7days") {
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        } else {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
    });

    const netProfitTrendValues = stats.netProfitTrend.map((item) => item.amount);

    // Calculate max value for net profit chart (account for both series)
    const maxNetProfit = Math.max(...netProfitTrendValues, 1);
    const maxValue = Math.max(maxNetProfit, stats.overallNetProfit);

    const netProfitChartOptions: any = {
        chart: {
            type: 'line',
            height: 300,
            toolbar: { show: false },
            zoom: { enabled: true }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
        },
        colors: ['#FF6B35', '#FF0066'], // Orange for Net Profit, Pink for All-Time High
        plotOptions: {
            area: {
                fillTo: 'end'
            }
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            markers: {
                width: 8,
                height: 8,
                radius: 4
            }
        },
        xaxis: {
            categories: netProfitTrendDates,
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
                formatter: (value: number) => {
                    if (value === 0) {
                        return '0円';
                    }
                    if (value === 1000000) {
                        return '100万円';
                    }
                    if (value === 5000000) {
                        return '500万円';
                    }
                    if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(0)}万円`;
                    }
                    return `${value.toLocaleString()}円`;
                }
            },
            min: 0,
            max: maxValue > 0 ? maxValue * 1.1 : 5000000, // Add 10% padding or default to 500万円
            tickAmount: dateRange === "7days" ? 3 : 5, // More ticks for longer ranges
            forceNiceScale: false,
            decimalsInFloat: 0
        },
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (value: number) => `${value.toLocaleString()}円`
            }
        }
    };

    // Calculate all-time high line (constant value across all dates)
    const allTimeHighValues = netProfitTrendDates.map(() => stats.overallNetProfit);

    const netProfitChartSeries: any[] = [
        {
            name: '純利益',
            type: 'line',
            data: netProfitTrendValues,
            stroke: {
                width: 1,
                curve: 'smooth',
                colors: ['#FF6B35']
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'horizontal',
                    shadeIntensity: 0.5,
                    gradientToColors: ['#FF1B35'], // Red gradient
                    inverseColors: false,
                    opacityFrom: 0.8,
                    opacityTo: 0.3,
                    stops: [0, 50, 100]
                }
            }
        },
        {
            name: '過去最高',
            type: 'line',
            data: allTimeHighValues,
            stroke: {
                width: 1,
                dashArray: [5, 5], // Dotted line for All-Time High
                colors: ['#FF0066']
            }
        }
    ];

    // Crowdfunding Purchases Data (Past 30 days) - Left chart
    const crowdfundingPurchasesDates = stats.crowdfundingPurchasesData.map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const crowdfundingPurchasesValues = stats.crowdfundingPurchasesData.map((item) => item.amount);

    // Video Content Purchases Data (Past 30 days) - Right chart
    const videoPurchasesDates = stats.videoPurchasesData.map((item) => {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const videoPurchasesValues = stats.videoPurchasesData.map((item) => item.amount);

    // Calculate max values for charts
    const maxCrowdfundingPurchase = Math.max(...crowdfundingPurchasesValues, 1);
    const maxVideoPurchase = Math.max(...videoPurchasesValues, 1);

    // Area chart options for crowdfunding (left chart)
    const crowdfundingChartOptions: any = {
        chart: {
            type: 'area',
            height: 200,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#FF6B35']
        },
        colors: ['#FF6B35'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        plotOptions: {
            area: {
                fillTo: 'end'
            }
        },
        xaxis: {
            categories: crowdfundingPurchasesDates,
            labels: {
                show: false
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '10px'
                }
            },
            min: 0,
            max: maxCrowdfundingPurchase * 1.1 // Add 10% padding
        },
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 3,
            show: true
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (value: number) => `${value.toLocaleString('ja-JP')}円`
            }
        }
    };

    const crowdfundingChartSeries = [{
        name: '購入額',
        data: crowdfundingPurchasesValues
    }];

    // Area chart options for video purchases (right chart)
    const videoPurchasesChartOptions: any = {
        chart: {
            type: 'area',
            height: 200,
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#FF6B35']
        },
        colors: ['#FF6B35'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.1,
                stops: [0, 100]
            }
        },
        plotOptions: {
            area: {
                fillTo: 'end'
            }
        },
        xaxis: {
            categories: videoPurchasesDates,
            labels: {
                show: false
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '10px'
                }
            },
            min: 0,
            max: maxVideoPurchase * 1.1 // Add 10% padding
        },
        grid: {
            borderColor: '#E5E7EB',
            strokeDashArray: 3,
            show: true
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (value: number) => `${value.toLocaleString('ja-JP')}円`
            }
        }
    };

    const videoPurchasesChartSeries = [{
        name: '購入額',
        data: videoPurchasesValues
    }];

    const formatCurrency = (amount: number) => {
        return `${amount.toLocaleString('ja-JP')}円`;
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    管理者画面_ダッシュボード
                </h1>

                {/* Overall Profit Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                純利益・過去最高
                            </h2>
                            <p className="text-4xl font-bold text-gray-900">
                                {formatCurrency(stats.overallNetProfit)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Net Profit Trend Chart */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {/* Date Range Selector Button */}
                    <div className="mb-4 relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-[142px] flex items-center text-center gap-2 px-1 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                                {dateRange === "7days" ? "過去7日間" :
                                    dateRange === "30days" ? "過去30日間" :
                                        "過去90日間"}
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-1 w-[142px] bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                                    <button
                                        onClick={() => {
                                            setDateRange("7days");
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${dateRange === "7days" ? "bg-gray-100 font-medium" : "text-gray-700"
                                            }`}
                                    >
                                        過去7日間
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDateRange("30days");
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${dateRange === "30days" ? "bg-gray-100 font-medium" : "text-gray-700"
                                            }`}
                                    >
                                        過去30日間
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDateRange("90days");
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${dateRange === "90days" ? "bg-gray-100 font-medium" : "text-gray-700"
                                            }`}
                                    >
                                        過去90日間
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Summary Metrics */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-gray-100 rounded-lg px-4 py-auto w-[242px] h-[60px] flex flex-col justify-center">
                            <h3 className="text-[14px] font-weight-[400] text-black">
                                純利益・過去最高
                            </h3>
                            <p className="text-[19px] font-bold font-weight-[900] text-black">
                                {formatCurrency(stats.overallNetProfit)}
                            </p>
                        </div>
                        <div className="flex gap-8 text-right space-y-1">
                            <div className="flex flex-col">
                                <p className="text-[14px] font-weight-[400] letterspacing-[3%] text-black">販売済み動画</p>
                                <span className="text-[19px] font-weight-[900] font-bold text-black">{formatCurrency(stats.soldVideosAmount)}</span>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[14px] font-weight-[400] letterspacing-[-0.02em] text-black">販売済みリターン</p>
                                <span className="text-[19px] font-weight-[900] font-bold text-black">{formatCurrency(stats.soldReturnsAmount)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    {isMounted && (
                        <Chart
                            options={netProfitChartOptions}
                            series={netProfitChartSeries}
                            type="line"
                            height={300}
                        />
                    )}
                </div>

                {/* Purchases Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Crowdfunding Sales (Left Chart) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                クラウドファンディング購入-過去30日間
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.crowdfundingPurchases30Days)}
                            </p>
                        </div>
                        {isMounted && (
                            <Chart
                                options={crowdfundingChartOptions}
                                series={crowdfundingChartSeries}
                                type="area"
                                height={200}
                            />
                        )}
                    </div>

                    {/* Video Content Purchases (Right Chart) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                動画コンテンツ購入-過去30日間
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatCurrency(stats.videoPurchases30Days)}
                            </p>
                        </div>
                        {isMounted && (
                            <Chart
                                options={videoPurchasesChartOptions}
                                series={videoPurchasesChartSeries}
                                type="area"
                                height={200}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

