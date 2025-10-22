'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { ProductsGridSkeleton, LoadingSpinner } from '@/components/ui/skeletons';
import { apiClient } from '@/lib/api/client';
import type { StoreProductsResponse, MiniProduct } from '@/lib/types';

interface CategoryProductsPageProps {
  storeId: string;
  categoryId: string;
  categoryName: string;
  storeName: string;
  initialProducts?: StoreProductsResponse['data'];
  error?: string | null;
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
      className="group bg-white rounded-md sm:rounded-lg lg:rounded-xl border-0 sm:border sm:border-[#E0E0E0] hover:shadow-2xl lg:hover:scale-[1.03] transition-all duration-300 cursor-pointer overflow-hidden active:scale-95 touch-manipulation"
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
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount Badge - Compact on mobile */}
        {discountPercentage >= 5 && (
          <div className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-[#F44336] text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded sm:rounded-md shadow-md z-10">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Product Info - Compact but readable */}
      <div className="p-2 sm:p-4 lg:p-5">
        {/* Product Name - Compact on mobile */}
        <h3 className="font-semibold text-[#212121] line-clamp-2 text-xs sm:text-base mb-1.5 sm:mb-3 leading-snug group-hover:text-[#00838F] transition-colors min-h-[2rem] sm:min-h-[3rem]">
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

export default function CategoryProductsPage({
  storeId,
  categoryId,
  categoryName,
  storeName,
  initialProducts,
  error: initialError,
}: CategoryProductsPageProps) {
  const router = useRouter();
  const [products, setProducts] = useState<MiniProduct[]>(initialProducts?.products || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialProducts?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialProducts?.totalPages || 1);
  const [totalProducts, setTotalProducts] = useState(initialProducts?.totalProducts || 0);
  const [hasNextPage, setHasNextPage] = useState(initialProducts?.hasNextPage || false);
  const [error, setError] = useState<string | null>(initialError || null);

  const handleProductClick = (product: MiniProduct) => {
    router.push(`/product/${product.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const loadMoreProducts = async () => {
    if (!hasNextPage || loading) return;

    setLoading(true);
    try {
      const response = await apiClient.getCategoryProducts(
        storeId,
        categoryId,
        currentPage + 1,
        20
      );

      if (response.success && response.data) {
        setProducts(prev => [...prev, ...response.data!.products]);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setHasNextPage(response.data.hasNextPage);
      }
    } catch (err) {
      console.error('Failed to load more products:', err);
      setError('Failed to load more products');
    } finally {
      setLoading(false);
    }
  };

  // Load initial data if not provided
  useEffect(() => {
    if (!initialProducts && !error) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await apiClient.getCategoryProducts(storeId, categoryId, 1, 20);
          if (response.success && response.data) {
            setProducts(response.data.products);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalProducts(response.data.totalProducts);
            setHasNextPage(response.data.hasNextPage);
          }
        } catch (err) {
          console.error('Failed to load products:', err);
          setError('Failed to load products');
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [storeId, categoryId, initialProducts, error]);

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-[#F44336]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-[#F44336]" />
          </div>
          <h2 className="text-2xl font-bold text-[#212121] mb-2">Oops! Something went wrong</h2>
          <p className="text-[#757575] mb-6">{error}</p>
          <Button
            onClick={handleBack}
            className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-full px-6"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-[#E0E0E0] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-[#E0F7FA] flex items-center justify-center hover:bg-[#B2EBF2] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#00838F]" />
            </button>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#212121] truncate">
                {categoryName}
              </h1>
              {storeName && (
                <p className="text-sm text-[#757575]">
                  from {storeName}
                </p>
              )}
            </div>

            {/* Product Count */}
            {totalProducts > 0 && (
              <div className="flex-shrink-0 px-4 py-2 bg-[#00BCD4]/10 rounded-full">
                <span className="text-sm font-semibold text-[#00838F]">
                  {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content - Maximized product visibility */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-4 sm:py-8">
        {products.length > 0 ? (
          <>
            {/* Products Grid - Edge-to-edge on mobile for larger products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {/* Load More Button - Enhanced loading state */}
            {hasNextPage && (
              <div className="flex justify-center mt-8 sm:mt-10">
                <Button
                  onClick={loadMoreProducts}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-full px-10 h-12 font-semibold text-base min-w-[200px] active:scale-95 touch-manipulation"
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
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No Products Yet</h3>
            <p className="text-[#757575] text-center max-w-md mb-6">
              The "{categoryName}" category doesn't have any products yet. Check back later for exciting new additions!
            </p>
            <Button
              onClick={handleBack}
              variant="outline"
              className="border-[#00BCD4] text-[#00838F] hover:bg-[#E0F7FA] rounded-full px-6"
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
