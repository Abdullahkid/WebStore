'use client';

import { useState } from 'react';
import { Star, MapPin, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OptimizedImage from '@/components/shared/OptimizedImage';
import SocialShareButton from '@/components/shared/SocialShareButton';
import { apiClient } from '@/lib/api/client';
import { BRAND_COLORS } from '@/lib/constants';
import type { StoreProfileData, FollowActionState } from '@/lib/types';

interface StoreHeaderProps {
  storeData: StoreProfileData;
}

export default function StoreHeader({ storeData }: StoreHeaderProps) {
  const [followState, setFollowState] = useState<FollowActionState>({ 
    isLoading: false 
  });
  const [isFollowing, setIsFollowing] = useState(storeData.isFollowing);

  const handleFollowClick = async () => {
    // For web version, redirect to app or show auth modal
    // This is a simplified implementation
    alert('Please download the Downxtown app to follow stores!');
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      FASHION: 'bg-pink-100 text-pink-800',
      FOOTWEAR: 'bg-brown-100 text-brown-800',
      ELECTRONICS: 'bg-blue-100 text-blue-800',
      COSMETICS: 'bg-purple-100 text-purple-800',
      ACCESSORIES: 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      {/* Header Top Row - Profile + Stats */}
      <div className="flex items-start gap-6 mb-4">
        {/* Profile Picture with Gradient Border */}
        <div className="relative flex-shrink-0">
          <div 
            className="w-24 h-24 rounded-full p-1"
            style={{
              background: `linear-gradient(45deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.accent}, ${BRAND_COLORS.primary})`,
            }}
          >
            <div className="w-full h-full rounded-full bg-white p-1">
              {storeData.storeLogo ? (
                <OptimizedImage
                  imageId={storeData.storeLogo}
                  alt={`${storeData.storeName} logo`}
                  variant="preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Avatar className="w-full h-full">
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-[#009CB9] to-[#16DAFF] text-white">
                    {storeData.storeName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          
          {/* Following Indicator Badge */}
          {isFollowing && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#4CAF50] rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>
        
        {/* Stats - Instagram Style */}
        <div className="flex-1">
          <div className="flex justify-around text-center mb-4">
            {/* Products Count */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xl font-bold text-[#212121]">
                <Package className="w-5 h-5 text-[#009CB9]" />
                {formatCount(storeData.productsCount)}
              </div>
              <span className="text-sm text-[#757575] font-medium">Products</span>
            </div>
            
            {/* Followers Count */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xl font-bold text-[#212121]">
                <Users className="w-5 h-5 text-[#009CB9]" />
                {formatCount(storeData.followersCount)}
              </div>
              <span className="text-sm text-[#757575] font-medium">Followers</span>
            </div>
            
            {/* Rating */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-xl font-bold text-[#212121]">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {storeData.storeRating.toFixed(1)}
              </div>
              <span className="text-sm text-[#757575] font-medium">Rating</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Store Info */}
      <div className="space-y-3">
        {/* Store Name and Category */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-[#212121]">{storeData.storeName}</h1>
          <Badge className={`${getCategoryColor(storeData.storeCategory)} border-0 font-medium`}>
            {storeData.storeCategory.toLowerCase().replace('_', ' ')}
          </Badge>
        </div>
        
        {/* Username */}
        <p className="text-[#757575] font-medium">@{storeData.storeUsername}</p>
        
        {/* Location */}
        {storeData.location && (
          <div className="flex items-center gap-2 text-[#757575]">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{storeData.location}</span>
          </div>
        )}
        
        {/* Store Description */}
        {storeData.storeDescription && (
          <p className="text-[#212121] leading-6 text-base">
            {storeData.storeDescription}
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleFollowClick}
          disabled={followState.isLoading}
          className={`flex-1 font-semibold h-9 rounded-lg transition-all ${
            isFollowing
              ? 'bg-gray-100 text-[#212121] border border-gray-300 hover:bg-gray-200'
              : 'bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white hover:from-[#008BA5] hover:to-[#14C7E8] border-0'
          }`}
        >
          {followState.isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFollowing ? (
            'Following'
          ) : (
            'Follow'
          )}
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 font-semibold h-9 rounded-lg border-[#009CB9] text-[#009CB9] hover:bg-[#009CB9] hover:text-white transition-all"
          onClick={() => window.open(`tel:${storeData.phoneNumber}`, '_self')}
        >
          Message
        </Button>
        
        <SocialShareButton 
          storeData={storeData}
          className="h-9 px-3 border border-gray-300 hover:bg-gray-50"
        />
      </div>
    </div>
  );
}