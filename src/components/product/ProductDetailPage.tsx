'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  MessageCircle, 
  Store,
  Plus,
  Minus,
  ShoppingBag,
  ChevronRight,
  Check,
  Clock,
  MapPin
} from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProductPageDetailsDto {
  id: string;
  title: string;
  brandName?: string;
  description: string;
  keyFeatures: string[];
  defaultImages: string[];
  images: string[];
  mrp?: number;
  sellingPrice: number;
  variants: ProductVariantPageDto[];
  variantAttributes: Record<string, string[]>;
  hasVariants: boolean;
  totalInventory: number;
  isAvailable: boolean;
  customAttributes: Record<string, string>;
  isReturnable: boolean;
  isCodAllowed: boolean;
  estimatedDeliveryDays?: { minDays: number; maxDays: number };
  shippingCost?: { local: number; national: number };
  averageRating: number;
  totalReviews: number;
  storeInfo: StoreProfileMiniDto;
  discountPercentage: number;
  formattedPrice: string;
  formattedMrp?: string;
}

interface ProductVariantPageDto {
  variantId: string;
  attributes: Record<string, string>;
  images: string[];
  useProductImages: boolean;
  mrp?: number;
  sellingPrice: number;
  inventory: number;
  sku?: string;
  status: string;
}

