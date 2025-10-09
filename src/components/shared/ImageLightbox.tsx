'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { Button } from '@/components/ui/button';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

export default function ImageLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  productTitle,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4 md:p-6">
          <div className="flex-1">
            <h2 className="text-white text-lg md:text-xl font-semibold line-clamp-1">
              {productTitle}
            </h2>
            <p className="text-white/60 text-sm mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full p-2 h-auto"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="absolute inset-0 flex items-center justify-center p-4 md:p-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative max-w-7xl max-h-full transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={toggleZoom}
        >
          <OptimizedImage
            imageId={images[currentIndex]}
            alt={`${productTitle} - Image ${currentIndex + 1}`}
            variant="detail"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Navigation Controls - Desktop Only */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-110"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-110"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
        <div className="p-4 md:p-6">
          {/* Zoom Controls - Desktop Only */}
          <div className="hidden lg:flex justify-center gap-3 mb-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
              variant="ghost"
              size="sm"
              className={`text-white hover:bg-white/20 ${
                !isZoomed ? 'bg-white/20' : ''
              }`}
            >
              <ZoomOut className="w-5 h-5 mr-2" />
              Fit to Screen
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(true);
              }}
              variant="ghost"
              size="sm"
              className={`text-white hover:bg-white/20 ${
                isZoomed ? 'bg-white/20' : ''
              }`}
            >
              <ZoomIn className="w-5 h-5 mr-2" />
              Zoom In
            </Button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-3 transition-all ${
                    currentIndex === index
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-white/30 hover:border-white/60 hover:scale-105'
                  }`}
                >
                  <OptimizedImage
                    imageId={image}
                    alt={`${productTitle} thumbnail ${index + 1}`}
                    variant="preview"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Touch Areas */}
      {images.length > 1 && (
        <>
          <div
            className="lg:hidden absolute left-0 top-0 bottom-0 w-1/3"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
          />
          <div
            className="lg:hidden absolute right-0 top-0 bottom-0 w-1/3"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </>
      )}
    </div>
  );
}
