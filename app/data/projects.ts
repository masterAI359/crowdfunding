// Type definitions for projects and videos
// Note: Mock data has been removed. Use API calls instead.

export interface Project {
  id: number | string;
  title: string;
  description: string;
  amount: string;
  supporters: string;
  daysLeft: string;
  achievementRate: number;
  image: string;
}

export interface BannerProject {
  id: number | string;
  title: string;
  description: string;
  image: string;
  amount: string;
  achievementRate: string;
  supporters: string;
  daysLeft: string;
}

export interface BannerVideo {
  id: number | string;
  image: string;
  categoryLabel: string;
}

export interface Video {
  id: number | string;
  title: string;
  image: string;
  categoryLabel: string;
  userLabel: string;
  viewCount: string;
  viewDate: number;
}
