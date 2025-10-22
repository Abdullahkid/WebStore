'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { apiClient, generateImageSrcSet } from '@/lib/api/client';
import type { ImageVariant } from '@/lib/types';

interface OptimizedImageProps {
  imageId: string;
  alt: string;
  variant?: ImageVariant;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  showSkeleton?: boolean;
}

// Generate a simple blur placeholder (shimmer effect)
const shimmerPlaceholder = `data:image/svg+xml;base64,${Buffer.from(
  `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#E5E7EB;stop-opacity:1">
          <animate attributeName="offset" values="-2; 1" dur="1.5s" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" style="stop-color:#F3F4F6;stop-opacity:1">
          <animate attributeName="offset" values="-1; 2" dur="1.5s" repeatCount="indefinite" />
        </stop>
        <stop offset="100%" style="stop-color:#E5E7EB;stop-opacity:1">
          <animate attributeName="offset" values="0; 3" dur="1.5s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#shimmer)" />
  </svg>`
).toString('base64')}`;

export default function OptimizedImage({
  imageId,
  alt,
  variant = 'preview',
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError,
  showSkeleton = true,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(
    imageId ? apiClient.getImageUrl(imageId, variant) : '/placeholder-image.png'
  );

  // Simulate progressive load for better UX
  useEffect(() => {
    if (isLoading && showSkeleton) {
      const interval = setInterval(() => {
        setLoadProgress(prev => Math.min(prev + 10, 90));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isLoading, showSkeleton]);

  const handleLoad = () => {
    setLoadProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      onLoad?.();
    }, 100);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setLoadProgress(0);
    setCurrentSrc('/placeholder-image.png');
    onError?.();
  };

  const imageProps = {
    src: currentSrc,
    alt,
    className: `${className} ${hasError ? 'opacity-50' : ''}`.trim(),
    onLoad: handleLoad,
    onError: handleError,
    priority,
    sizes: fill ? sizes : undefined,
    placeholder: 'blur' as const,
    blurDataURL: shimmerPlaceholder,
    ...(fill
      ? { fill: true }
      : {
          width: width || 400,
          height: height || 400,
        }),
  };

  // For responsive images with srcSet
  if (imageId && !hasError) {
    const srcSet = generateImageSrcSet(imageId);
    if (srcSet) {
      (imageProps as any).srcSet = srcSet;
    }
  }

  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}>
      {/* Enhanced loading skeleton with progress */}
      {isLoading && showSkeleton && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer">
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00BCD4] to-[#0097A7] transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>

          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide" />
        </div>
      )}

      {/* Main image with smooth fade-in */}
      <div
        className={`transition-opacity duration-500 ease-out ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          {...imageProps}
          style={{
            objectFit: 'cover',
          }}
          quality={variant === 'preview' ? 75 : variant === 'detail' ? 85 : 90}
        />
      </div>

      {/* Error fallback with retry option */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
          <div className="text-center p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-500">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
}