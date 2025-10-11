import type { Address, ShippingInfo } from '@/types/checkout';
import { formatAddress } from '@/lib/utils/orderCalculations';

interface DeliveryAddressCardProps {
  customerAddress: Address;
  storeName: string;
  shippingInfo: ShippingInfo;
}

export function DeliveryAddressCard({
  customerAddress,
  storeName,
  shippingInfo,
}: DeliveryAddressCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#00BCD4]/20 overflow-hidden">
      <div className="bg-gradient-to-r from-[#00BCD4]/10 to-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00BCD4]/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Delivery Address</h2>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-[#00BCD4]/5 rounded-xl">
            <p className="text-slate-900 font-medium leading-relaxed">
              {formatAddress(customerAddress)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span className="text-slate-600 font-medium">From: {storeName}</span>
          </div>

          {shippingInfo.estimatedDeliveryDays && (
            <div className="p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-green-700">
                  Delivery in {shippingInfo.estimatedDeliveryDays.minDays}-
                  {shippingInfo.estimatedDeliveryDays.maxDays} days
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
