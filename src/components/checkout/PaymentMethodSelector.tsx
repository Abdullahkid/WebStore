import type { PaymentMethodDto } from '@/types/checkout';

interface PaymentMethodSelectorProps {
  availableMethods: PaymentMethodDto[];
  selectedMethod: PaymentMethodDto | null;
  onMethodChange: (method: PaymentMethodDto) => void;
}

export function PaymentMethodSelector({
  availableMethods,
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#00BCD4]/20 overflow-hidden">
      <div className="bg-gradient-to-r from-[#00BCD4]/10 to-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[#00BCD4]/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
        </div>

        <div className="space-y-3">
          {availableMethods.map((method) => {
            const isSelected = selectedMethod?.id === method.id;
            return (
              <button
                key={method.id}
                onClick={() => onMethodChange(method)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-[#00BCD4] bg-[#00BCD4]/5'
                    : 'border-slate-200 bg-white hover:border-[#00BCD4]/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#00BCD4]' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <div className="w-3 h-3 bg-[#00BCD4] rounded-full" />}
                  </div>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      method.isCodPayment ? 'bg-orange-100' : 'bg-[#00BCD4]/10'
                    }`}
                  >
                    {method.isCodPayment ? (
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-900">{method.name}</p>
                    <p className="text-sm text-slate-600">{method.description}</p>
                  </div>

                  {isSelected && (
                    <div className="w-7 h-7 bg-[#00BCD4] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
