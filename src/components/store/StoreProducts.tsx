'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Star, IndianRupee, RefreshCw, Package, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OptimizedImage from '@/components/shared/OptimizedImage';
import ProductDetailModal from '@/components/product/ProductDetailModal';
import { apiClient } from '@/lib/api/client';
import { SORT_OPTIONS } from '@/lib/constants';
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
  const discountPercentage = product.mrp 
    ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100)
    : 0;

  return (
    <div 
      className="group bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#009CB9]/20 transition-all duration-300 cursor-pointer overflow-hidden transform hover:scale-105"
      onClick={() => onProductClick(product)}
    >
      {/* Product Image with Enhanced Design */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-50 to-gray-100">
        <OptimizedImage
          imageId={product.mainImageUrl}
          alt={product.name}
          variant="detail"
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Discount Badge - Enhanced */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}
        
        {/* Quick Action Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors">
            <span className="text-lg">👁️</span>
          </button>
        </div>
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Info - Enhanced */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 line-clamp-2 text-sm mb-2 leading-5 group-hover:text-[#009CB9] transition-colors">
          {product.name}
        </h3>
        
        {/* Price Section - Enhanced */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[#009CB9] font-black text-lg">
              <IndianRupee className="w-4 h-4" />
              <span>{Math.round(product.sellingPrice).toLocaleString('en-IN')}</span>
            </div>
            
            {product.mrp && product.mrp > product.sellingPrice && (
              <div className="flex items-center text-gray-400 text-xs line-through">
                <IndianRupee className="w-3 h-3" />
                <span>{Math.round(product.mrp).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
          
          {/* Rating */}
          {product.averageRating && product.averageRating > 0 && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white py-2 px-3 rounded-xl text-xs font-bold hover:shadow-lg transition-all transform hover:scale-105">
            View Details
          </button>
          <button className="bg-gray-100 text-gray-600 p-2 rounded-xl hover:bg-gray-200 transition-colors">
            ❤️
          </button>
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
  
  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState<MiniProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: MiniProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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
    <div className="bg-gradient-to-br from-white to-gray-50">
      {/* Enhanced Products Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Our Products</h2>
            <p className="text-gray-600">
              Discover {products.length} amazing products
            </p>
          </div>
          
          {/* Enhanced Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white border-2 border-gray-200 hover:border-[#009CB9] rounded-2xl px-4 py-2 h-auto shadow-sm"
              >
                <span className="text-sm text-gray-700 font-medium mr-2">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-0 bg-white">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value as StoreSortOption)}
                  className={`rounded-xl text-sm py-3 px-4 m-1 transition-all ${
                    sortBy === option.value 
                      ? 'bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Products Grid - Enhanced */}
      <div className="px-4 py-6">
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
              ))}
            </div>

            {/* Enhanced Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center pt-8">
                <Button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-2xl px-8 py-3 font-bold"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🛍️</span>
                      Load More Products
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          // Enhanced Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded-xl w-3/4 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded-xl w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Enhanced Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-[#009CB9]/10 to-[#16DAFF]/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-6xl">🛍️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600 text-center max-w-md">This store is setting up their catalog. Check back soon for amazing products!</p>
            <Button className="mt-6 bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white rounded-2xl px-6 py-3">
              Notify Me When Products Are Added
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}