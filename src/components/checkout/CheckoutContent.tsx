import type { CheckoutData, PaymentMethodDto, OrderTotalCalculation } from '@/types/checkout';
import { ProductSummaryCard } from './ProductSummaryCard';
import { DeliveryAddressCard } from './DeliveryAddressCard';
import { ProductPoliciesCard } from './ProductPoliciesCard';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { BillSummaryCard } from './BillSummaryCard';

interface CheckoutContentProps {
  checkoutData: CheckoutData;
  selectedPaymentMethod: PaymentMethodDto | null;
  orderTotal: OrderTotalCalculation | null;
  onPaymentMethodChange: (method: PaymentMethodDto) => void;
}

export function CheckoutContent({
  checkoutData,
  selectedPaymentMethod,
  orderTotal,
  onPaymentMethodChange,
}: CheckoutContentProps) {
  return (
    <div className="space-y-5">
      {/* Product Summary */}
      <ProductSummaryCard
        productInfo={checkoutData.productInfo}
        pricingValidation={checkoutData.pricingValidation}
      />

      {/* Delivery Address */}
      <DeliveryAddressCard
        customerAddress={checkoutData.customerAddress!}
        storeName={checkoutData.businessInfo.storeName}
        shippingInfo={checkoutData.shippingInfo}
      />

      {/* Product Policies */}
      <ProductPoliciesCard
        isCodAllowed={checkoutData.productInfo.isCodAllowed}
        isReturnable={checkoutData.productInfo.isReturnable}
        returnPolicyDays={checkoutData.productInfo.returnPolicyDays}
      />

      {/* Payment Methods */}
      <PaymentMethodSelector
        availableMethods={checkoutData.paymentOptions.availableMethods}
        selectedMethod={selectedPaymentMethod}
        onMethodChange={onPaymentMethodChange}
      />

      {/* Bill Summary */}
      {orderTotal && <BillSummaryCard orderTotal={orderTotal} />}
    </div>
  );
}
