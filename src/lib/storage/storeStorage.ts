// Store data caching service using IndexedDB
// Provides offline-first architecture for store profiles, products, categories, and reviews
// Mirrors the userStorage pattern for consistency

import {
  StoreProfileData,
  MiniProduct,
  StoreCategoryResponse,
  StoreReview,
  ReviewStats
} from '@/lib/types';
import {
  CachedStoreProfile,
  CachedStoreProducts,
  CachedStoreCategories,
  CachedStoreReviews,
  CacheMetadata,
  CacheValidationResult,
  CACHE_TTL,
  CACHE_KEYS
} from '@/types/store-cache';

class StoreStorageService {
  private dbName = 'DownxtownStoreDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  /**
   * Initialize IndexedDB with object stores for caching
   */
  async initDB(): Promise<void> {
    // Only initialize on client side
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store Profiles - indexed by subdomain, ID, and username
        if (!db.objectStoreNames.contains('store_profiles')) {
          const profileStore = db.createObjectStore('store_profiles', { keyPath: 'key' });
          profileStore.createIndex('storeId', 'storeData.id', { unique: false });
          profileStore.createIndex('subdomain', 'storeData.subdomain', { unique: false });
          profileStore.createIndex('username', 'storeData.storeUsername', { unique: false });
          profileStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Store Products (paginated) - indexed by storeId and page
        if (!db.objectStoreNames.contains('store_products')) {
          const productsStore = db.createObjectStore('store_products', { keyPath: 'key' });
          productsStore.createIndex('storeId', 'storeId', { unique: false });
          productsStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Store Categories - indexed by storeId
        if (!db.objectStoreNames.contains('store_categories')) {
          const categoriesStore = db.createObjectStore('store_categories', { keyPath: 'key' });
          categoriesStore.createIndex('storeId', 'storeId', { unique: false });
          categoriesStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Store Reviews (paginated) - indexed by storeId and page
        if (!db.objectStoreNames.contains('store_reviews')) {
          const reviewsStore = db.createObjectStore('store_reviews', { keyPath: 'key' });
          reviewsStore.createIndex('storeId', 'storeId', { unique: false });
          reviewsStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }

        // Cache Metadata - track cache timestamps
        if (!db.objectStoreNames.contains('cache_metadata')) {
          const metadataStore = db.createObjectStore('cache_metadata', { keyPath: 'key' });
          metadataStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * Ensure DB is initialized
   */
  private async ensureDB(): Promise<IDBDatabase> {
    if (typeof window === 'undefined') {
      throw new Error('IndexedDB is not available on server side');
    }

    if (!this.db) {
      await this.initDB();
    }
    return this.db!;
  }

  // ==================== STORE PROFILE METHODS ====================

  /**
   * Save store profile to cache
   */
  async saveStoreProfile(storeData: StoreProfileData): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['store_profiles', 'cache_metadata'], 'readwrite');

    const now = Date.now();
    const expiresAt = now + CACHE_TTL.STORE_PROFILE;

    // Create cache entries for all possible lookup keys
    const keys = [
      CACHE_KEYS.storeProfile(storeData.id),
      storeData.subdomain ? CACHE_KEYS.storeProfile(storeData.subdomain) : null,
      CACHE_KEYS.storeProfile(storeData.storeUsername)
    ].filter(Boolean) as string[];

    const cachedProfile: Omit<CachedStoreProfile, 'key'> = {
      storeData,
      cachedAt: now,
      expiresAt
    };

    // Save profile with multiple keys for different lookup methods
    const profileStore = transaction.objectStore('store_profiles');
    const metadataStore = transaction.objectStore('cache_metadata');

    for (const key of keys) {
      await this.promisifyRequest(profileStore.put({ key, ...cachedProfile }));

      // Save metadata
      const metadata: CacheMetadata = {
        key,
        timestamp: now,
        ttl: CACHE_TTL.STORE_PROFILE,
        expiresAt
      };
      await this.promisifyRequest(metadataStore.put(metadata));
    }

    console.log(`✅ Cached store profile for: ${storeData.storeName} (${keys.length} keys)`);
  }

  /**
   * Get cached store profile by identifier (subdomain, ID, or username)
   */
  async getStoreProfile(identifier: string): Promise<CacheValidationResult<StoreProfileData>> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['store_profiles'], 'readonly');
      const store = transaction.objectStore('store_profiles');

      const key = CACHE_KEYS.storeProfile(identifier);
      const cached = await this.promisifyRequest<CachedStoreProfile & { key: string }>(store.get(key));

      if (!cached) {
        return { valid: false, data: null, reason: 'not_found' };
      }

      // Check if cache is still valid
      const now = Date.now();
      if (now > cached.expiresAt) {
        console.log(`⏰ Cache expired for store: ${identifier}`);
        return { valid: false, data: cached.storeData, reason: 'expired' };
      }

      console.log(`✅ Using cached store profile: ${cached.storeData.storeName}`);
      return { valid: true, data: cached.storeData };
    } catch (error) {
      console.error('Error getting cached store profile:', error);
      return { valid: false, data: null, reason: 'corrupted' };
    }
  }

