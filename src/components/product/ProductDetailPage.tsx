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
  ChevronRight,
  Check,
  Clock,
  MapPin
} from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';
import ImageLightbox from '@/components/shared/ImageLightbox';
import {
  ProductPageDetailsDto,
  ProductVariantPageDto,
  StoreProfileMiniDto,
  ImageGroup,
  ImageGroupType
} from '@/lib/types';
import { showToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch product details
  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  // Reset selected image index if it's out of bounds when images change
  useEffect(() => {
    const images = getCurrentImages();
    if (selectedImageIndex >= images.length) {
      setSelectedImageIndex(0);
    }
  }, [selectedVariant, product]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('=== FRONTEND DEBUG ===');
      console.log('Fetching product details for ID:', productId);

      // Direct backend call - same as Android implementation
      const backendUrl = `${API_BASE_URL}/api/v1/products/${productId}/page`;
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

    // ImageGroup-aware image resolution logic
    // Priority: Variant-specific ImageGroup > Variant legacy images > Product ImageGroups > Product legacy images

    // If variant is selected, try to get images from ImageGroup or fallback to legacy
    if (Object.keys(selectedVariant).length > 0) {
      const matchingVariant = product.variants.find(variant =>
        Object.entries(selectedVariant).every(([key, value]) =>
          variant.attributes[key] === value
        )
      );

      if (matchingVariant) {
        console.log('🎨 Variant selected:', selectedVariant, 'Matching variant:', matchingVariant.variantId);

        // Try ImageGroup first (new system)
        if (matchingVariant.imageGroupId) {
          const imageGroup = product.imageGroups?.find(group => group.id === matchingVariant.imageGroupId);
          if (imageGroup && imageGroup.images.length > 0) {
            console.log('✅ Using variant ImageGroup images:', imageGroup.images.length);
            return imageGroup.images;
          }
        }

        // Fallback to legacy variant images
        if (matchingVariant.images && matchingVariant.images.length > 0 && !matchingVariant.useProductImages) {
          console.log('✅ Using variant legacy images:', matchingVariant.images.length);
          return matchingVariant.images;
        }
      }
    }

    // Product-level image resolution with ImageGroup support
    // Try PRODUCT_WIDE ImageGroups first
    if (product.imageGroups && product.imageGroups.length > 0) {
      const productWideGroup = product.imageGroups.find(group =>
        group.groupType === ImageGroupType.PRODUCT_WIDE
      );
      if (productWideGroup && productWideGroup.images.length > 0) {
        console.log('✅ Using PRODUCT_WIDE ImageGroup images:', productWideGroup.images.length);
        return productWideGroup.images;
      }

      // Fallback to any available ImageGroup
      const firstGroupWithImages = product.imageGroups.find(group => group.images.length > 0);
      if (firstGroupWithImages) {
        console.log('✅ Using first ImageGroup images:', firstGroupWithImages.images.length);
        return firstGroupWithImages.images;
      }
    }

    // Final fallback to legacy product images
    const fallbackImages = product.defaultImages && product.defaultImages.length > 0 ? product.defaultImages : product.images;
    console.log('✅ Using fallback product images:', fallbackImages?.length || 0);
    return fallbackImages || [];
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
    // Reset to first image when variant changes
    setSelectedImageIndex(0);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    const maxQuantity = getCurrentInventory();

    if (newQuantity >= 1 && newQuantity <= Math.min(10, maxQuantity)) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = async () => {
    // Validate variant selection
    if (product?.hasVariants && Object.keys(selectedVariant).length !== Object.keys(product.variantAttributes).length) {
      showToast('Please select all product options', 'error');
      return;
    }

    // Check if user is authenticated by checking authToken in localStorage
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (!authToken) {
      // User is not logged in - save buy now intent and redirect to login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('buyNowIntent', JSON.stringify({
          productId: product?.id,
          variantId: Object.keys(selectedVariant).length > 0 ? getSelectedVariantId() : null,
          quantity: quantity,
        }));
      }

      showToast('Please login to continue', 'info');
      router.push('/login');
      return;
    }

    // User is logged in - check account type
    const accountType = typeof window !== 'undefined' ? localStorage.getItem('accountType') : null;
    
    if (accountType !== 'PERSONAL') {
      showToast('Only personal accounts can purchase products', 'error');
      return;
    }

    // Check if user has address
    try {
      const hasAddress = await checkUserHasAddress();

      if (!hasAddress) {
        // Save checkout intent and redirect to address page
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('checkoutIntent', JSON.stringify({
            productId: product?.id,
            variantId: Object.keys(selectedVariant).length > 0 ? getSelectedVariantId() : null,
            quantity: quantity,
          }));
        }

        showToast('Please add your delivery address', 'info');
        router.push('/address');
        return;
      }

      // User has address - go directly to checkout
      const userId = localStorage.getItem('userId');
      const checkoutParams = new URLSearchParams({
        customerId: userId || '',
        productId: product?.id || '',
        quantity: quantity.toString(),
        ...(Object.keys(selectedVariant).length > 0 && { variantId: getSelectedVariantId() || '' }),
      });

      router.push(`/checkout?${checkoutParams.toString()}`);
    } catch (error) {
      console.error('Error in buy now flow:', error);
      showToast('An error occurred. Please try again.', 'error');
    }
  };

  const getSelectedVariantId = (): string | null => {
    if (!product || Object.keys(selectedVariant).length === 0) return null;

    const matchingVariant = product.variants.find(variant =>
      Object.entries(selectedVariant).every(([key, value]) =>
        variant.attributes[key] === value
      )
    );

    return matchingVariant?.variantId || null;
  };

  const checkUserHasAddress = async (): Promise<boolean> => {
    try {
      if (!auth?.currentUser) return false;

      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`${API_BASE_URL}/user/address`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return !!data && !!data.addressLine1;
      }

      return false;
    } catch (error) {
      console.error('Error checking address:', error);
      return false;
    }
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

  // Memoize current values to ensure they update when dependencies change
  const currentImages = getCurrentImages();
  const currentPrice = getCurrentPrice();
  const currentInventory = getCurrentInventory();
  const discount = currentPrice.mrp > currentPrice.selling
    ? Math.round(((currentPrice.mrp - currentPrice.selling) / currentPrice.mrp) * 100)
    : 0;

  // Ensure selected image index is valid for current images
  const safeImageIndex = selectedImageIndex < currentImages.length ? selectedImageIndex : 0;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      <div className="desktop-container-wide py-6 lg:py-10">
        {/* Desktop 3-Column Layout: Image Gallery | Product Info | Store Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Product Images - 5 columns on desktop */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="lg:bg-white lg:rounded-3xl lg:p-6 lg:shadow-xl lg:border lg:border-slate-200/50 lg:sticky lg:top-24">
              {/* Main Image */}
              <div
                className="aspect-square mb-4 lg:mb-6 rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 cursor-pointer image-zoom-container"
                onClick={() => openLightbox(safeImageIndex)}
              >
                <OptimizedImage
                  key={`main-${currentImages[safeImageIndex]}-${safeImageIndex}`}
                  imageId={currentImages[safeImageIndex] || ''}
                  alt={product.title}
                  variant="detail"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {currentImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide desktop-scrollbar">
                  {currentImages.map((image, index) => (
                    <button
                      key={`thumb-${image}-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-3 transition-all duration-200 ${safeImageIndex === index
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

          {/* Product Info - 5 columns on desktop */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6 lg:space-y-8">
            {/* Title and Brand */}
            <div>
              {product.brandName && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-200 mb-4">
                  <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                    {product.brandName}
                  </p>
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 leading-tight">
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
                          className={`w-4 h-4 ${i < Math.floor(product.averageRating)
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
                <div className={`w-3 h-3 rounded-full animate-pulse ${currentInventory > 10 ? 'bg-emerald-500' :
                    currentInventory > 0 ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                <span className={`text-sm font-semibold ${currentInventory > 10 ? 'text-emerald-600' :
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
                          className={`px-5 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md ${selectedVariant[attributeName] === option
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

              {/* Buy Now and WhatsApp Actions */}
              <div className="w-full flex gap-3">
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.isAvailable}
                  className="flex-1 h-14 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl transform hover:scale-105"
                >
                  Buy Now
                </Button>
                <Button
                  onClick={() => {
                    const message = `Hi, I'm interested in ${product.title}`;
                    const whatsappUrl = `https://wa.me/${product.storeInfo.businessId}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="flex-1 h-14 font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Chat</span>
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

          {/* Store Info Sidebar - 2 columns on desktop, hidden on mobile */}
          <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
            <div className="desktop-sticky bg-white rounded-3xl p-8 shadow-xl border border-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Store Information</h3>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                  {product.storeInfo.storeLogo ? (
                    <OptimizedImage
                      imageId={product.storeInfo.storeLogo}
                      alt={product.storeInfo.storeName}
                      variant="preview"
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                  ) : (
                    <Store className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-bold text-slate-900 mb-1 truncate">{product.storeInfo.storeName}</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      <Star className="w-5 h-5 text-amber-400 fill-current mr-1.5" />
                      <span className="text-base font-semibold text-amber-700">{product.storeInfo.formattedRating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700 text-lg">Products</span>
                  <span className="font-bold text-slate-900 text-lg">{product.storeInfo.productsCount}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700 text-lg">Followers</span>
                  <span className="font-bold text-slate-900 text-lg">{product.storeInfo.followersCount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => router.push(`/store/${product.storeInfo.businessId}`)}
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg rounded-xl transition-all duration-200 hover:shadow-xl hover-lift-desktop"
                >
                  <Store className="w-6 h-6 mr-3" />
                  Visit Store
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details - Full width below fold */}
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

          {/* Store Info - Mobile Only (shows below on small screens) */}
          <div className="lg:hidden">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Store Information</h3>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0">
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
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-slate-900 truncate">{product.storeInfo.storeName}</h4>
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

      {/* Image Lightbox */}
      <ImageLightbox
        images={currentImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        productTitle={product.title}
      />
    </div>
  );
}