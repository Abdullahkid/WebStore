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
      className="group bg-white rounded-xl border border-[#E0E0E0] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => onProductClick(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
        <OptimizedImage
          imageId={product.mainImageUrl}
          alt={product.name}
          variant="detail"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1440px) 25vw, 20vw"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
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
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#F44336] text-[#F44336]' : 'text-[#757575]'}`} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-md"
          >
            <Eye className="w-5 h-5 text-[#757575]" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-[#212121] line-clamp-2 text-base mb-2 leading-snug group-hover:text-[#00838F] transition-colors">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-xl font-bold text-[#00838F]">
            ₹{Math.round(product.sellingPrice).toLocaleString('en-IN')}
          </div>

          {product.mrp && product.mrp > product.sellingPrice && (
            <div className="text-sm text-[#9E9E9E] line-through">
              ₹{Math.round(product.mrp).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Rating */}
        {product.averageRating && product.averageRating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
            <span className="text-sm font-medium text-[#212121]">
              {product.averageRating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product);
          }}
          className="w-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-lg h-9 text-sm font-medium"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
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
    <div className="bg-white">
      {/* Filter Bar */}
      <div className="border-b border-[#E0E0E0] px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#212121]">Products</h2>
            <p className="text-sm text-[#757575] mt-1">
              {products.length} items available
            </p>
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-[#E0E0E0] text-[#757575] hover:border-[#00BCD4] hover:text-[#00838F] rounded-lg px-4 h-10"
              >
                <span className="text-sm mr-2">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg border-[#E0E0E0]">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value as StoreSortOption)}
                  className={`rounded-md text-sm py-2.5 px-3 m-1 cursor-pointer ${
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

      {/* Products Grid - Blueprint Responsive Breakpoints */}
      <div className="px-6 py-8">
        {products.length > 0 ? (
          <>
            {/* Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop), 4 cols (large) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-full px-8 h-12 font-medium text-base"
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
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-[#E0E0E0] to-[#F5F5F5] animate-pulse" />
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
