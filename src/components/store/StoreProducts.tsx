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
import { ProductsGridSkeleton, LoadingSpinner } from '@/components/ui/skeletons';
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
      className="group bg-white rounded-md sm:rounded-lg lg:rounded-xl border-0 sm:border sm:border-[#E0E0E0] hover:shadow-2xl lg:hover:scale-[1.03] transition-all duration-300 cursor-pointer overflow-hidden hover-lift-desktop active:scale-95 touch-manipulation"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onProductClick(product);
        }
      }}
      aria-label={`View ${product.name}`}
    >
      {/* Product Image - Square Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
        <OptimizedImage
          imageId={product.mainImageUrl}
          alt={product.name}
          variant="detail"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 20vw"
        />

        {/* Discount Badge - Compact on mobile */}
        {discountPercentage >= 5 && (
          <div className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-[#F44336] text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded sm:rounded-md shadow-md z-10">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Touch-friendly overlay for mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 lg:hidden" />
      </div>

      {/* Product Info - Compact but readable */}
      <div className="p-2 sm:p-4 lg:p-5">
        {/* Product Name - Compact on mobile */}
        <h3 className="font-medium text-[#212121] line-clamp-2 text-xs sm:text-base mb-1.5 sm:mb-3 leading-snug group-hover:text-[#00838F] transition-colors min-h-[2rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        {/* Price Section - Prominent pricing */}
        <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
          <div className="text-base sm:text-xl font-bold text-[#00838F]">
            ₹{Math.round(product.sellingPrice).toLocaleString('en-IN')}
          </div>

          {product.mrp && product.mrp > product.sellingPrice && (
            <div className="text-[10px] sm:text-sm text-[#9E9E9E] line-through">
              ₹{Math.round(product.mrp).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Rating - Compact */}
        {(product.averageRating ?? 0) > 0 && (
          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 w-fit">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-[#FFC107] text-[#FFC107]" />
            <span className="text-[10px] sm:text-sm font-semibold text-[#212121]">
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
    // Try loading from cache first (only for RECENT sort)
    if (sort === 'RECENT' && !append) {
      // For initial load (page 1), try to load ALL cached pages for infinite scroll restoration
      if (page === 1) {
        const allCachedProducts: MiniProduct[] = [];
        let lastValidPage = 0;

        // Try to load up to 5 pages from cache (most users don't scroll beyond this)
        for (let p = 1; p <= 5; p++) {
          const cached = await storeStorage.getStoreProducts(storeId, p);
          if (cached.valid && cached.data) {
            allCachedProducts.push(...cached.data.products);
            lastValidPage = p;

            // Update state with cached metadata from last page
            if (p === 1) {
              setTotalPages(cached.data.totalPages);
            }
          } else {
            break; // Stop at first cache miss
          }
        }

        // If we have cached products, show them immediately
        if (allCachedProducts.length > 0) {
          console.log(`✅ Restored ${allCachedProducts.length} cached products (${lastValidPage} pages)`);
          setProducts(allCachedProducts);
          setCurrentPage(lastValidPage);
          setHasNextPage(lastValidPage < totalPages);
          // Don't set loading to false yet - fetch fresh data in background
        }
      } else {
        // For "Load More" (page > 1), check if this specific page is cached
        const cached = await storeStorage.getStoreProducts(storeId, page);
        if (cached.valid && cached.data) {
          const cachedData = cached.data; // TypeScript type narrowing
          console.log(`✅ Using cached products page ${page}`);
          setProducts(prev => [...prev, ...cachedData.products]);
          setCurrentPage(cachedData.page);
          setHasNextPage(cachedData.hasNextPage);
          // Still fetch fresh in background
        }
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

        // Cache EVERY page for infinite scroll restoration (only for RECENT sort)
        if (sort === 'RECENT') {
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

      {/* Compact Sort Bar - Mobile Only - Pulled closer to tabs */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E0E0E0] px-2 py-2 flex items-center justify-between -mt-5">
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

      {/* Products Grid - Maximized product visibility */}
      <div className="px-0 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-8">
        {products.length > 0 ? (
          <>
            {/* Responsive Grid: Mobile 2 cols (edge-to-edge) → Tablet 2 cols → Desktop 3 cols → XL 4 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
              ))}
            </div>

            {/* Load More Button - Enhanced with better loading state */}
            {hasNextPage && (
              <div className="flex justify-center mt-10 lg:mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-full px-10 lg:px-12 h-12 lg:h-14 font-semibold text-base lg:text-lg hover-lift-desktop min-w-[200px] relative"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    'Load More Products'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          // Loading Skeleton - Using dedicated component
          <ProductsGridSkeleton count={12} />
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
