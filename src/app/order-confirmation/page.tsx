'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const transactionId = searchParams.get('transactionId');

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!transactionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600">Invalid order confirmation</p>
          <Link
            href="/"
            className="mt-4 inline-block px-6 py-3 bg-[#00BCD4] text-white rounded-xl hover:bg-[#00838F]"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[#00BCD4] rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-slate-900">Order Confirmation</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
            <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-green-100">Thank you for your purchase</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="p-4 bg-[#00BCD4]/10 rounded-xl">
              <p className="text-sm text-slate-600 mb-1">Transaction ID</p>
              <p className="text-lg font-mono font-bold text-slate-900">{transactionId}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-green-200 rounded-xl bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Order Status</p>
                    <p className="font-bold text-green-700">Confirmed</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-[#00BCD4]/30 rounded-xl bg-[#00BCD4]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00BCD4]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Estimated Delivery</p>
                    <p className="font-bold text-[#00BCD4]">5-7 days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00BCD4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What's Next?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00BCD4]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#00BCD4]">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Order Confirmation</p>
                    <p className="text-sm text-slate-600">You'll receive an email confirmation shortly</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00BCD4]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#00BCD4]">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Order Processing</p>
                    <p className="text-sm text-slate-600">The seller will prepare your order for shipment</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00BCD4]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#00BCD4]">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Shipment & Delivery</p>
                    <p className="text-sm text-slate-600">Track your order and receive it at your doorstep</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 bg-[#00BCD4] text-white font-semibold rounded-xl hover:bg-[#00838F] transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
