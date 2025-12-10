// Utility functions for data transformation

/**
 * Format number as Japanese yen currency
 */
export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('ja-JP')}`;
};

/**
 * Format number with Japanese suffix
 */
export const formatNumber = (num: number, suffix: string = ''): string => {
  return `${num.toLocaleString('ja-JP')}${suffix}`;
};

/**
 * Transform backend project data to frontend format
 */
export const transformProject = (project: any) => {
  return {
    id: project.id,
    title: project.title,
    description: project.description || '',
    amount: formatCurrency(project.totalAmount || 0),
    supporters: `${project.supporterCount || 0}人`,
    daysLeft: `${project.remainingDays || 0}日`,
    achievementRate: project.achievementRate || 0,
    image: project.image || '/assets/crowdfunding/cf-1.png',
    // Keep original data for detailed views
    _original: project,
  };
};

/**
 * Transform backend project for banner/carousel format
 */
export const transformBannerProject = (project: any) => {
  return {
    id: project.id,
    title: project.title,
    description: project.description || '',
    image: project.image || '/assets/crowdfunding/cf-1.png',
    amount: formatCurrency(project.totalAmount || 0),
    achievementRate: `${project.achievementRate || 0}%`,
    supporters: `${project.supporterCount || 0}人`,
    daysLeft: `${project.remainingDays || 0}日`,
  };
};
