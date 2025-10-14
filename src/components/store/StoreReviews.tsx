'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { apiClient } from '@/lib/api/client';
import { storeStorage } from '@/lib/storage/storeStorage';
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
              ? 'fill-[#FFC107] text-[#FFC107]'
              : 'text-[#E0E0E0]'
          }`}
        />
      ))}
    </div>
  );
};

const RatingDistribution = ({ stats }: { stats: any }) => {
  const totalReviews = stats.totalReviews || 1;

  return (
    <div className="bg-[#E0F7FA] rounded-xl p-8 mb-6 text-center">
      <div className="mb-6">
        <div className="text-5xl font-bold text-[#00838F] mb-2">
          {stats.averageRating?.toFixed(1) || '0.0'}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 ${
                star <= Math.round(stats.averageRating || 0)
                  ? 'fill-[#FFC107] text-[#FFC107]'
                  : 'text-[#E0E0E0]'
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-[#00838F] font-medium">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="max-w-md mx-auto">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution?.[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-[#00838F] w-3">{rating}</span>
              <Star className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
              <div className="flex-1 bg-white rounded-full h-2.5">
                <div
                  className="bg-[#FFC107] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-[#00838F] font-medium w-10 text-right">{count}</span>
            </div>
          );
        })}
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
    <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-4 hover:shadow-md transition-all">
      {/* Review Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-12 h-12 border-2 border-[#E0F7FA]">
          {review.customerAvatar ? (
            <AvatarImage
              src={apiClient.getImageUrl(review.customerAvatar, 'preview')}
              alt={review.customerName}
            />
          ) : null}
          <AvatarFallback className="bg-[#00BCD4] text-white font-semibold">
            {review.customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-[#212121] text-base">{review.customerName}</span>
            {review.isVerifiedPurchase && (
              <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20 text-xs font-semibold rounded-full px-2 py-0.5">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-[#757575]">
            <StarRating rating={review.rating} />
            <span>•</span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Review Title */}
      {review.reviewTitle && (
        <h4 className="font-bold text-[#212121] mb-2 text-base">{review.reviewTitle}</h4>
      )}

      {/* Review Comment */}
      <p className="text-[#424242] leading-relaxed mb-4">{review.comment}</p>

      {/* Review Images */}
      {review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {review.images.map((imageId, index) => (
            <div key={index} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-[#E0E0E0]">
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
        <div className="bg-[#E0F7FA] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-[#00838F] text-sm">{review.storeResponse.responderName}</span>
            <Badge className="bg-white text-[#00838F] border-[#00BCD4]/20 text-xs">Store Response</Badge>
          </div>
          <p className="text-sm text-[#212121] leading-relaxed">{review.storeResponse.response}</p>
        </div>
      )}

      {/* Helpful Action */}
      <div className="flex items-center gap-4 pt-2 border-t border-[#F5F5F5]">
        <Button
          variant="ghost"
          size="sm"
          className="text-[#757575] hover:text-[#00838F] hover:bg-[#E0F7FA] rounded-full px-4 h-9"
        >
          <ThumbsUp className="w-4 h-4 mr-2" />
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

  const loadReviews = async (page: number = 1, append = false) => {
    // Try loading from cache first (only for page 1, not appending)
    if (page === 1 && !append) {
      const cached = await storeStorage.getStoreReviews(storeId, page);
      if (cached.valid && cached.data) {
        console.log('✅ Using cached reviews');
        setReviews(cached.data.reviews);
        setStats(cached.data.stats);
        setHasNextPage(cached.data.hasNextPage);
        // Don't set loading to false yet - fetch fresh data in background
      }
    }

    setLoading(true);
    try {
      const response = await apiClient.getStoreReviews(
        storeId,
        page,
        10
      );

      if (response && response.reviews) {
        if (append) {
          setReviews(prev => [...prev, ...response.reviews]);
        } else {
          setReviews(response.reviews);
          setStats(response.stats);
        }
        setCurrentPage(response.currentPage || page);
        setHasNextPage(response.hasNextPage || false);

        // Cache the reviews (only cache page 1)
        if (page === 1 && !append) {
          await storeStorage.saveStoreReviews(
            storeId,
            page,
            response.reviews,
            response.stats,
            response.totalPages,
            response.totalReviews,
            response.hasNextPage || false
          );
        }
      } else {
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
      <div className="px-6 py-8">
        {/* Overall Rating */}
        {stats && <RatingDistribution stats={stats} />}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <>
            <div>
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft transition-all rounded-full px-8 h-12 font-medium"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Load More Reviews'
                  )}
                </Button>
              </div>
            )}
          </>
        ) : loading ? (
          // Loading skeleton
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-[#E0E0E0] rounded-xl p-6 mb-4">
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#E0E0E0] rounded-full animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-[#E0E0E0] rounded w-1/4 animate-pulse" />
                    <div className="h-3 bg-[#E0E0E0] rounded w-1/3 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#E0E0E0] rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-[#E0E0E0] rounded w-full animate-pulse" />
                  <div className="h-4 bg-[#E0E0E0] rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-[#E0F7FA] rounded-full flex items-center justify-center mb-6">
              <Star className="w-16 h-16 text-[#00BCD4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#212121] mb-2">No Reviews Yet</h3>
            <p className="text-[#757575] text-center max-w-md mb-6">
              Be the first to review this store and help others make informed decisions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
