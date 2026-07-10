export interface Link {
  id: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  isActive: boolean;
  isDeleted: boolean;
  clickCount: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Click {
  id: string;
  linkId: string;
  country: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  referrer: string | null;
  createdAt: string;
}

export interface LinkAnalytics {
  link: Link;
  analytics: {
    totalClicks: number;
    clicks: Click[];
    clicksByDate: { createdAt: string; _count: number }[];
    clicksByCountry: { country: string; _count: number }[];
    clicksByBrowser: { browser: string; _count: number }[];
    clicksByDevice: { device: string; _count: number }[];
    clicksByReferrer: { referrer: string; _count: number }[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  message?: string;
}
