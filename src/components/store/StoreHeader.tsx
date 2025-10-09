'use client';

import { useState } from 'react';
import { Star, Users, Package, Phone, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge as UIBadge } from '@/components/ui/badge';
import OptimizedImage from '@/components/shared/OptimizedImage';
import ContactBottomSheet from './ContactBottomSheet';
import type { StoreProfileData, FollowActionState } from '@/lib/types';

interface StoreHeaderProps {
  storeData: StoreProfileData;
}

export default function StoreHeader({ storeData }: StoreHeaderProps) {
  const [followState, setFollowState] = useState<FollowActionState>({
    isLoading: false
  });
  const [isFollowing, setIsFollowing] = useState(storeData.isFollowing);
  const [showContactSheet, setShowContactSheet] = useState(false);

  const handleFollowClick = async () => {
    // For web version, redirect to app or show auth modal
    alert('Please download the Downxtown app to follow stores!');
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storeData.storeName,
        text: `Check out ${storeData.storeName} on Downxtown!`,
        url: window.location.href
      });
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Store link copied to clipboard!');
    }
  };

  const handleMessage = () => {
    const cleanNumber = storeData.phoneNumber.replace(/[^\d]/g, '');
    const message = `Hi ${storeData.storeName}, I'm interested in your products.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${storeData.phoneNumber}`, '_self');
  };

  return (
    <>
      {/* Hero Section - Blueprint Design */}
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 pt-20 md:pt-24 pb-12">

          {/* Profile Image - Centered */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="relative">
              <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {storeData.storeLogo ? (
                  <OptimizedImage
                    imageId={storeData.storeLogo}
                    alt={`${storeData.storeName} logo`}
                    variant="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] flex items-center justify-center">
                    <span className="text-white font-bold text-5xl md:text-6xl">
                      {storeData.storeName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Name */}
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#212121] text-center mb-3 animate-fade-in">
            {storeData.storeName}
          </h1>

          {/* Category Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <UIBadge className="bg-[#E0F7FA] text-[#00838F] border-0 px-4 py-2 rounded-full text-sm font-semibold">
              {storeData.storeCategory.toLowerCase().replace('_', ' ')}
            </UIBadge>
          </div>

          {/* Key Metrics Row */}
          <div className="flex justify-center items-center gap-8 md:gap-12 mb-8 animate-fade-in">
            {/* Products */}
            <div className="text-center">
              <div className="text-[24px] md:text-[28px] font-bold text-[#212121] mb-1">
                {formatCount(storeData.productsCount)}
              </div>
              <div className="text-sm text-[#757575]">Products</div>
            </div>

            {/* Followers */}
            <div className="text-center">
              <div className="text-[24px] md:text-[28px] font-bold text-[#212121] mb-1">
                {formatCount(storeData.followersCount)}
              </div>
              <div className="text-sm text-[#757575]">Followers</div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-[24px] md:text-[28px] font-bold text-[#212121]">
                  {storeData.storeRating.toFixed(1)}
                </span>
                <Star className="w-5 h-5 md:w-6 md:h-6 fill-[#FFC107] text-[#FFC107]" />
              </div>
              <div className="text-sm text-[#757575]">Rating</div>
            </div>
          </div>

          {/* Action Buttons Row - Mobile: Stack, Desktop: Inline */}
          <div className="max-w-2xl mx-auto space-y-3 md:space-y-0 md:flex md:gap-4 animate-fade-in">
            {/* Follow Button - Primary CTA */}
            <Button
              onClick={handleFollowClick}
              disabled={followState.isLoading}
              className={`
                w-full md:flex-1 h-12 rounded-full font-medium text-base shadow-lg transition-smooth
                ${isFollowing
                  ? 'bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2] hover:bg-[#B2EBF2]'
                  : 'bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white hover:shadow-brand-soft'
                }
              `}
            >
              {followState.isLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                isFollowing ? 'Following' : 'Follow'
              )}
            </Button>

            {/* Message Button - Secondary */}
            <Button
              onClick={handleMessage}
              className="w-full md:w-[200px] h-12 bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2] rounded-full font-medium text-base hover:bg-[#B2EBF2] transition-smooth"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message
            </Button>

            {/* Contact Button - Secondary */}
            <Button
              onClick={() => setShowContactSheet(true)}
              className="w-full md:w-[200px] h-12 bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2] rounded-full font-medium text-base hover:bg-[#B2EBF2] transition-smooth"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact
            </Button>
          </div>

          {/* Mobile: Stack Message and Contact side-by-side */}
          <div className="md:hidden flex gap-3 mt-3 animate-fade-in">
            <Button
              onClick={handleMessage}
              className="flex-1 h-12 bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2] rounded-full font-medium text-base hover:bg-[#B2EBF2] transition-smooth"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message
            </Button>

            <Button
              onClick={() => setShowContactSheet(true)}
              className="flex-1 h-12 bg-[#E0F7FA] text-[#00838F] border border-[#B2EBF2] rounded-full font-medium text-base hover:bg-[#B2EBF2] transition-smooth"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky Header for Desktop - Shows on scroll */}
      <div className="hidden md:block sticky top-0 z-50 bg-white border-b border-[#E0E0E0] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 lg:px-12 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-[#00BCD4]">Downxtown</span>
            </a>
          </div>

          {/* Center: Store Name */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-lg font-semibold text-[#212121]">{storeData.storeName}</span>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCall}
              className="text-[#00838F] hover:bg-[#E0F7FA]"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-[#00838F] hover:bg-[#E0F7FA]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#00838F] hover:bg-[#E0F7FA]"
            >
              ⋮
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-[#E0E0E0] shadow-sm">
        <div className="px-4 h-14 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            ←
          </Button>
          <span className="text-base font-semibold text-[#212121]">{storeData.storeName}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCall}>
              📞
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              🔗
            </Button>
            <Button variant="ghost" size="sm">
              ⋮
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Bottom Sheet */}
      {showContactSheet && (
        <ContactBottomSheet
          storeData={storeData}
          onDismiss={() => setShowContactSheet(false)}
        />
      )}
    </>
  );
}
