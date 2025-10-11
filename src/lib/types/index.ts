// Product Category Enum (matching your app's 5 categories)
export enum ProductCategory {
  FASHION = "FASHION",
  FOOTWEAR = "FOOTWEAR",
  ELECTRONICS = "ELECTRONICS", 
  COSMETICS = "COSMETICS",
  ACCESSORIES = "ACCESSORIES",
}

// ImageGroup System Types
export enum ImageGroupType {
  COLOR_BASED = "COLOR_BASED",
  PRODUCT_WIDE = "PRODUCT_WIDE",
  INDIVIDUAL = "INDIVIDUAL"
}

export interface ImageGroup {
  id: string;
  name: string;
  images: string[];
  groupType: ImageGroupType;
  createdAt: number;
  updatedAt: number;
}

// Product Data Types with ImageGroup Support
export interface ProductPageDetailsDto {
  id: string;
  title: string;
  brandName?: string;
  description: string;
  keyFeatures: string[];
  // Legacy image fields (deprecated but maintained for backward compatibility)
  defaultImages: string[];
  images: string[];
  // New ImageGroup system
  imageGroups: ImageGroup[];
  mrp?: number;
  sellingPrice: number;
  variants: ProductVariantPageDto[];
  variantAttributes: Record<string, string[]>;
  hasVariants: boolean;
  totalInventory: number;
  isAvailable: boolean;
  customAttributes: Record<string, string>;
  isReturnable: boolean;
  isCodAllowed: boolean;
  estimatedDeliveryDays?: { minDays: number; maxDays: number };
  shippingCost?: { local: number; national: number };
  averageRating: number;
  totalReviews: number;
  storeInfo: StoreProfileMiniDto;
  discountPercentage: number;
  formattedPrice: string;
  formattedMrp?: string;
}

export interface ProductVariantPageDto {
  variantId: string;
  attributes: Record<string, string>;
  // Legacy image fields (deprecated but maintained for backward compatibility)
  images: string[];
  useProductImages: boolean;
  // New ImageGroup system
  imageGroupId?: string;
  mrp?: number;
  sellingPrice: number;
  inventory: number;
  sku?: string;
  status: string;
}

export interface StoreProfileMiniDto {
  businessId: string;
  storeName: string;
  storeUsername: string;
  storeType: string;
  storeLogo?: string;
  storeCategory: string;
  storeRating: number;
  productsCount: number;
  followersCount: number;
  formattedRating: string;
}

// Social Media Links
export interface SocialMediaLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
  youtube?: string;
}

// Store Profile Data
export interface StoreProfileData {
  id: string;
  storeName: string;
  storeUsername: string;
  storeLogo: string | null;
  storeCategory: ProductCategory;
  storeDescription: string;
  storeRating: number;
  productsCount: number;
  followersCount: number;
  location?: string;
  socialLinks?: SocialMediaLinks;
  websiteUrl?: string;
  mapLink?: string;
  phoneNumber: string;
  email?: string;
  isFollowing: boolean;
  createdAt: number;
}

// API Response for Store Profile
export interface StoreProfileResponse {
  success: boolean;
  message?: string;
  storeProfile?: StoreProfileData;
}

// Mini Product (for listings)
export interface MiniProduct {
  id: string;
  businessId: string;
  name: string;
  mainImageUrl: string;
  sellingPrice: number;
  mrp?: number;
  averageRating?: number;
  mainCategory: string;
}

// Store Products Response
export interface StoreProductsResponse {
  success: boolean;
  message?: string;
  data?: {
    products: MiniProduct[];
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Store Category Response
export interface StoreCategoryResponse {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
}

export interface StoreCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    items: StoreCategoryResponse[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNext: boolean;
    hasPrevPage: boolean;
  };
}

// Store Review Data
export interface StoreResponse {
  response: string;
  responderName: string;
  respondedAt: number;
}

export interface StoreReview {
  id: string;
  storeId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  comment: string;
  reviewTitle?: string;
  isVerifiedPurchase: boolean;
  orderId?: string;
  images: string[];
  helpfulCount: number;
  isMarkedHelpfulByCurrentUser: boolean;
  storeResponse?: StoreResponse;
  createdAt: number;
  updatedAt: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface PaginatedStoreReviewsResponse {
  reviews: StoreReview[];
  stats: ReviewStats;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  totalReviews: number;
}

// Store Metrics
export interface StoreMetricsData {
  productsCount: number;
  followersCount: number;
  averageRating: number;
  totalReviews: number;
  joinedDate: number;
  lastProductUpload?: number;
}

// API Error Response
export interface ApiError {
  success: false;
  message: string;
}

// Image Variants
export type ImageVariant = 'preview' | 'detail' | 'fullscreen' | 'banner' | 'original';

// Sort Options Type
export type StoreSortOption = 'RECENT' | 'PRICE_LOW_TO_HIGH' | 'PRICE_HIGH_TO_LOW' | 'RATING' | 'POPULAR';

// Store Tab Type  
export type StoreTab = 'products' | 'categories' | 'reviews' | 'about';

// Follow Action State
export interface FollowActionState {
  isLoading: boolean;
  error?: string;
}

// Page Props for Store Profile
export interface StorePageProps {
  params: {
    slug: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Address Data Model
export interface Address {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
}

// Indian States List
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
].sort() as const;