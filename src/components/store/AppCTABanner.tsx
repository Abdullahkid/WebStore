'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEEP_LINK_CONFIG } from '@/lib/constants';
import type { StoreProfileData } from '@/lib/types';

interface AppCTABannerProps {
  storeData: StoreProfileData;
}

export default function AppCTABanner({ storeData }: AppCTABannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile device
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenApp = () => {
    const deepLinkUrl = `${DEEP_LINK_CONFIG.scheme}://${DEEP_LINK_CONFIG.host}/${storeData.id}`;
    const fallbackUrl = isMobile 
      ? DEEP_LINK_CONFIG.playStoreUrl 
      : DEEP_LINK_CONFIG.playStoreUrl;

    // Try to open the app
    window.location.href = deepLinkUrl;
    
    // Fallback to store after a delay if app doesn't open
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        window.open(fallbackUrl, '_blank');
      }
    }, 2000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store preference in localStorage
    localStorage.setItem('dismissedAppBanner', 'true');
  };

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedAppBanner');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                Get the full experience with the Downxtown app
              </p>
              <p className="text-xs text-white/80">
                Browse, follow stores, and shop seamlessly
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={handleOpenApp}
              size="sm"
              className="bg-white text-[#009CB9] hover:bg-white/90 font-semibold px-4 py-1 h-8 rounded-full"
            >
              Open App
            </Button>
            
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-1 h-8 w-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}