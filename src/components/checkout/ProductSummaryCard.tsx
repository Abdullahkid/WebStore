import OptimizedImage from '@/components/shared/OptimizedImage';
import type { ProductCheckoutInfo, PricingValidation } from '@/types/checkout';

interface ProductSummaryCardProps {
  productInfo: ProductCheckoutInfo;
  pricingValidation: PricingValidation;
}

export function ProductSummaryCard({ productInfo, pricingValidation }: ProductSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#00BCD4]/20 overflow-hidden">
      <div className="bg-gradient-to-r from-[#00BCD4]/10 to-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#00BCD4]/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
        </div>

        <div className="flex gap-4">
          <div className="relative w-24 h-24 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden">
            <OptimizedImage
              imageId={productInfo.productImage}
              alt={productInfo.productTitle}
              variant="detail"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
              {productInfo.productTitle}
            </h3>

            {Object.keys(productInfo.selectedVariantAttributes).length > 0 && (
              <div className="mb-2">
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-[#00BCD4]/10 rounded-lg">
                  <span className="text-xs font-medium text-[#00BCD4]">
                    {Object.entries(productInfo.selectedVariantAttributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#00BCD4]">
                  {pricingValidation.formattedUnitPrice}
                </span>
                {pricingValidation.mrp && pricingValidation.mrp > pricingValidation.unitPrice && (
                  <>
                    <span className="text-sm text-slate-500 line-through">
                      {pricingValidation.formattedMrp}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                      {pricingValidation.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="px-3 py-1 bg-[#00BCD4]/10 rounded-xl">
                <span className="text-sm font-medium text-[#00BCD4]">
                  Qty: {productInfo.selectedQuantity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
