# Image Loading Fix - Checkout Page

## Problem

Images were not loading in the checkout page's ProductSummaryCard component.

## Root Cause

The component was using Next.js `Image` component with the `imageId` directly as the `src`:

```tsx
<Image
  src={productInfo.productImage || '/placeholder.png'}  // ❌ Wrong!
  alt={productInfo.productTitle}
  fill
  className="object-cover"
/>
```

The `productInfo.productImage` is an **imageId** (MongoDB ObjectId like `"507f1f77bcf86cd799439011"`), not a full URL. This doesn't work because:
- Next.js Image expects a full URL or path
- The imageId needs to be converted to a backend URL

## Solution

Use the `OptimizedImage` component which properly constructs the backend URL:

```tsx
<OptimizedImage
  imageId={productInfo.productImage}  // ✅ Correct!
  alt={productInfo.productTitle}
  variant="detail"
  fill
  className="object-cover"
/>
```

## How It Works

### Android App (Reference)
```kotlin
// In CheckoutScreen.kt
SmartImage(
    imageId = productInfo.productImage,  // Just the imageId
    contentDescription = productInfo.productTitle,
    useCase = ImageUseCase.PRODUCT_DETAIL  // Determines which endpoint to use
)
```

The `SmartImage` component in Android:
1. Takes the `imageId`
2. Uses `AdvancedImageLoader.createOptimalImageRequest()`
3. Constructs URL like: `https://downxtown.com/get-detail-image/{imageId}`

### Web App (Our Implementation)
```tsx
// In ProductSummaryCard.tsx
<OptimizedImage
  imageId={productInfo.productImage}  // Just the imageId
  variant="detail"  // Determines which endpoint to use
  fill
/>
```

The `OptimizedImage` component:
1. Takes the `imageId`
2. Uses `apiClient.getImageUrl(imageId, variant)`
3. Constructs URL like: `https://downxtown.com/get-detail-image/{imageId}`

## Backend Image Endpoints

The backend (sigma-ktor) provides these image endpoints:

```
GET /get-original-image/{imageId}    - Full quality
GET /get-detail-image/{imageId}      - 800x800, 85% quality
GET /get-fullscreen-image/{imageId}  - 1200x1200, 90% quality
GET /get-preview-image/{imageId}     - 400x400, 75% quality
GET /get-banner-image/{imageId}      - 1200x400, 85% quality
GET /get-display-image/{imageId}     - 400x400, 75% quality
GET /image/{imageId}                 - Flexible with query params
```

## Image Variants Mapping

| Android UseCase | Web Variant | Backend Endpoint | Use Case |
|----------------|-------------|------------------|----------|
| THUMBNAIL | preview | /get-preview-image | Small thumbnails, lists |
| PRODUCT_DETAIL | detail | /get-detail-image | Product pages, checkout |
| FULLSCREEN_VIEW | fullscreen | /get-fullscreen-image | Lightbox, zoom |
| BANNER | banner | /get-banner-image | Store banners |
| PROFILE | display | /get-display-image | User avatars |
| GENERAL | auto | Smart selection | Auto-select based on size |

## Files Changed

### Modified:
- `src/components/checkout/ProductSummaryCard.tsx`
  - Changed from `Image` to `OptimizedImage`
  - Added `variant="detail"` for proper image quality

## Testing

To verify the fix:

1. **Check Network Tab**:
   - Open DevTools → Network
   - Go to checkout page
   - Look for image requests
   - Should see: `https://downxtown.com/get-detail-image/{imageId}`
   - Should NOT see: `/{imageId}` or broken image requests

2. **Visual Check**:
   - Product image should load in checkout
   - Image should be clear and properly sized
   - No broken image icon

3. **Console Check**:
   - No 404 errors for images
   - No "Failed to load image" errors

## Key Takeaways

1. **Never use imageId directly as src**: Always use `OptimizedImage` component
2. **Match Android patterns**: Web implementation mirrors Android's `SmartImage`
3. **Use proper variants**: Choose the right variant for the use case
4. **Backend integration**: All images go through backend endpoints, not direct URLs

## Related Components

Other components that correctly use `OptimizedImage`:
- `ProductDetailPage.tsx` - Product images
- `StoreCard.tsx` - Store logos/banners
- `ProductCard.tsx` - Product thumbnails

All these components use the same pattern:
```tsx
<OptimizedImage imageId={imageId} variant="..." />
```

## Future Considerations

If adding new image displays:
1. Always use `OptimizedImage` component
2. Choose appropriate variant based on size/use case
3. Test with real imageIds from backend
4. Check network requests to verify correct URL construction
