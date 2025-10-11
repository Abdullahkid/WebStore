interface ProductPoliciesCardProps {
  isCodAllowed: boolean;
  isReturnable: boolean;
  returnPolicyDays: number;
}

export function ProductPoliciesCard({
  isCodAllowed,
  isReturnable,
  returnPolicyDays,
}: ProductPoliciesCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#00BCD4]/20 overflow-hidden">
      <div className="bg-gradient-to-r from-[#00BCD4]/10 to-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#00BCD4]/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Product Policies</h2>
        </div>

        <div className="space-y-3">
          <div
            className={`p-4 rounded-xl border ${
              isCodAllowed
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCodAllowed ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {isCodAllowed ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`font-semibold ${isCodAllowed ? 'text-green-700' : 'text-red-700'}`}>
                  Cash on Delivery
                </p>
                <p className={`text-sm ${isCodAllowed ? 'text-green-600' : 'text-red-600'}`}>
                  {isCodAllowed ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isReturnable
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isReturnable ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {isReturnable ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <p className={`font-semibold ${isReturnable ? 'text-green-700' : 'text-red-700'}`}>
                  Return Policy
                </p>
                <p className={`text-sm ${isReturnable ? 'text-green-600' : 'text-red-600'}`}>
                  {isReturnable ? `${returnPolicyDays} Days Return` : 'No Returns'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
