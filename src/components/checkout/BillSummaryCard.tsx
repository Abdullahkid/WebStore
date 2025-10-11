import type { OrderTotalCalculation } from '@/types/checkout';

interface BillSummaryCardProps {
  orderTotal: OrderTotalCalculation;
}

export function BillSummaryCard({ orderTotal }: BillSummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#00BCD4]/20 overflow-hidden mb-24">
      <div className="bg-gradient-to-r from-[#00BCD4]/10 to-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#00BCD4]/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Bill Summary</h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-[#00BCD4]/5 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Item Subtotal</span>
              <span className="font-medium text-slate-900">
                {orderTotal.orderSummary.formattedItemTotal}
              </span>
            </div>

            {orderTotal.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="font-medium text-green-600">
                  -{orderTotal.orderSummary.formattedDiscount}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Shipping Fee</span>
              {orderTotal.shippingFee > 0 ? (
                <span className="font-medium text-slate-900">
                  {orderTotal.orderSummary.formattedShippingCost}
                </span>
              ) : (
                <span className="font-bold text-green-600">FREE</span>
              )}
            </div>

            {orderTotal.platformFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Platform Fee</span>
                <span className="font-medium text-slate-900">
                  {orderTotal.orderSummary.formattedPlatformFee}
                </span>
              </div>
            )}

            {orderTotal.codFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">COD Fee</span>
                <span className="font-medium text-slate-900">
                  {orderTotal.orderSummary.formattedCodFee}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#00BCD4]/10 rounded-xl border-2 border-[#00BCD4]/30">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-bold text-[#00BCD4]">
                {orderTotal.orderSummary.formattedTotalAmount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
