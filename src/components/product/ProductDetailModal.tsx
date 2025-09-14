'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { BRAND_COLORS } from '@/lib/constants';
import {
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Store,
  MessageCircle,
  Truck,
  RotateCcw,
  MapPin,
  Clock,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import type { MiniProduct } from '@/lib/types';

interface ProductVariant {
  attributeName: string;
  options: string[];
}

interface DetailedProduct extends MiniProduct {
  brandName?: string;
  description: string;
  keyFeatures: string[];
  customAttributes: Record<string, string>;
  variants?: ProductVariant[];
  images: string[];
  averageRating: number;
  totalReviews: number;
  isReturnable: boolean;
  estimatedDeliveryDays?: { min: number; max: number };
  shippingCost: number;
  isCodAllowed: boolean;
  inventory: number;
  storeName: string;
  storeRating: number;
  storeProductsCount: number;
  storeLogo?: string;
}

interface ProductDetailModalProps {
  product: MiniProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [detailedProduct, setDetailedProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);

  // Mock detailed product data - In real app, fetch from API
  const fetchProductDetails = async (productId: string): Promise<DetailedProduct> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      ...product!,
      brandName: 'Sample Brand',
      description: 'This is a detailed description of the product with all the important information that customers need to know before making a purchase decision.',
      keyFeatures: [
        'High quality materials',
        'Durable construction',
        'Modern design',
        'Easy to use'
      ],
      customAttributes: {
        'Material': 'Cotton Blend',
        'Color': 'Blue',
        'Size': 'Medium',
        'Weight': '200g'
      },
      variants: [
        {
          attributeName: 'Size',
          options: ['Small', 'Medium', 'Large', 'X-Large']
        },
        {
          attributeName: 'Color',
          options: ['Red', 'Blue', 'Green', 'Black']
        }
      ],
      images: [product?.mainImageUrl || '', product?.mainImageUrl || '', product?.mainImageUrl || ''],
      averageRating: 4.2,
      totalReviews: 156,
      isReturnable: true,
      estimatedDeliveryDays: { min: 2, max: 5 },
      shippingCost: 0,
      isCodAllowed: true,
      inventory: 25,
      storeName: 'Sample Store',
      storeRating: 4.5,
      storeProductsCount: 120,
      storeLogo: undefined
    };
  };

  useEffect(() => {
    if (product && isOpen) {
      setLoading(true);
      fetchProductDetails(product.id)
        .then(setDetailedProduct)
        .finally(() => setLoading(false));
    }
  }, [product, isOpen]);

  const handleVariantSelect = (attributeName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    if (detailedProduct) {
      setCurrentImageIndex((prev) => 
        prev === detailedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (detailedProduct) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? detailedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const calculateDiscount = (mrp?: number, sellingPrice?: number) => {
    if (!mrp || !sellingPrice || mrp <= sellingPrice) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: BRAND_COLORS.primary }}></div>
            </div>
          ) : detailedProduct ? (
            <div className="flex flex-col">
              {/* Header */}
              <DialogHeader className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Product Details
                  </DialogTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Left Column - Images */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <Card className="overflow-hidden">
                    <div className="relative aspect-square">
                      <OptimizedImage
                        imageId={detailedProduct.images[currentImageIndex]}
                        alt={detailedProduct.name}
                        variant="detail"
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => setShowFullscreenImage(true)}
                      />
                      
                      {/* Navigation Buttons */}
                      {detailedProduct.images.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextImage}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {/* Discount Badge */}
                      {detailedProduct.mrp && calculateDiscount(detailedProduct.mrp, detailedProduct.sellingPrice) > 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-500 text-white">
                            {calculateDiscount(detailedProduct.mrp, detailedProduct.sellingPrice)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Image Thumbnails */}
                  {detailedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {detailedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                            index === currentImageIndex 
                              ? 'border-blue-500' 
                              : 'border-gray-200'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <OptimizedImage
                            imageId={image}
                            alt={`Product ${index + 1}`}
                            variant="preview"
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-6">
                  {/* Title and Brand */}
                  <div>
                    {detailedProduct.brandName && (
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        {detailedProduct.brandName}
                      </p>
                    )}
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {detailedProduct.name}
                    </h1>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded">
                      <Star className="w-4 h-4 fill-green-600 text-green-600" />
                      <span className="text-green-800 font-medium text-sm">
                        {detailedProduct.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-600 text-sm">
                      ({detailedProduct.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-2xl font-bold text-gray-900">
                      <IndianRupee className="w-6 h-6" />
                      <span>{detailedProduct.sellingPrice.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {detailedProduct.mrp && detailedProduct.mrp > detailedProduct.sellingPrice && (
                      <>
                        <div className="flex items-center text-gray-500 text-lg line-through">
                          <IndianRupee className="w-4 h-4" />
                          <span>{detailedProduct.mrp.toLocaleString('en-IN')}</span>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {calculateDiscount(detailedProduct.mrp, detailedProduct.sellingPrice)}% OFF
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Return Policy */}
                  <Card className={`p-4 border ${detailedProduct.isReturnable ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className="flex items-center gap-3">
                      {detailedProduct.isReturnable ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-orange-600" />
                      )}
                      <div>
                        <p className={`font-medium ${detailedProduct.isReturnable ? 'text-green-800' : 'text-orange-800'}`}>
                          {detailedProduct.isReturnable ? 'Returns Accepted' : 'No Returns'}
                        </p>
                        <p className={`text-sm ${detailedProduct.isReturnable ? 'text-green-600' : 'text-orange-600'}`}>
                          {detailedProduct.isReturnable 
                            ? 'Easy returns within store policy' 
                            : 'This item cannot be returned'
                          }
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Variants */}
                  {detailedProduct.variants && detailedProduct.variants.map((variant) => (
                    <div key={variant.attributeName} className="space-y-3">
                      <h3 className="font-semibold text-gray-900">{variant.attributeName}</h3>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <Button
                            key={option}
                            variant={selectedVariants[variant.attributeName] === option ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleVariantSelect(variant.attributeName, option)}
                            className={selectedVariants[variant.attributeName] === option ? 
                              `bg-[${BRAND_COLORS.accent}] text-white` : ''
                            }
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Quantity */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Quantity</h3>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 10}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Available Stock:</span>
                      <div className="flex items-center gap-2">
                        {detailedProduct.inventory > 10 ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">{detailedProduct.inventory} units</span>
                          </>
                        ) : detailedProduct.inventory > 0 ? (
                          <>
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-600 font-medium">Only {detailedProduct.inventory} left!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-medium">Out of stock</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Visit
                    </Button>
                    <Button 
                      className="flex items-center gap-2 bg-[#16DAFF] hover:bg-[#16DAFF]/90 text-white"
                      disabled={detailedProduct.inventory === 0}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Collapsible Details */}
              <div className="border-t p-6 space-y-6">
                {/* Delivery Info */}
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Delivery Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {detailedProduct.estimatedDeliveryDays && (
                      <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="font-medium">
                          {detailedProduct.estimatedDeliveryDays.min}-{detailedProduct.estimatedDeliveryDays.max} days
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span className={`font-medium ${detailedProduct.shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {detailedProduct.shippingCost === 0 ? 'FREE' : `₹${detailedProduct.shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash on Delivery:</span>
                      <span className={`font-medium ${detailedProduct.isCodAllowed ? 'text-green-600' : 'text-red-600'}`}>
                        {detailedProduct.isCodAllowed ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Store Info */}
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    Store Information
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      {detailedProduct.storeLogo ? (
                        <OptimizedImage
                          imageId={detailedProduct.storeLogo}
                          alt={detailedProduct.storeName}
                          variant="preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <Store className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{detailedProduct.storeName}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{detailedProduct.storeRating}</span>
                        </div>
                        <span>•</span>
                        <span>{detailedProduct.storeProductsCount} products</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Product Description */}
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {detailedProduct.description}
                      </p>
                    </div>

                    {detailedProduct.keyFeatures.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {detailedProduct.keyFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {Object.keys(detailedProduct.customAttributes).length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(detailedProduct.customAttributes).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key}:</span>
                              <span className="font-medium text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Modal */}
      {showFullscreenImage && detailedProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setShowFullscreenImage(false)}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <OptimizedImage
              imageId={detailedProduct.images[currentImageIndex]}
              alt={detailedProduct.name}
              variant="fullscreen"
              fill
              className="object-contain"
            />
            
            {detailedProduct.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {detailedProduct.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}