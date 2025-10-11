import type { OrderTotalCalculation, PaymentMethodDto } from '@/types/checkout';

interface CheckoutBottomBarProps {
  orderTotal: OrderTotalCalculation | null;
  selectedPaymentMethod: PaymentMethodDto | null;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
}

export function CheckoutBottomBar({
  orderTotal,
  selectedPaymentMethod,
  isPlacingOrder,
  onPlaceOrder,
}: CheckoutBottomBarProps) {
  const isDisabled = !orderTotal || !selectedPaymentMethod || isPlacingOrder;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {orderTotal && (
          <div className="mb-3 p-4 bg-[#00BCD4]/10 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-[#00BCD4]">
                  {orderTotal.orderSummary.formattedTotalAmount}
                </p>
              </div>

              {selectedPaymentMethod && (
                <div className="px-3 py-1.5 bg-white rounded-lg border border-[#00BCD4]/30">
                  <div className="flex items-center gap-1.5">
                    {selectedPaymentMethod.isCodPayment ? (
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                    <span className="text-xs font-bold text-slate-700">
                      {selectedPaymentMethod.isCodPayment ? 'COD' : 'Online'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onPlaceOrder}
          disabled={isDisabled}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
            isDisabled
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-[#00BCD4] hover:bg-[#00838F] active:scale-[0.98]'
          }`}
        >
          {isPlacingOrder ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Placing Order...</span>
            </div>
          ) : selectedPaymentMethod?.isCodPayment ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Place Order (Pay on Delivery)</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Proceed to Payment</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
