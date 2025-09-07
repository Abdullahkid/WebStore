'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Star, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { apiClient } from '@/lib/api/client';
import { SORT_OPTIONS } from '@/lib/constants';
import type { StoreProductsResponse, MiniProduct, StoreSortOption } from '@/lib/types';

interface StoreProductsProps {
  storeId: string;
  initialData?: StoreProductsResponse['data'];
}

interface ProductCardProps {
  product: MiniProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discountPercentage = product.mrp 
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <OptimizedImage
          imageId={product.mainImageUrl}
          alt={product.name}
          variant="detail"
          fill
          className="object-cover"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-medium text-[#212121] line-clamp-2 text-sm mb-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.averageRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5 bg-green-100 px-1.5 py-0.5 rounded text-xs">
              <Star className="w-3 h-3 fill-green-600 text-green-600" />
              <span className="text-green-800 font-medium">{product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-[#212121] font-bold">
            <IndianRupee className="w-4 h-4" />
            <span>{product.sellingPrice.toLocaleString('en-IN')}</span>
          </div>
          
          {product.mrp && product.mrp > product.sellingPrice && (
            <div className="flex items-center text-gray-500 text-sm line-through">
              <IndianRupee className="w-3 h-3" />
              <span>{product.mrp.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function StoreProducts({ storeId, initialData }: StoreProductsProps) {
  const [products, setProducts] = useState<MiniProduct[]>(initialData?.products || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [sortBy, setSortBy] = useState<StoreSortOption>('RECENT');
  const [hasNextPage, setHasNextPage] = useState(initialData?.hasNextPage || false);

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
      const response = await apiClient.getStoreProducts(storeId, page, 12, sort);
      
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
    <div className="space-y-4">
      {/* Header with Sort */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#212121]">
          Products ({products.length})
        </h2>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span className="text-sm">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value as StoreSortOption)}
                className={sortBy === option.value ? 'bg-[#009CB9]/10 text-[#009CB9]' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleLoadMore}
                disabled={loading}
                variant="outline"
                className="min-w-32"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      ) : loading ? (
        // Loading skeleton
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-500">This store hasn't added any products yet.</p>
        </div>
      )}
    </div>
  );
}