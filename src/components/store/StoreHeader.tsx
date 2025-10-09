'use client';

import { useState } from 'react';
import { Star, Phone, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge as UIBadge } from '@/components/ui/badge';
import OptimizedImage from '@/components/shared/OptimizedImage';
import ContactBottomSheet from './ContactBottomSheet';
import type { StoreProfileData } from '@/lib/types';

interface StoreHeaderProps {
  storeData: StoreProfileData;
}

export default function StoreHeader({ storeData }: StoreHeaderProps) {
  const [showContactSheet, setShowContactSheet] = useState(false);

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

  const handleCall = () => {
    window.open(`tel:${storeData.phoneNumber}`, '_self');
  };

  return (
    <>
      {/* Hero Section - Mobile/Tablet Only (Hidden on Desktop) - Compact Version */}
      <div className="lg:hidden bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="desktop-container-wide pt-16 pb-4">

          {/* Profile Image - Smaller and more compact */}
          <div className="flex justify-center mb-3 animate-fade-in">
            <div className="relative">
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full border-3 border-white shadow-lg overflow-hidden bg-white">
                {storeData.storeLogo ? (
                  <OptimizedImage
                    imageId={storeData.storeLogo}
                    alt={`${storeData.storeName} logo`}
                    variant="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] flex items-center justify-center">
                    <span className="text-white font-bold text-3xl md:text-4xl">
                      {storeData.storeName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Store Name - Smaller font */}
          <h1 className="text-xl md:text-2xl font-bold text-[#212121] text-center mb-2 animate-fade-in leading-tight">
            {storeData.storeName}
          </h1>

          {/* Category Badge - Smaller */}
          <div className="flex justify-center mb-3 animate-fade-in">
            <UIBadge className="bg-[#E0F7FA] text-[#00838F] border-0 px-3 py-1 rounded-full text-xs font-semibold">
              {storeData.storeCategory.toLowerCase().replace('_', ' ')}
            </UIBadge>
          </div>

          {/* Key Metrics Row - More compact */}
          <div className="flex justify-center items-center gap-4 md:gap-8 mb-4 animate-fade-in">
            {/* Products */}
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-[#212121] mb-0.5">
                {formatCount(storeData.productsCount)}
              </div>
              <div className="text-xs text-[#757575] font-medium">Products</div>
            </div>

            {/* Followers */}
            <div className="text-center">
              <div className="text-lg md:text-xl font-bold text-[#212121] mb-0.5">
                {formatCount(storeData.followersCount)}
              </div>
              <div className="text-xs text-[#757575] font-medium">Followers</div>
            </div>

            {/* Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <span className="text-lg md:text-xl font-bold text-[#212121]">
                  {storeData.storeRating.toFixed(1)}
                </span>
                <Star className="w-4 h-4 md:w-5 md:h-5 fill-[#FFC107] text-[#FFC107]" />
              </div>
              <div className="text-xs text-[#757575] font-medium">Rating</div>
            </div>
          </div>

          {/* Contact Button with Social Media Icons */}
          <div className="max-w-xs mx-auto animate-fade-in px-4">
            <div className="flex items-center gap-2">
              {/* Contact Button - Flexible width with minimum */}
              <Button
                onClick={() => setShowContactSheet(true)}
                className="flex-1 min-w-[120px] h-10 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-full font-semibold text-sm shadow-md hover:shadow-brand-soft transition-smooth"
              >
                <Phone className="w-4 h-4 mr-1.5" />
                Contact
              </Button>

              {/* Social Media Icons - Show first 3, then +N */}
              {storeData.socialLinks && (() => {
                const socialLinks = [
                  { name: 'instagram', url: storeData.socialLinks.instagram, gradient: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                  { name: 'twitter', url: storeData.socialLinks.twitter, gradient: 'bg-black', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { name: 'facebook', url: storeData.socialLinks.facebook, gradient: 'bg-[#1877F2]', svg: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { name: 'youtube', url: storeData.socialLinks.youtube, gradient: 'bg-[#FF0000]', svg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                ].filter(link => link.url);

                const maxVisible = 3;
                const visibleLinks = socialLinks.slice(0, maxVisible);
                const hiddenCount = socialLinks.length - maxVisible;

                return (
                  <>
                    {visibleLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url!.startsWith('http') ? link.url! : `https://${link.name === 'twitter' ? 'x' : link.name}.com/${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-shrink-0 w-9 h-9 rounded-full ${link.gradient} flex items-center justify-center hover:scale-110 transition-transform shadow-md`}
                      >
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d={link.svg} />
                        </svg>
                      </a>
                    ))}
                    {hiddenCount > 0 && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                        +{hiddenCount}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
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
