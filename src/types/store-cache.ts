// Store caching system types
// Mirrors the userStorage pattern for consistency

import {
  StoreProfileData,
  MiniProduct,
  StoreCategoryResponse,
  StoreReview,
  ReviewStats
} from '@/lib/types';

/**
 * Cache data types with TTL metadata
 */

export interface CacheMetadata {
  key: string;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  expiresAt: number; // timestamp + ttl
}

/**
 * Cached Store Profile
 */
export interface CachedStoreProfile {
  storeData: StoreProfileData;
  cachedAt: number;
  expiresAt: number;
}

/**
 * Cached Products for a store (paginated)
 */
export interface CachedStoreProducts {
  storeId: string;
  page: number;
  products: MiniProduct[];
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  cachedAt: number;
  expiresAt: number;
}

/**
 * Cached Categories for a store
 */
export interface CachedStoreCategories {
  storeId: string;
  categories: StoreCategoryResponse[];
  totalItems: number;
  cachedAt: number;
  expiresAt: number;
}

/**
 * Cached Reviews for a store
 */
export interface CachedStoreReviews {
  storeId: string;
  page: number;
  reviews: StoreReview[];
  stats: ReviewStats;
  totalPages: number;
  totalReviews: number;
  hasNextPage: boolean;
  cachedAt: number;
  expiresAt: number;
}

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  STORE_PROFILE: 24 * 60 * 60 * 1000, // 24 hours (static info)
  PRODUCTS: 60 * 60 * 1000, // 1 hour (dynamic inventory)
  CATEGORIES: 60 * 60 * 1000, // 1 hour
  REVIEWS: 6 * 60 * 60 * 1000, // 6 hours
} as const;

/**
 * Cache key generators
 */
export const CACHE_KEYS = {
  storeProfile: (identifier: string) => `store_profile_${identifier}`,
  storeProducts: (storeId: string, page: number) => `store_products_${storeId}_page_${page}`,
  storeCategories: (storeId: string) => `store_categories_${storeId}`,
  storeReviews: (storeId: string, page: number) => `store_reviews_${storeId}_page_${page}`,
  metadata: (key: string) => `cache_metadata_${key}`,
} as const;

/**
 * Cache validation result
 */
export interface CacheValidationResult<T> {
  valid: boolean;
  data: T | null;
  reason?: 'expired' | 'not_found' | 'corrupted';
}
