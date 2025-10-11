// Type definitions for checkout flow
// Based on Sigma2 Android app structure

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER';
}

export interface ProductCheckoutInfo {
  productId: string;
  productTitle: string;
  productBrand?: string;
  productImage: string;
  selectedVariantId?: string;
  selectedVariantAttributes: Record<string, string>;
  selectedQuantity: number;
  sku?: string;
  isCodAllowed: boolean;
  isReturnable: boolean;
  returnPolicyDays: number;
}

export interface BusinessCheckoutInfo {
  businessId: string;
  businessName: string;
  storeName: string;
  storeUsername: string;
  razorpaySellerId: string;
}

export interface DeliveryRange {
  minDays: number;
  maxDays: number;
}

export interface ShippingInfo {
  shippingCost: number;
  estimatedDeliveryDays?: DeliveryRange;
  handlingTimeDays?: number;
  formattedShippingCost: string;
}

export interface PaymentMethodDto {
  id: string;
  name: string;
  description: string;
  extraFee: number;
  isEnabled: boolean;
  icon: string;
  isCodPayment: boolean;
}

export interface PaymentOptions {
  isCodAllowed: boolean;
  codFee: number;
  platformFeePercentage: number;
  availableMethods: PaymentMethodDto[];
}

export interface InventoryValidation {
  isValid: boolean;
  availableQuantity: number;
  requestedQuantity: number;
  errorMessage?: string;
}

export interface PricingValidation {
  unitPrice: number;
  mrp?: number;
  quantity: number;
  itemTotal: number;
  discount: number;
  discountPercentage: number;
  formattedUnitPrice: string;
  formattedMrp?: string;
  formattedItemTotal: string;
  formattedDiscount: string;
}

export interface CheckoutData {
  isValid: boolean;
  errorMessage?: string;
  productInfo: ProductCheckoutInfo;
  customerAddress?: Address;
  businessInfo: BusinessCheckoutInfo;
  shippingInfo: ShippingInfo;
  inventoryValidation: InventoryValidation;
  pricingValidation: PricingValidation;
  paymentOptions: PaymentOptions;
}

export interface CheckoutOrderSummary {
  itemTotal: number;
  discount: number;
  shippingCost: number;
  codFee: number;
  platformFee: number;
  totalAmount: number;
  formattedItemTotal: string;
  formattedDiscount: string;
  formattedShippingCost: string;
  formattedCodFee: string;
  formattedPlatformFee: string;
  formattedTotalAmount: string;
}

export interface OrderTotalCalculation {
  itemSubtotal: number;
  discount: number;
  shippingFee: number;
  codFee: number;
  platformFee: number;
  finalTotal: number;
  savings: number;
  orderSummary: CheckoutOrderSummary;
}

export type PaymentMethod = 'COD' | 'ONLINE';

export interface CreateOrderItemRequest {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  mrp?: number;
  businessId: string;
  shippingFee: number;
  productImageUrl: string;
  variantId?: string;
  variantAttributes: Record<string, string>;
  sku?: string;
  razorpayLinkedAccountId: string;
  platformFeePercentage: number;
}

export interface CreateOrderRequest {
  customerId: string;
  orderItems: CreateOrderItemRequest[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  customerName: string;
}

export interface CreatedOrderItem {
  itemId: string;
  productId: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  status: string;
}

export interface CreateOrderResponse {
  transactionId: string;
  orderItems: CreatedOrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
  estimatedDeliveryDate?: number;
}

export interface PaymentVerificationRequest {
  transactionId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  transactionId: string;
}

// Razorpay types for web
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
    };
  }
}