interface StoreProfileMiniDto {
  businessId: string;
  storeName: string;
  storeUsername: string;
  storeType: string;
  storeLogo?: string;
  storeCategory: string;
  storeRating: number;
  productsCount: number;
  followersCount: number;
  formattedRating: string;
}

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductPageDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple toast implementation - you can replace with your preferred toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  // Fetch product details
  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('=== FRONTEND DEBUG ===');
      console.log('Fetching product details for ID:', productId);
      
      // Direct backend call - same as Android implementation
      const backendUrl = `https://downxtown.com/api/v1/products/${productId}/page`;
      console.log('Making direct request to backend:', backendUrl);
      
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Downxtown-Webstore/1.0',
        },
        // No caching for debugging
        cache: 'no-store',
      });
      
      console.log('Backend response status:', response.status);
      console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        
        if (response.status === 404) {
          throw new Error(`Product with ID '${productId}' not found`);
        }
        throw new Error(`Backend error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Product data received successfully:', {
        id: data.id,
        title: data.title,
        storeInfo: data.storeInfo?.storeName,
        hasVariants: data.hasVariants,
        imagesCount: data.defaultImages?.length || 0
      });
      
      setProduct(data);
    } catch (err) {
      console.error('=== FRONTEND ERROR ===');
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentImages = () => {
    if (!product) return [];
    
    // If variant is selected and has specific images
    if (Object.keys(selectedVariant).length > 0) {
      const matchingVariant = product.variants.find(variant => 
        Object.entries(selectedVariant).every(([key, value]) => 
          variant.attributes[key] === value
        )
      );
      
      if (matchingVariant && matchingVariant.images.length > 0 && !matchingVariant.useProductImages) {
        return matchingVariant.images;
      }
    }
    
    // Default to product images
    return product.defaultImages.length > 0 ? product.defaultImages : product.images;
  };

  const getCurrentPrice = () => {
    if (!product) return { selling: 0, mrp: 0 };
    
    if (Object.keys(selectedVariant).length > 0) {
      const matchingVariant = product.variants.find(variant => 
        Object.entries(selectedVariant).every(([key, value]) => 
          variant.attributes[key] === value
        )
      );
      
      if (matchingVariant) {
        return {
          selling: matchingVariant.sellingPrice,
          mrp: matchingVariant.mrp || 0
        };
      }
    }
    
    return {
      selling: product.sellingPrice,
      mrp: product.mrp || 0
    };
  };

  const getCurrentInventory = () => {
    if (!product) return 0;
    
    if (Object.keys(selectedVariant).length > 0) {
      const matchingVariant = product.variants.find(variant => 
        Object.entries(selectedVariant).every(([key, value]) => 
          variant.attributes[key] === value
        )
      );
      
      if (matchingVariant) {
        return matchingVariant.inventory;
      }
    }
    
    return product.totalInventory;
  };

  const handleVariantSelection = (attributeName: string, value: string) => {
    setSelectedVariant(prev => ({
      ...prev,
      [attributeName]: value
    }));
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxQuantity = getCurrentInventory();
    
    if (newQuantity >= 1 && newQuantity <= Math.min(10, maxQuantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product?.hasVariants && Object.keys(selectedVariant).length !== Object.keys(product.variantAttributes).length) {
      showToast('Please select all product options', 'error');
      return;
    }
    
    // Implement add to cart logic
    showToast('Added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (product?.hasVariants && Object.keys(selectedVariant).length !== Object.keys(product.variantAttributes).length) {
      showToast('Please select all product options', 'error');
      return;
    }
    
    // Navigate to checkout or implement buy now logic
    showToast('Proceeding to checkout...');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: `Check out ${product?.title} on our store!`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-ping mx-auto opacity-25"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Product Not Found</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentImages = getCurrentImages();
  const currentPrice = getCurrentPrice();
  const currentInventory = getCurrentInventory();
  const discount = currentPrice.mrp > currentPrice.selling 
    ? Math.round(((currentPrice.mrp - currentPrice.selling) / currentPrice.mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200"
              >
                <Heart className={`w-5 h-5 transition-all duration-200 ${
                  isWishlisted
                    ? 'fill-red-500 text-red-500 scale-110'
                    : 'text-slate-600 hover:text-red-500'
                }`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5 text-slate-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/50">
              {/* Main Image */}
              <div className="aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group">
                <OptimizedImage
                  imageId={currentImages[selectedImageIndex] || ''}
                  alt={product.title}
                  variant="detail"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Image Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                  {currentImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? 'border-blue-500 shadow-lg scale-105'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      <OptimizedImage
                        imageId={image}
                        alt={`${product.title} ${index + 1}`}
                        variant="preview"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title and Brand */}
            <div>
              {product.brandName && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-4">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    {product.brandName}
                  </p>
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              {product.averageRating > 0 && (
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.averageRating)
                              ? 'text-amber-400 fill-current'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-amber-700">{product.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-slate-600">({product.totalReviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-4xl font-bold text-slate-900">
                  ₹{currentPrice.selling.toLocaleString()}
                </span>
                {currentPrice.mrp > currentPrice.selling && (
                  <>
                    <span className="text-xl text-slate-500 line-through">
                      ₹{currentPrice.mrp.toLocaleString()}
                    </span>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 border border-red-200">
                      <span className="text-sm font-semibold text-red-700">
                        {discount}% OFF
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  currentInventory > 10 ? 'bg-emerald-500' :
                  currentInventory > 0 ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-semibold ${
                  currentInventory > 10 ? 'text-emerald-600' :
                  currentInventory > 0 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {currentInventory > 10 ? 'In Stock' :
                   currentInventory > 0 ? `Only ${currentInventory} left!` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Variant Selection */}
            {product.hasVariants && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50 space-y-6">
                <h3 className="text-xl font-semibold text-slate-900">Select Options</h3>

                {Object.entries(product.variantAttributes).map(([attributeName, options]) => (
                  <div key={attributeName}>
                    <label className="block text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
                      {attributeName}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleVariantSelection(attributeName, option)}
                          className={`px-5 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md ${
                            selectedVariant[attributeName] === option
                              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <div className="flex items-center justify-between mb-8">
                <label className="text-xl font-semibold text-slate-900">Quantity</label>
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-slate-100 disabled:opacity-50 transition-colors rounded-l-xl"
                  >
                    <Minus className="w-5 h-5 text-slate-600" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-slate-900 bg-white border-x border-slate-200 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= Math.min(10, currentInventory)}
                    className="p-3 hover:bg-slate-100 disabled:opacity-50 transition-colors rounded-r-xl"
                  >
                    <Plus className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className="h-14 font-semibold bg-slate-100 text-slate-900 border-2 border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-all duration-200 rounded-xl"
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.isAvailable}
                  className="h-14 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl transform hover:scale-105"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200/50">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Delivery & Services</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.estimatedDeliveryDays && (
                  <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Truck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Fast Delivery</p>
                      <p className="text-sm text-emerald-600">
                        {product.estimatedDeliveryDays.minDays}-{product.estimatedDeliveryDays.maxDays} days
                      </p>
                    </div>
                  </div>
                )}

                {product.shippingCost && (
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Shipping</p>
                      <p className="text-sm text-blue-600">
                        {product.shippingCost.local === 0 ? 'Free shipping' : `From ₹${product.shippingCost.local}`}
                      </p>
                    </div>
                  </div>
                )}

                {product.isCodAllowed && (
                  <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Cash on Delivery</p>
                      <p className="text-sm text-amber-600">Available</p>
                    </div>
                  </div>
                )}

                {product.isReturnable && (
                  <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Return Policy</p>
                      <p className="text-sm text-green-600">7-day returns</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description and Features */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Product Description</h3>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">{product.description}</p>

              {product.keyFeatures.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 mb-6">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <div className="p-1 bg-emerald-100 rounded-lg">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        </div>
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications */}
            {Object.keys(product.customAttributes).length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Specifications</h3>
                <div className="space-y-4">
                  {Object.entries(product.customAttributes).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-4 px-6 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-semibold text-slate-700">{key}</span>
                      <span className="text-slate-900 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Store Info */}
          <div>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Store Information</h3>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                  {product.storeInfo.storeLogo ? (
                    <OptimizedImage
                      imageId={product.storeInfo.storeLogo}
                      alt={product.storeInfo.storeName}
                      variant="preview"
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <Store className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{product.storeInfo.storeName}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                      <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
                      <span className="text-sm font-semibold text-amber-700">{product.storeInfo.formattedRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Products</span>
                  <span className="font-bold text-slate-900">{product.storeInfo.productsCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Followers</span>
                  <span className="font-bold text-slate-900">{product.storeInfo.followersCount}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/store/${product.storeInfo.businessId}`)}
                  className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <Store className="w-5 h-5 mr-3" />
                  Visit Store
                </Button>
                <Button
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Chat with Store
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}