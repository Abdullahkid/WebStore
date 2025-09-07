'use client';

import { useState } from 'react';
import { Share2, Copy, MessageCircle, Link, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { StoreProfileData } from '@/lib/types';

interface SocialShareButtonProps {
  storeData: StoreProfileData;
  className?: string;
}

export default function SocialShareButton({ storeData, className }: SocialShareButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `Check out ${storeData.storeName} on Downxtown`;
  const shareText = `${storeData.storeDescription || `Amazing products from ${storeData.storeName}`} 🛍️`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(`${shareTitle}\n\n${shareText}\n\n${currentUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleCopyLink} className="flex items-center gap-2">
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleWhatsAppShare} className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-600" />
          <span>Share on WhatsApp</span>
        </DropdownMenuItem>
        
        {navigator.share && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleWebShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>More Options</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}