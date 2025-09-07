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
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Category Image */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-50">
        {category.imageUrl ? (
          <OptimizedImage
            imageId={category.imageUrl}
            alt={category.name}
            variant="preview"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#009CB9]/10 to-[#16DAFF]/10">
            <Package className="w-12 h-12 text-[#009CB9]" />
          </div>
        )}
        
        {/* Product Count Badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
          {category.productCount}
        </div>
      </div>
      
      {/* Category Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#212121] text-base line-clamp-1">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-sm text-[#757575] mt-1 line-clamp-2">
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#212121]">
          Categories ({categories.length})
        </h2>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏷️</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Yet</h3>
          <p className="text-gray-500">This store hasn't organized products into categories yet.</p>
        </div>
      )}
    </div>
  );
}