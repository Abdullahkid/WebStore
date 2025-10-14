'use client';

/**
 * Client-side cache handler for store data
 * This component wraps the store page and handles caching in IndexedDB
 * It runs only on the client side to save fetched data for future visits
 */

import { useEffect } from 'react';
import { storeStorage } from '@/lib/storage/storeStorage';
import type {
  StoreProfileData,
  StoreProductsResponse,
  StoreCategoriesResponse,
  PaginatedStoreReviewsResponse,
} from '@/lib/types';

interface StoreCacheHandlerProps {
  storeData: StoreProfileData;
  initialProductsData?: StoreProductsResponse['data'];
  initialCategoriesData?: StoreCategoriesResponse['data'];
  initialReviewsData?: PaginatedStoreReviewsResponse;
}

export default function StoreCacheHandler({
  storeData,
  initialProductsData,
  initialCategoriesData,
  initialReviewsData,
}: StoreCacheHandlerProps) {
  useEffect(() => {
    // Save store profile to cache
    if (storeData) {
      storeStorage.saveStoreProfile(storeData).catch((error) => {
        console.error('Failed to cache store profile:', error);
      });
    }

    // Save initial products to cache (page 1)
    if (initialProductsData && initialProductsData.products.length > 0) {
      storeStorage
        .saveStoreProducts(
          storeData.id,
          1, // First page
          initialProductsData.products,
          initialProductsData.totalPages,
          initialProductsData.totalProducts,
          initialProductsData.hasNextPage
        )
        .catch((error) => {
          console.error('Failed to cache store products:', error);
        });
    }

    // Save initial categories to cache
    if (initialCategoriesData && initialCategoriesData.items.length > 0) {
      storeStorage
        .saveStoreCategories(
          storeData.id,
          initialCategoriesData.items,
          initialCategoriesData.totalItems
        )
        .catch((error) => {
          console.error('Failed to cache store categories:', error);
        });
    }

    // Save initial reviews to cache (page 1)
    if (initialReviewsData && initialReviewsData.reviews && initialReviewsData.reviews.length > 0) {
      storeStorage
        .saveStoreReviews(
          storeData.id,
          1, // First page
          initialReviewsData.reviews,
          initialReviewsData.stats,
          initialReviewsData.totalPages,
          initialReviewsData.totalReviews,
          initialReviewsData.hasNextPage
        )
        .catch((error) => {
          console.error('Failed to cache store reviews:', error);
        });
    }
  }, [storeData, initialProductsData, initialCategoriesData, initialReviewsData]);

  // This component doesn't render anything, it just handles caching
  return null;
}
