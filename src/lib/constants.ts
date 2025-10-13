// Brand Colors (matching the mobile app)
export const BRAND_COLORS = {
  primary: '#009CB9',
  accent: '#16DAFF', 
  background: '#ABF2FF',
  lightBackground: '#F0F8FF',
  black: '#212121',
  darkGray: '#757575',
  success: '#4CAF50',
  error: '#F44336',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com',
  endpoints: {
    storeProfile: (storeId: string) => `/stores/${storeId}/profile`,
    storeProducts: (storeId: string) => `/stores/${storeId}/products`,
    storeCategories: (storeId: string) => `/stores/${storeId}/categories`,
    storeReviews: (storeId: string) => `/api/v1/reviews/stores/${storeId}`,
    followStore: (storeId: string) => `/stores/${storeId}/follow`,
    images: {
      preview: (imageId: string) => `/get-preview-image/${imageId}`,
      detail: (imageId: string) => `/get-detail-image/${imageId}`,
      fullscreen: (imageId: string) => `/get-fullscreen-image/${imageId}`,
      banner: (imageId: string) => `/get-banner-image/${imageId}`,
      original: (imageId: string) => `/get-original-image/${imageId}`,
    },
  },
} as const;

// Deep Link Configuration
export const DEEP_LINK_CONFIG = {
  scheme: 'downxtown',
  host: 'store',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.downxtown.app',
  appStoreUrl: 'https://apps.apple.com/app/downxtown/id123456789', // Update with actual App Store URL
} as const;

// Store Profile Tabs
export const STORE_TABS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories', 
  REVIEWS: 'reviews',
  ABOUT: 'about',
} as const;

// Sort Options
export const SORT_OPTIONS = {
  RECENT: 'RECENT',
  PRICE_LOW_TO_HIGH: 'PRICE_LOW_TO_HIGH',
  PRICE_HIGH_TO_LOW: 'PRICE_HIGH_TO_LOW',
  RATING: 'RATING',
  POPULAR: 'POPULAR',
} as const;

// SEO Configuration
export const SEO_CONFIG = {
  siteName: 'Downxtown',
  defaultTitle: 'Downxtown - Social Commerce Platform',
  defaultDescription: 'Discover amazing products from local stores on Downxtown',
  defaultImage: '/og-image.png',
  twitterHandle: '@downxtown',
} as const;