  // ==================== STORE PRODUCTS METHODS ====================

  /**
   * Save store products to cache (paginated)
   */
  async saveStoreProducts(
    storeId: string,
    page: number,
    products: MiniProduct[],
    totalPages: number,
    totalProducts: number,
    hasNextPage: boolean
  ): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['store_products', 'cache_metadata'], 'readwrite');

    const now = Date.now();
    const expiresAt = now + CACHE_TTL.PRODUCTS;
    const key = CACHE_KEYS.storeProducts(storeId, page);

    const cachedProducts: CachedStoreProducts & { key: string } = {
      key,
      storeId,
      page,
      products,
      totalPages,
      totalProducts,
      hasNextPage,
      cachedAt: now,
      expiresAt
    };

    const productsStore = transaction.objectStore('store_products');
    const metadataStore = transaction.objectStore('cache_metadata');

    await this.promisifyRequest(productsStore.put(cachedProducts));

    // Save metadata
    const metadata: CacheMetadata = {
      key,
      timestamp: now,
      ttl: CACHE_TTL.PRODUCTS,
      expiresAt
    };
    await this.promisifyRequest(metadataStore.put(metadata));

    console.log(`✅ Cached ${products.length} products for store ${storeId}, page ${page}`);
  }

  /**
   * Get cached store products
   */
  async getStoreProducts(
    storeId: string,
    page: number
  ): Promise<CacheValidationResult<CachedStoreProducts>> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['store_products'], 'readonly');
      const store = transaction.objectStore('store_products');

      const key = CACHE_KEYS.storeProducts(storeId, page);
      const cached = await this.promisifyRequest<CachedStoreProducts & { key: string }>(store.get(key));

      if (!cached) {
        return { valid: false, data: null, reason: 'not_found' };
      }

      // Check if cache is still valid
      const now = Date.now();
      if (now > cached.expiresAt) {
        console.log(`⏰ Cache expired for store products: ${storeId}, page ${page}`);
        return { valid: false, data: cached, reason: 'expired' };
      }

      console.log(`✅ Using cached products for store ${storeId}, page ${page}`);
      return { valid: true, data: cached };
    } catch (error) {
      console.error('Error getting cached store products:', error);
      return { valid: false, data: null, reason: 'corrupted' };
    }
  }

  // ==================== STORE CATEGORIES METHODS ====================

  /**
   * Save store categories to cache
   */
  async saveStoreCategories(
    storeId: string,
    categories: StoreCategoryResponse[],
    totalItems: number
  ): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['store_categories', 'cache_metadata'], 'readwrite');

    const now = Date.now();
    const expiresAt = now + CACHE_TTL.CATEGORIES;
    const key = CACHE_KEYS.storeCategories(storeId);

    const cachedCategories: CachedStoreCategories & { key: string } = {
      key,
      storeId,
      categories,
      totalItems,
      cachedAt: now,
      expiresAt
    };

    const categoriesStore = transaction.objectStore('store_categories');
    const metadataStore = transaction.objectStore('cache_metadata');

    await this.promisifyRequest(categoriesStore.put(cachedCategories));

    // Save metadata
    const metadata: CacheMetadata = {
      key,
      timestamp: now,
      ttl: CACHE_TTL.CATEGORIES,
      expiresAt
    };
    await this.promisifyRequest(metadataStore.put(metadata));

    console.log(`✅ Cached ${categories.length} categories for store ${storeId}`);
  }

  /**
   * Get cached store categories
   */
  async getStoreCategories(
    storeId: string
  ): Promise<CacheValidationResult<CachedStoreCategories>> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['store_categories'], 'readonly');
      const store = transaction.objectStore('store_categories');

      const key = CACHE_KEYS.storeCategories(storeId);
      const cached = await this.promisifyRequest<CachedStoreCategories & { key: string }>(store.get(key));

      if (!cached) {
        return { valid: false, data: null, reason: 'not_found' };
      }

      // Check if cache is still valid
      const now = Date.now();
      if (now > cached.expiresAt) {
        console.log(`⏰ Cache expired for store categories: ${storeId}`);
        return { valid: false, data: cached, reason: 'expired' };
      }

      console.log(`✅ Using cached categories for store ${storeId}`);
      return { valid: true, data: cached };
    } catch (error) {
      console.error('Error getting cached store categories:', error);
      return { valid: false, data: null, reason: 'corrupted' };
    }
  }

  // ==================== STORE REVIEWS METHODS ====================

  /**
   * Save store reviews to cache (paginated)
   */
  async saveStoreReviews(
    storeId: string,
    page: number,
    reviews: StoreReview[],
    stats: ReviewStats,
    totalPages: number,
    totalReviews: number,
    hasNextPage: boolean
  ): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['store_reviews', 'cache_metadata'], 'readwrite');

    const now = Date.now();
    const expiresAt = now + CACHE_TTL.REVIEWS;
    const key = CACHE_KEYS.storeReviews(storeId, page);

    const cachedReviews: CachedStoreReviews & { key: string } = {
      key,
      storeId,
      page,
      reviews,
      stats,
      totalPages,
      totalReviews,
      hasNextPage,
      cachedAt: now,
      expiresAt
    };

    const reviewsStore = transaction.objectStore('store_reviews');
    const metadataStore = transaction.objectStore('cache_metadata');

    await this.promisifyRequest(reviewsStore.put(cachedReviews));

    // Save metadata
    const metadata: CacheMetadata = {
      key,
      timestamp: now,
      ttl: CACHE_TTL.REVIEWS,
      expiresAt
    };
    await this.promisifyRequest(metadataStore.put(metadata));

    console.log(`✅ Cached ${reviews.length} reviews for store ${storeId}, page ${page}`);
  }

  /**
   * Get cached store reviews
   */
  async getStoreReviews(
    storeId: string,
    page: number
  ): Promise<CacheValidationResult<CachedStoreReviews>> {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction(['store_reviews'], 'readonly');
      const store = transaction.objectStore('store_reviews');

      const key = CACHE_KEYS.storeReviews(storeId, page);
      const cached = await this.promisifyRequest<CachedStoreReviews & { key: string }>(store.get(key));

      if (!cached) {
        return { valid: false, data: null, reason: 'not_found' };
      }

      // Check if cache is still valid
      const now = Date.now();
      if (now > cached.expiresAt) {
        console.log(`⏰ Cache expired for store reviews: ${storeId}, page ${page}`);
        return { valid: false, data: cached, reason: 'expired' };
      }

      console.log(`✅ Using cached reviews for store ${storeId}, page ${page}`);
      return { valid: true, data: cached };
    } catch (error) {
      console.error('Error getting cached store reviews:', error);
      return { valid: false, data: null, reason: 'corrupted' };
    }
  }

  // ==================== CACHE MANAGEMENT METHODS ====================

  /**
   * Invalidate all cache for a specific store
   */
  async invalidateStoreCache(storeId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ['store_profiles', 'store_products', 'store_categories', 'store_reviews', 'cache_metadata'],
      'readwrite'
    );

    // Clear store profile
    const profileStore = transaction.objectStore('store_profiles');
    const profileIndex = profileStore.index('storeId');
    const profileKeys = await this.promisifyRequest(profileIndex.getAllKeys(storeId));
    for (const key of profileKeys) {
      await this.promisifyRequest(profileStore.delete(key));
    }

    // Clear products
    const productsStore = transaction.objectStore('store_products');
    const productsIndex = productsStore.index('storeId');
    const productKeys = await this.promisifyRequest(productsIndex.getAllKeys(storeId));
    for (const key of productKeys) {
      await this.promisifyRequest(productsStore.delete(key));
    }

    // Clear categories
    const categoriesStore = transaction.objectStore('store_categories');
    const categoriesIndex = categoriesStore.index('storeId');
    const categoryKeys = await this.promisifyRequest(categoriesIndex.getAllKeys(storeId));
    for (const key of categoryKeys) {
      await this.promisifyRequest(categoriesStore.delete(key));
    }

    // Clear reviews
    const reviewsStore = transaction.objectStore('store_reviews');
    const reviewsIndex = reviewsStore.index('storeId');
    const reviewKeys = await this.promisifyRequest(reviewsIndex.getAllKeys(storeId));
    for (const key of reviewKeys) {
      await this.promisifyRequest(reviewsStore.delete(key));
    }

    console.log(`🗑️ Invalidated all cache for store ${storeId}`);
  }

  /**
   * Clear all expired cache entries
   */
  async clearExpiredCache(): Promise<void> {
    const db = await this.ensureDB();
    const now = Date.now();

    const stores = ['store_profiles', 'store_products', 'store_categories', 'store_reviews'];

    for (const storeName of stores) {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const index = store.index('expiresAt');

      // Get all entries that have expired
      const range = IDBKeyRange.upperBound(now);
      const cursor = index.openCursor(range);

      await new Promise<void>((resolve, reject) => {
        cursor.onsuccess = async (event) => {
          const c = (event.target as IDBRequest).result;
          if (c) {
            await this.promisifyRequest(store.delete(c.primaryKey));
            c.continue();
          } else {
            resolve();
          }
        };
        cursor.onerror = () => reject(cursor.error);
      });
    }

    console.log('🧹 Cleared all expired cache entries');
  }

  /**
   * Clear all store cache (full reset)
   */
  async clearAllCache(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ['store_profiles', 'store_products', 'store_categories', 'store_reviews', 'cache_metadata'],
      'readwrite'
    );

    await Promise.all([
      this.promisifyRequest(transaction.objectStore('store_profiles').clear()),
      this.promisifyRequest(transaction.objectStore('store_products').clear()),
      this.promisifyRequest(transaction.objectStore('store_categories').clear()),
      this.promisifyRequest(transaction.objectStore('store_reviews').clear()),
      this.promisifyRequest(transaction.objectStore('cache_metadata').clear())
    ]);

    console.log('🗑️ Cleared all store cache');
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    profiles: number;
    products: number;
    categories: number;
    reviews: number;
    metadata: number;
  }> {
    const db = await this.ensureDB();
    const transaction = db.transaction(
      ['store_profiles', 'store_products', 'store_categories', 'store_reviews', 'cache_metadata'],
      'readonly'
    );

    const [profiles, products, categories, reviews, metadata] = await Promise.all([
      this.promisifyRequest(transaction.objectStore('store_profiles').count()),
      this.promisifyRequest(transaction.objectStore('store_products').count()),
      this.promisifyRequest(transaction.objectStore('store_categories').count()),
      this.promisifyRequest(transaction.objectStore('store_reviews').count()),
      this.promisifyRequest(transaction.objectStore('cache_metadata').count())
    ]);

    return { profiles, products, categories, reviews, metadata };
  }

  // ==================== HELPER METHODS ====================

  /**
   * Helper to promisify IndexedDB requests
   */
  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const storeStorage = new StoreStorageService();

// Initialize on import (only on client side)
if (typeof window !== 'undefined') {
  storeStorage.initDB().catch(console.error);

  // Clear expired cache on initialization
  storeStorage.clearExpiredCache().catch(console.error);

  // Periodically clear expired cache (every 30 minutes)
  setInterval(() => {
    storeStorage.clearExpiredCache().catch(console.error);
  }, 30 * 60 * 1000);
}
