'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { initiateCheckout, createOrder, verifyPayment } from '@/lib/api/checkout';
import { calculateOrderTotal } from '@/lib/utils/orderCalculations';
import { auth } from '@/lib/firebase';
import { showToast } from '@/lib/toast';
import type {
  CheckoutData,
  PaymentMethodDto,
  OrderTotalCalculation,
  CreateOrderRequest,
} from '@/types/checkout';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { CheckoutBottomBar } from '@/components/checkout/CheckoutBottomBar';
import { LoadingView } from '@/components/checkout/LoadingView';
import { ErrorView } from '@/components/checkout/ErrorView';
import { ArrowLeft } from 'lucide-react';

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get navigation parameters
  const customerId = searchParams.get('customerId');
  const productId = searchParams.get('productId');
  const variantId = searchParams.get('variantId');
  const quantity = searchParams.get('quantity');

  // State management
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodDto | null>(null);
  const [orderTotal, setOrderTotal] = useState<OrderTotalCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);

  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      // Check for authToken in localStorage
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      if (!authToken) {
        showToast('Please login to continue', 'error');
        // Save the checkout intent
        if (typeof window !== 'undefined' && productId && quantity) {
          sessionStorage.setItem('checkoutIntent', JSON.stringify({
            customerId,
            productId,
            variantId,
            quantity,
          }));
        }
        router.push('/login?redirect=/checkout');
        return;
      }

      // Check account type
      const accountType = typeof window !== 'undefined' ? localStorage.getItem('accountType') : null;
      if (accountType !== 'PERSONAL') {
        showToast('Only personal accounts can make purchases', 'error');
        router.push('/');
        return;
      }

      // Validate parameters
      if (!customerId || !productId || !quantity) {
        setError('Invalid checkout parameters');
        setIsLoading(false);
        return;
      }

      // All checks passed, load checkout data
      loadCheckoutData();
    };

    checkAuth();
  }, [customerId, productId, variantId, quantity, router]);

  const loadCheckoutData = async () => {
    try {
      setIsLoading(true);

      // Double-check authToken exists
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        showToast('Authentication required', 'error');
        router.push('/login?redirect=/checkout');
        return;
      }

      // Wait for Firebase auth to be ready
      let user = auth.currentUser;
      if (!user) {
        // Try to sign in with custom token
        try {
          const { signInWithCustomToken } = await import('firebase/auth');
          const userCredential = await signInWithCustomToken(auth, authToken);
          user = userCredential.user;
        } catch (authError) {
          console.error('Firebase auth error:', authError);
          showToast('Authentication failed. Please login again.', 'error');
          localStorage.removeItem('authToken');
          router.push('/login?redirect=/checkout');
          return;
        }
      }

      const token = await user.getIdToken();

      const data = await initiateCheckout(
        customerId!,
        productId!,
        variantId,
        parseInt(quantity!),
        token
      );

      if (!data.isValid) {
        setError(data.errorMessage || 'Checkout validation failed');
        return;
      }

      setCheckoutData(data);

      // Auto-select default payment method (Online first, then COD)
      const defaultMethod =
        data.paymentOptions.availableMethods.find((m) => !m.isCodPayment) ||
        data.paymentOptions.availableMethods[0];

      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod);
        calculateTotal(data, defaultMethod.isCodPayment);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checkout data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate order total
  const calculateTotal = (data: CheckoutData, isCodPayment: boolean) => {
    const summary = calculateOrderTotal(
      data.pricingValidation.itemTotal,
      data.pricingValidation.discount,
      data.shippingInfo.shippingCost,
      isCodPayment
    );

    setOrderTotal({
      itemSubtotal: summary.itemTotal,
      discount: summary.discount,
      shippingFee: summary.shippingCost,
      codFee: summary.codFee,
      platformFee: summary.platformFee,
      finalTotal: summary.totalAmount,
      savings: summary.discount,
      orderSummary: summary,
    });
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: PaymentMethodDto) => {
    setSelectedPaymentMethod(method);
    if (checkoutData) {
      calculateTotal(checkoutData, method.isCodPayment);
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!checkoutData || !selectedPaymentMethod || !orderTotal || !customerId) {
      setUserMessage('Please complete all required selections');
      return;
    }

    setIsPlacingOrder(true);
    setUserMessage(null);

    try {
      // Get Firebase ID token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Please login to continue');
      }

      const token = await user.getIdToken();

      const request: CreateOrderRequest = {
        customerId,
        orderItems: [
          {
            productId: checkoutData.productInfo.productId,
            productName: checkoutData.productInfo.productTitle,
            quantity: checkoutData.productInfo.selectedQuantity,
            unitPrice: checkoutData.pricingValidation.unitPrice,
            mrp: checkoutData.pricingValidation.mrp,
            businessId: checkoutData.businessInfo.businessId,
            shippingFee: checkoutData.shippingInfo.shippingCost,
            productImageUrl: checkoutData.productInfo.productImage,
            variantId: checkoutData.productInfo.selectedVariantId,
            variantAttributes: checkoutData.productInfo.selectedVariantAttributes,
            sku: checkoutData.productInfo.sku,
            razorpayLinkedAccountId: checkoutData.businessInfo.razorpaySellerId,
            platformFeePercentage: checkoutData.paymentOptions.platformFeePercentage,
          },
        ],
        totalAmount: orderTotal.finalTotal,
        shippingAddress: checkoutData.customerAddress!,
        paymentMethod: selectedPaymentMethod.isCodPayment ? 'COD' : 'ONLINE',
        customerName: user.displayName || 'Customer',
      };

      const response = await createOrder(request, token);

      if (response.paymentMethod === 'COD') {
        // COD order - navigate to confirmation
        showToast('Order placed successfully!', 'success');
        router.push(`/order-confirmation?transactionId=${response.transactionId}`);
      } else {
        // Online payment - launch Razorpay
        launchRazorpay(response, token);
      }
    } catch (err) {
      setUserMessage(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Launch Razorpay payment
  const launchRazorpay = (orderResponse: any, token: string) => {
    if (!window.Razorpay) {
      setUserMessage('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    const options = {
      key: orderResponse.razorpayKeyId,
      amount: Math.round(orderResponse.totalAmount * 100), // Convert to paise
      currency: 'INR',
      name: 'DownXtown',
      description: 'Order Payment',
      order_id: orderResponse.razorpayOrderId,
      handler: async (response: any) => {
        // Payment successful - verify
        try {
          await verifyPayment({
            transactionId: orderResponse.transactionId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          }, token);

          showToast('Payment successful!', 'success');
          // Navigate to confirmation
          router.push(`/order-confirmation?transactionId=${orderResponse.transactionId}`);
        } catch (err) {
          setUserMessage('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        contact: '',
      },
      theme: {
        color: '#00BCD4',
      },
      modal: {
        ondismiss: () => {
          setUserMessage('Payment cancelled. You can retry payment.');
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      setUserMessage(`Payment failed: ${response.error.description}`);
    });

    rzp.open();
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (isLoading) {
    return <LoadingView message="Loading checkout details..." />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={() => loadCheckoutData()}
        onBack={() => router.back()}
      />
    );
  }

  if (!checkoutData) {
    return <ErrorView message="No checkout data available" onBack={() => router.back()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#00BCD4]" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-56">
        <CheckoutContent
          checkoutData={checkoutData}
          selectedPaymentMethod={selectedPaymentMethod}
          orderTotal={orderTotal}
          onPaymentMethodChange={handlePaymentMethodChange}
        />

        {/* User message */}
        {userMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{userMessage}</p>
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <CheckoutBottomBar
        orderTotal={orderTotal}
        selectedPaymentMethod={selectedPaymentMethod}
        isPlacingOrder={isPlacingOrder}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingView message="Loading..." />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
