'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { apiClient } from '@/lib/api/client';
import { storeStorage } from '@/lib/storage/storeStorage';
import type { StoreCategoriesResponse, StoreCategoryResponse } from '@/lib/types';

interface StoreCategoriesProps {
  storeId: string;
  initialData?: StoreCategoriesResponse['data'];
  storeName?: string;
}

interface CategoryCardProps {
  category: StoreCategoryResponse;
  onClick: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-xl border border-[#80DEEA] hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer p-6 text-center group"
    >
      {/* Category Icon/Image */}
      <div className="flex justify-center mb-4">
        {category.imageUrl ? (
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white">
            <OptimizedImage
              imageId={category.imageUrl}
              alt={category.name}
              variant="preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <Package className="w-8 h-8 text-[#00838F]" />
          </div>
        )}
      </div>

      {/* Category Name */}
      <h3 className="text-lg font-semibold text-[#00838F] mb-1 group-hover:text-[#00838F]">
        {category.name}
      </h3>

      {/* Product Count */}
      <p className="text-sm text-[#00838F]">
        ({category.productCount})
      </p>
    </div>
  );
};

export default function StoreCategories({ storeId, initialData, storeName }: StoreCategoriesProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = useState<StoreCategoryResponse[]>(initialData?.items || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [hasNext, setHasNext] = useState(initialData?.hasNext || false);

  const loadCategories = async (page: number = 1, append = false) => {
    // Try loading from cache first (only for first page, not appending)
    if (page === 1 && !append) {
      const cached = await storeStorage.getStoreCategories(storeId);
      if (cached.valid && cached.data) {
        console.log('✅ Using cached categories');
        setCategories(cached.data.categories);
        // Don't set loading to false yet - fetch fresh data in background
      }
    }

    setLoading(true);
    try {
      const response = await apiClient.getStoreCategories(storeId, page, 12);

      if (response.success && response.data) {
        if (append) {
          setCategories(prev => [...prev, ...response.data!.items]);
        } else {
          setCategories(response.data.items);
        }
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setHasNext(response.data.hasNext);

        // Cache the categories (only cache first load with all items)
        if (page === 1 && !append) {
          await storeStorage.saveStoreCategories(
            storeId,
            response.data.items,
            response.data.totalItems
          );
        }
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNext && !loading) {
      loadCategories(currentPage + 1, true);
    }
  };

  const handleCategoryClick = (category: StoreCategoryResponse) => {
    // Navigate to category products page
    const baseUrl = pathname || `/store/${storeId}`;
    const categoryUrl = `${baseUrl}/category/${category.id}?name=${encodeURIComponent(category.name)}&storeId=${storeId}${storeName ? `&store=${encodeURIComponent(storeName)}` : ''}`;
    router.push(categoryUrl);
  };

  // Load initial data if not provided
  useEffect(() => {
    if (!initialData) {
      loadCategories();
    }
  }, [storeId, initialData]);

  return (
    <div className="bg-white">
      {/* Categories Grid */}
      <div className="px-6 py-8">
        {categories.length > 0 ? (
          <>
            {/* Grid: 2 cols (mobile), 4 cols (desktop) - Blueprint spec */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasNext && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-full px-8 h-12 font-medium"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Load More Categories'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#E0F7FA] rounded-xl p-6 border border-[#80DEEA] overflow-hidden">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white/50 rounded-full animate-pulse" />
                </div>
                <div className="h-5 bg-white/50 rounded animate-pulse mb-2" />
                <div className="h-4 bg-white/50 rounded w-2/3 mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-[#E0F7FA] rounded-full flex items-center justify-center mb-6">
              <Package className="w-16 h-16 text-[#00BCD4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No Categories Yet</h3>
            <p className="text-[#757575] text-center max-w-md">
              This store hasn't organized products into categories yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
