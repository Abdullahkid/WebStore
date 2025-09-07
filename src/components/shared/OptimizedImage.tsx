'use client';

import Image from 'next/image';
import { useState } from 'react';
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
}

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
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(
    imageId ? apiClient.getImageUrl(imageId, variant) : '/placeholder-image.png'
  );

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setCurrentSrc('/placeholder-image.png');
    onError?.();
  };

  const imageProps = {
    src: currentSrc,
    alt,
    className: `${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''} ${
      hasError ? 'opacity-75' : ''
    }`.trim(),
    onLoad: handleLoad,
    onError: handleError,
    priority,
    sizes: fill ? sizes : undefined,
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
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse rounded ${
            fill ? '' : `w-${width || 400} h-${height || 400}`
          }`}
        />
      )}
      
      {/* Main image */}
      <Image
        {...imageProps}
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoading ? 0 : 1,
        }}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded" />
            <p>Image not available</p>
          </div>
        </div>
      )}
    </div>
  );
}