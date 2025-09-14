'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronDown, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { apiClient } from '@/lib/api/client';
import type { PaginatedStoreReviewsResponse, StoreReview } from '@/lib/types';

interface StoreReviewsProps {
  storeId: string;
  initialData?: PaginatedStoreReviewsResponse;
}

interface ReviewCardProps {
  review: StoreReview;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const RatingDistribution = ({ stats }: { stats: any }) => {
  const totalReviews = stats.totalReviews || 1;
  
  return (
    <div className="bg-white border-b border-gray-100 p-5 mb-1">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#212121]">{stats.averageRating?.toFixed(1) || '0.0'}</div>
          <StarRating rating={Math.round(stats.averageRating || 0)} />
          <div className="text-sm text-[#757575] mt-1">{totalReviews} reviews</div>
        </div>
        
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution?.[rating] || 0;
            const percentage = (count / totalReviews) * 100;
            
            return (
              <div key={rating} className="flex items-center gap-2 mb-1.5">
                <span className="text-sm w-2 text-[#757575]">{rating}</span>
                <Star className="w-3 h-3 fill-[#FFB000] text-[#FFB000]" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#FFB000] h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-[#757575] w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white border-b border-gray-100 p-5 space-y-3">
      {/* Review Header */}
      <div className="flex items-start gap-3">
        <Avatar className="w-11 h-11">
          {review.customerAvatar ? (
            <AvatarImage 
              src={apiClient.getImageUrl(review.customerAvatar, 'preview')} 
              alt={review.customerName}
            />
          ) : null}
          <AvatarFallback className="bg-[#009CB9] text-white font-medium">
            {review.customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#212121]">{review.customerName}</span>
            {review.isVerifiedPurchase && (
              <Badge variant="outline" className="text-xs bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20 rounded-xl">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} />
            <span className="text-sm text-[#757575]">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>
      
      {/* Review Title */}
      {review.reviewTitle && (
        <h4 className="font-bold text-[#212121]">{review.reviewTitle}</h4>
      )}
      
      {/* Review Comment */}
      <p className="text-[#212121] leading-relaxed">{review.comment}</p>
      
      {/* Review Images */}
      {review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {review.images.map((imageId, index) => (
            <div key={index} className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
              <OptimizedImage
                imageId={imageId}
                alt={`Review image ${index + 1}`}
                variant="preview"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Store Response */}
      {review.storeResponse && (
        <div className="bg-[#F0F8FF] rounded-xl p-3 ml-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#212121] text-sm">{review.storeResponse.responderName}</span>
            <Badge variant="outline" className="text-xs bg-[#009CB9]/10 text-[#009CB9] border-[#009CB9]/20">Store Response</Badge>
          </div>
          <p className="text-sm text-[#212121]">{review.storeResponse.response}</p>
        </div>
      )}
      
      {/* Helpful Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#757575] hover:text-[#009CB9] p-2 h-auto rounded-xl"
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Helpful ({review.helpfulCount})
        </Button>
      </div>
    </div>
  );
};

export default function StoreReviews({ storeId, initialData }: StoreReviewsProps) {
  const [reviews, setReviews] = useState<StoreReview[]>(initialData?.reviews || []);
  const [stats, setStats] = useState(initialData?.stats);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [hasNextPage, setHasNextPage] = useState(initialData?.hasNextPage || false);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState('RECENT');

  const filterOptions = [
    { value: undefined, label: 'All Reviews' },
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4 Stars' },
    { value: 3, label: '3 Stars' },
    { value: 2, label: '2 Stars' },
    { value: 1, label: '1 Star' },
  ];

  const sortOptions = [
    { value: 'RECENT', label: 'Most Recent' },
    { value: 'RATING', label: 'Highest Rated' },
    { value: 'HELPFUL', label: 'Most Helpful' },
  ];

  const loadReviews = async (page: number = 1, append = false) => {
    setLoading(true);
    try {
      console.log('Loading reviews for store:', storeId, 'page:', page);
      const response = await apiClient.getStoreReviews(
        storeId, 
        page, 
        10, 
        ratingFilter, 
        false, 
        sortBy
      );
      
      console.log('Reviews response:', response);
      
      // Handle the response correctly - it might be structured differently
      if (response && response.reviews) {
        if (append) {
          setReviews(prev => [...prev, ...response.reviews]);
        } else {
          setReviews(response.reviews);
          setStats(response.stats);
        }
        setCurrentPage(response.currentPage || page);
        setHasNextPage(response.hasNextPage || false);
      } else {
        // Handle case where response doesn't have expected structure
        console.log('Unexpected response structure:', response);
        setReviews([]);
        setStats(undefined);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
      setStats(undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (rating: number | undefined) => {
    setRatingFilter(rating);
    setCurrentPage(1);
    loadReviews(1, false);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
    loadReviews(1, false);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !loading) {
      loadReviews(currentPage + 1, true);
    }
  };

  // Load initial data if not provided
  useEffect(() => {
    if (!initialData) {
      loadReviews();
    }
  }, [storeId, initialData]);

  return (
    <div className="bg-white">
      {/* Stats and Filters */}
      {stats && <RatingDistribution stats={stats} />}
      
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <h3 className="font-bold text-[#212121] text-base">Reviews</h3>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="bg-[#757575]/8 hover:bg-[#757575]/15 rounded-2xl px-3 py-2 h-auto">
                <span className="text-xs text-[#757575] font-medium mr-1.5">
                  {filterOptions.find(opt => opt.value === ratingFilter)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-[#757575]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => handleFilterChange(option.value)}
                  className={`rounded-lg text-sm ${
                    ratingFilter === option.value 
                      ? 'bg-[#009CB9]/10 text-[#009CB9] font-semibold' 
                      : 'text-[#212121]'
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="bg-[#757575]/8 hover:bg-[#757575]/15 rounded-2xl px-3 py-2 h-auto">
                <span className="text-xs text-[#757575] font-medium mr-1.5">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
                <ChevronDown className="w-4 h-4 text-[#757575]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`rounded-lg text-sm ${
                    sortBy === option.value 
                      ? 'bg-[#009CB9]/10 text-[#009CB9] font-semibold' 
                      : 'text-[#212121]'
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Reviews List */}
      <div>
        {reviews.length > 0 ? (
          <>
            <div className="">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center p-6">
                <Button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="min-w-32 rounded-xl border-[#009CB9] text-[#009CB9] hover:bg-[#009CB9] hover:text-white"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Load More Reviews'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          // Loading skeleton
          <div className="">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b border-gray-100 p-5">
                <div className="flex gap-3 mb-3">
                  <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-[#009CB9]/10 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-[#009CB9]" />
            </div>
            <h3 className="text-xl font-bold text-[#212121] mb-2">No Reviews Yet</h3>
            <p className="text-[#757575] text-center mb-4">Be the first to review this store!</p>
            {/* Debug info */}
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded mt-4">
              <p>Store ID: {storeId}</p>
              <p>Initial data: {initialData ? 'provided' : 'none'}</p>
              <p>Stats: {stats ? JSON.stringify(stats) : 'none'}</p>
              <p>Loading: {loading.toString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}