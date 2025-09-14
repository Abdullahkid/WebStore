'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { apiClient } from '@/lib/api/client';
import type { StoreCategoriesResponse, StoreCategoryResponse } from '@/lib/types';

interface StoreCategoriesProps {
  storeId: string;
  initialData?: StoreCategoriesResponse['data'];
}

interface CategoryCardProps {
  category: StoreCategoryResponse;
  onClick: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border-0 hover:shadow-lg transition-all duration-200 cursor-pointer group p-4"
    >
      <div className="flex items-center">
        {/* Category Image */}
        <div className="relative w-16 h-16 overflow-hidden rounded-2xl bg-gray-50 flex-shrink-0">
          {category.imageUrl ? (
            <OptimizedImage
              imageId={category.imageUrl}
              alt={category.name}
              variant="preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#009CB9]/10 to-[#16DAFF]/10">
              <Package className="w-8 h-8 text-[#009CB9]" />
            </div>
          )}
        </div>
        
        {/* Category Info */}
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="font-bold text-[#212121] text-base line-clamp-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-[#757575] mt-1 line-clamp-1">
              {category.description}
            </p>
          )}
          <p className="text-sm text-[#009CB9] font-medium mt-1">
            {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
          </p>
        </div>
        
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#009CB9] transition-colors ml-2 flex-shrink-0" />
      </div>
    </div>
  );
};

export default function StoreCategories({ storeId, initialData }: StoreCategoriesProps) {
  const [categories, setCategories] = useState<StoreCategoryResponse[]>(initialData?.items || []);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [hasNext, setHasNext] = useState(initialData?.hasNext || false);

  const loadCategories = async (page: number = 1, append = false) => {
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
    // For web version, we'll just show an alert - in real app this would navigate
    alert(`This would show products in "${category.name}" category in the full app!`);
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
      <div className="px-4 py-4">
        {categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3">
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
              <div className="flex justify-center pt-6">
                <Button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="min-w-32 rounded-xl border-[#009CB9] text-[#009CB9] hover:bg-[#009CB9] hover:text-white"
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
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="flex p-4">
                  <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-2xl" />
                  <div className="ml-4 flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-[#009CB9]/10 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-[#009CB9]" />
            </div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">No Categories Yet</h3>
            <p className="text-[#757575] text-center">This store hasn't organized products into categories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}