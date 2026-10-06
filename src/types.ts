export type ProductCondition = 'Original Antique' | 'Antique-Inspired' | 'Handmade' | 'Vintage' | 'Limited Edition' | 'Modern Reproduction';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  subcategory?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stock: number;
  condition: ProductCondition;
  material: string;
  dimensions: string;
  weight: string;
  color: string;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  isAntique?: boolean;
  isHandmade?: boolean;
  isOneOfAKind?: boolean;
  isSold?: boolean;
  certificateNumber?: string;
  provenance?: string;
  story: string;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  careInstructions?: string;
  estimatedDelivery?: string;
  productionTime?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethodType = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'card' | 'stripe';
export type PaymentStatusType = 'Pending' | 'Processing' | 'Paid' | 'Failed' | 'Refunded' | 'Partially Refunded';
export type OrderStatusType = 'Order Placed' | 'Payment Verification' | 'Order Processing' | 'Product Packed' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  image: string;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  shipping: number;
  shippingMethod: 'standard' | 'express' | 'pickup';
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatusType;
  orderStatus: OrderStatusType;
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface CustomOrderRequest {
  id: string;
  ticketNumber: string;
  customerName: string;
  phone: string;
  email: string;
  productType: string;
  description: string;
  preferredSize: string;
  preferredColors: string;
  material: string;
  budget: string;
  requiredDate: string;
  referenceImage?: string;
  status: 'Pending Review' | 'Quotation Sent' | 'Approved & In Production' | 'Completed' | 'Declined';
  quotationAmount?: number;
  depositRequired?: number;
  adminNotes?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  isActive: boolean;
  expiresAt: string;
  usageCount: number;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface ExpenseRecord {
  id: string;
  category: 'Raw Materials' | 'Artisan Commission' | 'Packaging & Shipping' | 'Studio Utilities' | 'Marketing' | 'Gateway Fees';
  amount: number;
  description: string;
  date: string;
}

export interface StoreSettings {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  currency: 'PKR' | 'USD' | 'GBP' | 'AED' | 'EUR';
  exchangeRates: Record<string, number>;
  invoicePrefix: string;
  nextInvoiceSequence: number;
}
