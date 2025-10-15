import { API_CONFIG } from '../constants';
import type {
  StoreProfileResponse,
  StoreProductsResponse,
  StoreCategoriesResponse,
  PaginatedStoreReviewsResponse,
  ApiError,
  StoreSortOption,
  ImageVariant,
} from '../types';

// Base API Client
class ApiClient {
  private baseUrl = API_CONFIG.baseUrl;

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle API error responses
      if ('success' in data && !data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Store Profile Methods
  async getStoreProfile(storeId: string, authToken?: string): Promise<StoreProfileResponse> {
    const headers: HeadersInit = {};
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return this.request<StoreProfileResponse>(
      API_CONFIG.endpoints.storeProfile(storeId),
      { headers }
    );
  }

  // Store Products Methods
  async getStoreProducts(
    storeId: string,
    page: number = 1,
    limit: number = 20,
    sortBy: StoreSortOption = 'RECENT'
  ): Promise<StoreProductsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    });

    return this.request<StoreProductsResponse>(
      `${API_CONFIG.endpoints.storeProducts(storeId)}?${params}`
    );
  }

  // Store Categories Methods
  async getStoreCategories(
    storeId: string,
    page: number = 1,
    pageSize: number = 12
  ): Promise<StoreCategoriesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    return this.request<StoreCategoriesResponse>(
      `${API_CONFIG.endpoints.storeCategories(storeId)}?${params}`
    );
  }

  async getCategoryProducts(
    storeId: string,
    categoryId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const endpoint = `${API_CONFIG.endpoints.storeCategories(storeId)}/${categoryId}/products?${params}`;
    const fullUrl = `${this.baseUrl}${endpoint}`;
    console.log('🌐 Calling API:', fullUrl);

    const response = await this.request<any>(endpoint);

    console.log('🔍 API Response for category products:', JSON.stringify(response, null, 2));

    // The API returns { success, message, data: { category, products: { items, currentPage, limit, totalItems, totalPages, hasNext, hasPrevPage } } }
    // Transform to match StoreProductsResponse format
    if (response.success && response.data && response.data.products) {
      const productsData = response.data.products;
      const transformedData = {
        success: true,
        data: {
          products: productsData.items || [],
          currentPage: productsData.currentPage || page,
          totalPages: productsData.totalPages || 1,
          totalProducts: productsData.totalItems || 0,
          hasNextPage: productsData.hasNext || false,
          hasPreviousPage: productsData.hasPrevPage || false,
        }
      };
      console.log('✅ Transformed data:', JSON.stringify(transformedData, null, 2));
      return transformedData;
    }

    console.log('❌ Response not successful or no data');
    return response;
  }

  // Store Reviews Methods
  async getStoreReviews(
    storeId: string,
    page: number = 1,
    limit: number = 10,
    rating?: number,
    verifiedOnly: boolean = false,
    sortBy: string = 'RECENT'
  ): Promise<PaginatedStoreReviewsResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      verifiedOnly: verifiedOnly.toString(),
      sortBy,
    });

    if (rating) {
      params.append('rating', rating.toString());
    }

    return this.request<PaginatedStoreReviewsResponse>(
      `${API_CONFIG.endpoints.storeReviews(storeId)}?${params}`
    );
  }

  // Follow/Unfollow Methods (require authentication)
  async followStore(storeId: string, authToken: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      API_CONFIG.endpoints.followStore(storeId),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }

  async unfollowStore(storeId: string, authToken: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(
      API_CONFIG.endpoints.followStore(storeId),
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }

  // Image URL Generation Methods
  getImageUrl(imageId: string, variant: ImageVariant = 'preview'): string {
    if (!imageId) return '/placeholder-image.png';
    
    const endpoint = API_CONFIG.endpoints.images[variant];
    return `${this.baseUrl}${endpoint(imageId)}`;
  }

  // Generate optimized image URLs with multiple variants for responsive loading
  getImageUrls(imageId: string) {
    if (!imageId) {
      return {
        preview: '/placeholder-image.png',
        detail: '/placeholder-image.png',
        fullscreen: '/placeholder-image.png',
        banner: '/placeholder-image.png',
        original: '/placeholder-image.png',
      };
    }

    return {
      preview: this.getImageUrl(imageId, 'preview'),
      detail: this.getImageUrl(imageId, 'detail'),
      fullscreen: this.getImageUrl(imageId, 'fullscreen'),
      banner: this.getImageUrl(imageId, 'banner'),
      original: this.getImageUrl(imageId, 'original'),
    };
  }

  // Flexible image URL with custom parameters
  getFlexibleImageUrl(
    imageId: string,
    width?: number,
    height?: number,
    quality?: number,
    format: 'webp' | 'jpg' | 'png' = 'webp'
  ): string {
    if (!imageId) return '/placeholder-image.png';
    
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (height) params.append('height', height.toString());
    if (quality) params.append('quality', quality.toString());
    params.append('format', format);

    return `${this.baseUrl}/image/${imageId}?${params}`;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Type guard for API errors
export const isApiError = (response: unknown): response is ApiError => {
  return (
    response !== null &&
    typeof response === 'object' &&
    'success' in response &&
    !(response as { success: boolean }).success
  );
};

// Utility function for generating responsive image srcSet
export const generateImageSrcSet = (imageId: string): string => {
  if (!imageId) return '';
  
  return [
    `${apiClient.getFlexibleImageUrl(imageId, 400, 400, 75)} 400w`,
    `${apiClient.getFlexibleImageUrl(imageId, 600, 600, 80)} 600w`, 
    `${apiClient.getFlexibleImageUrl(imageId, 800, 800, 85)} 800w`,
    `${apiClient.getFlexibleImageUrl(imageId, 1200, 1200, 90)} 1200w`,
  ].join(', ');
};