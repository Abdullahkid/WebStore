// Order calculation utilities (client-side)
import type { CheckoutOrderSummary } from '@/types/checkout';

/**
 * Calculate order total with all fees
 * Matches the Android app's OrderCalculationUtils
 */
export function calculateOrderTotal(
  itemSubtotal: number,
  discount: number,
  shippingCost: number,
  isCodPayment: boolean
): CheckoutOrderSummary {
  const codFee = isCodPayment ? 40.0 : 0.0;
  const platformFee = itemSubtotal * 0.05; // 5% platform fee
  const totalAmount = itemSubtotal - discount + shippingCost + codFee + platformFee;

  return {
    itemTotal: itemSubtotal,
    discount,
    shippingCost,
    codFee,
    platformFee,
    totalAmount,
    formattedItemTotal: `₹${itemSubtotal.toFixed(0)}`,
    formattedDiscount: `₹${discount.toFixed(0)}`,
    formattedShippingCost: shippingCost > 0 ? `₹${shippingCost.toFixed(0)}` : 'FREE',
    formattedCodFee: `₹${codFee.toFixed(0)}`,
    formattedPlatformFee: `₹${platformFee.toFixed(0)}`,
    formattedTotalAmount: `₹${totalAmount.toFixed(0)}`,
  };
}

/**
 * Format address for display
 */
export function formatAddress(address: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}): string {
  const parts = [address.addressLine1];
  
  if (address.addressLine2) {
    parts.push(address.addressLine2);
  }
  
  if (address.city) {
    parts.push(address.city);
  }
  
  if (address.state) {
    parts.push(address.state);
  }
  
  if (address.pincode) {
    parts.push(`- ${address.pincode}`);
  }
  
  return parts.join(', ');
}
