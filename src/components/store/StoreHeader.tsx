'use client';

import { useState } from 'react';
import { Star, Users, Package, CheckCircle, MapPin, Phone, Share2, MessageCircle, ExternalLink, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OptimizedImage from '@/components/shared/OptimizedImage';
import ContactBottomSheet from './ContactBottomSheet';
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

  return (
    <div className="relative">
      {/* Store Banner Section */}
      <div className="relative h-56 md:h-72 gradient-primary overflow-hidden">
        {/* Modern Banner Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Top Action Bar */}
        <div className="absolute top-6 right-6 flex gap-3 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="glass-card border-0 text-slate-700 hover:bg-white/95 rounded-full px-4 py-2.5 shadow-soft hover-lift"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="glass-card border-0 text-slate-700 hover:bg-white/95 rounded-full px-4 py-2.5 shadow-soft hover-lift"
            onClick={() => window.open(`tel:${storeData.phoneNumber}`, '_self')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        </div>
        
        {/* Store Logo - Enhanced positioning and styling */}
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl shadow-premium border-2 border-white/50 overflow-visible bg-white hover-lift">
              {storeData.storeLogo ? (
                <OptimizedImage
                  imageId={storeData.storeLogo}
                  alt={`${storeData.storeName} logo`}
                  variant="preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="w-full h-full gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-3xl md:text-4xl">
                    {storeData.storeName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Verification Badge */}
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg hover-glow">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Store Info Section */}
      <div className="gradient-surface px-8 pt-24 md:pt-28 pb-8">
        {/* Store Name & Category */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                {storeData.storeName}
              </h1>

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <UIBadge className="gradient-primary text-white border-0 px-4 py-2 rounded-full font-medium shadow-brand">
                  {storeData.storeCategory.toLowerCase().replace('_', ' ')}
                </UIBadge>

                {storeData.isFollowing && (
                  <UIBadge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 rounded-full font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Following
                  </UIBadge>
                )}

                <UIBadge className="bg-amber-50 text-amber-700 border-amber-200 px-4 py-2 rounded-full font-medium">
                  <Award className="w-4 h-4 mr-2" />
                  Verified Store
                </UIBadge>
              </div>
              
              {/* Store Description */}
              {storeData.storeDescription && (
                <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                  {storeData.storeDescription}
                </p>
              )}

              {/* Location */}
              {storeData.location && (
                <div className="flex items-center text-slate-500 text-base mb-6">
                  <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                  <span className="font-medium">{storeData.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats Row - Modern Cards Layout */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {formatCount(storeData.productsCount)}
            </div>
            <div className="text-sm font-semibold text-slate-600">Products</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {formatCount(storeData.followersCount)}
            </div>
            <div className="text-sm font-semibold text-slate-600">Followers</div>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center hover-lift">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-soft">
                <Star className="w-6 h-6 text-amber-500 fill-current" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {storeData.storeRating.toFixed(1)}
            </div>
            <div className="text-sm font-semibold text-slate-600">Rating</div>
          </div>
        </div>
        
        {/* Action Buttons - Modern CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleFollowClick}
            disabled={followState.isLoading}
            className={`h-14 font-semibold text-base rounded-2xl transition-all shadow-soft hover-lift ${
              isFollowing
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                : 'gradient-primary text-white hover:shadow-brand'
            }`}
          >
            {followState.isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isFollowing ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Following
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-3" />
                    Follow Store
                  </>
                )}
              </>
            )}
          </Button>

          <Button
            className="h-14 font-semibold text-base rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-brand transition-all hover-lift"
            onClick={() => {
              const cleanNumber = storeData.phoneNumber.replace(/[^\d]/g, '');
              const message = `Hi ${storeData.storeName}, I'm interested in your products.`;
              window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
            }}
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            WhatsApp
          </Button>

          <Button
            onClick={() => setShowContactSheet(true)}
            variant="outline"
            className="h-14 font-semibold text-base rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all hover-lift"
          >
            <Phone className="w-5 h-5 mr-3" />
            Contact
          </Button>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center text-sm font-medium text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mr-3" />
            Verified Seller
          </div>
          <div className="flex items-center text-sm font-medium text-slate-600">
            <Award className="w-5 h-5 text-amber-500 mr-3" />
            Trusted Store
          </div>
          <div className="flex items-center text-sm font-medium text-slate-600">
            <Package className="w-5 h-5 text-blue-500 mr-3" />
            Fast Shipping
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
    </div>
  );
}