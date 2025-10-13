// API functions for checkout flow
import type {
  CheckoutData,
  CreateOrderRequest,
  CreateOrderResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
  Address,
} from '@/types/checkout';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://downxtown.com';

/**
 * Initiate checkout and get all necessary data
 */
export async function initiateCheckout(
  customerId: string,
  productId: string,
  variantId: string | null,
  quantity: number,
  token: string
): Promise<CheckoutData> {
  console.log(token);
  const response = await fetch(`${API_BASE_URL}/api/v1/checkout/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId,
      productId,
      variantId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to initiate checkout' }));
    throw new Error(error.message || 'Failed to initiate checkout');
  }

  return response.json();
}

/**
 * Create order (for both COD and Online payment)
 */
export async function createOrder(request: CreateOrderRequest, token: string): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to create order' }));
    throw new Error(error.message || 'Failed to create order');
  }

  return response.json();
}

/**
 * Verify payment after Razorpay success
 */
export async function verifyPayment(
  request: PaymentVerificationRequest,
  token: string
): Promise<PaymentVerificationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/orders/${request.transactionId}/verify-payment`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Payment verification failed' }));
    throw new Error(error.message || 'Payment verification failed');
  }

  return response.json();
}

/**
 * Update customer address during checkout
 */
export async function updateCustomerAddress(
  customerId: string,
  newAddress: Address,
  token: string
): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/v1/checkout/address`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      customerId,
      newAddress,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to update address' }));
    throw new Error(error.message || 'Failed to update address');
  }

  return true;
}
