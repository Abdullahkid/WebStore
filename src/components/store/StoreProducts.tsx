'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { apiClient } from '@/lib/api/client';
import { storeStorage } from '@/lib/storage/storeStorage';
import type { StoreProductsResponse, MiniProduct, StoreSortOption } from '@/lib/types';

interface StoreProductsProps {
  storeId: string;
  initialData?: StoreProductsResponse['data'];
}

interface ProductCardProps {
  product: MiniProduct;
  onProductClick: (product: MiniProduct) => void;
}

const ProductCard = ({ product, onProductClick }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountPercentage = product.mrp
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-lg lg:rounded-xl border-0 sm:border sm:border-[#E0E0E0] hover:shadow-2xl lg:hover:scale-[1.05] transition-all duration-300 cursor-pointer overflow-hidden hover-lift-desktop"
      onClick={() => onProductClick(product)}
    >
      {/* Product Image - Square Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
        <OptimizedImage
          imageId={product.mainImageUrl}
          alt={product.name}
          variant="detail"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 20vw"
        />

        {/* Discount Badge - Only show if discount is 5% or more */}
        {discountPercentage >= 5 && (
          <div className="absolute top-3 left-3 bg-[#F44336] text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Quick Actions - Show on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            // className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
          >
            {/* <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#F44336] text-[#F44336]' : 'text-[#757575]'}`} /> */}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            //className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
          >
            {/* <Eye className="w-5 h-5 text-[#757575]" /> */}
          </button>
        </div>
      </div>

      {/* Product Info - Responsive padding and text sizes */}
      <div className="p-2 sm:p-4">
        {/* Product Name */}
        <h3 className="font-medium text-[#212121] line-clamp-2 text-sm sm:text-base mb-1 sm:mb-2 leading-snug group-hover:text-[#00838F] transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
          <div className="text-base sm:text-xl font-bold text-[#00838F]">
            ₹{Math.round(product.sellingPrice).toLocaleString('en-IN')}
          </div>

          {product.mrp && product.mrp > product.sellingPrice && (
            <div className="text-xs sm:text-sm text-[#9E9E9E] line-through">
              ₹{Math.round(product.mrp).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Rating - Only show if rating exists and is greater than 0 */}
        {(product.averageRating ?? 0) > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#FFC107] text-[#FFC107]" />
            <span className="text-xs sm:text-sm font-medium text-[#212121]">
              {product.averageRating!.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function StoreProducts({ storeId, initialData }: StoreProductsProps) {
  const router = useRouter();
  const [products, setProducts] = useState<MiniProduct[]>(initialData?.products || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [sortBy, setSortBy] = useState<StoreSortOption>('RECENT');
  const [hasNextPage, setHasNextPage] = useState(initialData?.hasNextPage || false);

  const handleProductClick = (product: MiniProduct) => {
    router.push(`/product/${product.id}`);
  };

  const sortOptions = [
    { value: 'RECENT', label: 'Recently Added' },
    { value: 'PRICE_LOW_TO_HIGH', label: 'Price: Low to High' },
    { value: 'PRICE_HIGH_TO_LOW', label: 'Price: High to Low' },
    { value: 'RATING', label: 'Highest Rated' },
    { value: 'POPULAR', label: 'Most Popular' },
  ];

  const loadProducts = async (page: number = 1, sort: StoreSortOption = sortBy, append = false) => {
    // Try loading from cache first (only for page 1 and RECENT sort)
    if (page === 1 && sort === 'RECENT' && !append) {
      const cached = await storeStorage.getStoreProducts(storeId, page);
      if (cached.valid && cached.data) {
        console.log('✅ Using cached products');
        setProducts(cached.data.products);
        setCurrentPage(cached.data.page);
        setTotalPages(cached.data.totalPages);
        setHasNextPage(cached.data.hasNextPage);
        // Don't set loading to false yet - fetch fresh data in background
      }
    }

    setLoading(true);
    try {
      const response = await apiClient.getStoreProducts(storeId, page, 20, sort);

      if (response.success && response.data) {
        if (append) {
          setProducts(prev => [...prev, ...response.data!.products]);
        } else {
          setProducts(response.data.products);
        }
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);

        // Cache the products (only cache page 1 for now)
        if (page === 1) {
          await storeStorage.saveStoreProducts(
            storeId,
            page,
            response.data.products,
            response.data.totalPages,
            response.data.totalProducts,
            response.data.hasNextPage
          );
        }
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSort: StoreSortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
    loadProducts(1, newSort, false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadProducts(currentPage + 1, sortBy, true);
    }
  };

  // Load initial data if not provided
  useEffect(() => {
    if (!initialData) {
      loadProducts();
    }
  }, [storeId, initialData]);

  return (
    <div className="bg-white lg:rounded-2xl lg:shadow-lg lg:border lg:border-[#E0E0E0]">
      {/* Filter Bar - Desktop Only */}
      <div className="hidden lg:block border-b border-[#E0E0E0] px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#212121]">Products</h2>
            <p className="text-base text-[#757575] mt-1">
              {products.length} items available
            </p>
          </div>

          {/* Sort Dropdown - Desktop */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-[#E0E0E0] text-[#757575] hover:border-[#00BCD4] hover:text-[#00838F] rounded-lg px-6 h-12 text-base font-medium shadow-sm hover:shadow-md transition-all"
              >
                <span className="mr-2">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
                <ChevronDown className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-lg border-[#E0E0E0] shadow-xl">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value as StoreSortOption)}
                  className={`rounded-md text-base py-3 px-4 m-1 cursor-pointer transition-all ${
                    sortBy === option.value
                      ? 'bg-[#E0F7FA] text-[#00838F] font-semibold'
                      : 'text-[#212121] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Compact Sort Bar - Mobile Only */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E0E0E0] px-2 py-2 flex items-center justify-between">
        <span className="text-sm text-[#757575] font-medium">{products.length} products</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#E0E0E0] text-[#757575] hover:border-[#00BCD4] hover:text-[#00838F] rounded-md px-3 h-8 text-xs font-medium"
            >
              <span className="mr-1">Sort</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg border-[#E0E0E0] shadow-xl">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value as StoreSortOption)}
                className={`rounded-md text-sm py-2 px-3 m-1 cursor-pointer transition-all ${
                  sortBy === option.value
                    ? 'bg-[#E0F7FA] text-[#00838F] font-semibold'
                    : 'text-[#212121] hover:bg-[#F5F5F5]'
                }`}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Grid - Maximum Space on Mobile */}
      <div className="px-1 sm:px-2 lg:px-6 py-2 sm:py-4 lg:py-8">
        {products.length > 0 ? (
          <>
            {/* Responsive Grid: Mobile 2 cols → Tablet 2 cols → Desktop 3 cols → XL 4 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
              ))}
            </div>

            {/* Load More Button - Enhanced Desktop */}
            {hasNextPage && (
              <div className="flex justify-center mt-10 lg:mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-full px-10 lg:px-12 h-12 lg:h-14 font-semibold text-base lg:text-lg hover-lift-desktop"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          // Loading Skeleton - Optimized for all screens
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-[#E0E0E0] to-[#F5F5F5] animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#E0E0E0] rounded animate-pulse" />
                  <div className="h-3 bg-[#E0E0E0] rounded w-3/4 animate-pulse" />
                  <div className="h-6 bg-[#E0E0E0] rounded w-1/2 animate-pulse" />
                  <div className="h-9 bg-[#E0E0E0] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-[#E0F7FA] rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-16 h-16 text-[#00BCD4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No Products Available</h3>
            <p className="text-[#757575] text-center max-w-md mb-6">
              This store is setting up their catalog. Check back soon for amazing products!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
