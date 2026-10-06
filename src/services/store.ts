import { Product, Order, CustomOrderRequest, Coupon, Review, StoreSettings, ExpenseRecord, CartItem, OrderStatusType, PaymentStatusType } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_REVIEWS, INITIAL_SETTINGS, INITIAL_EXPENSES } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'he_products_v1',
  ORDERS: 'he_orders_v1',
  CUSTOM_ORDERS: 'he_custom_orders_v1',
  COUPONS: 'he_coupons_v1',
  REVIEWS: 'he_reviews_v1',
  EXPENSES: 'he_expenses_v1',
  SETTINGS: 'he_settings_v1',
  WISHLIST: 'he_wishlist_v1',
  CART: 'he_cart_v1',
  ACTIVE_USER: 'he_active_user_v1'
};

// Initial dummy orders for rich analytics preview
const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: "ORD-2026-0891",
    invoiceNumber: "INV-2026-10039",
    customerInfo: {
      fullName: "Maryam Nawaz",
      email: "maryam.n@example.com",
      phone: "+92 300 1234567",
      address: "House 24, Block G, Gulberg III",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      country: "Pakistan"
    },
    items: [
      {
        productId: "prod-001",
        productName: "Golden Botanical Resin Art Decorative Plate",
        sku: "HE-RES-0101",
        unitPrice: 14200,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80",
        total: 14200
      }
    ],
    subtotal: 14200,
    discount: 1420,
    couponCode: "HERITAGE10",
    tax: 639,
    shipping: 450,
    shippingMethod: "standard",
    total: 13869,
    paymentMethod: "card",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    trackingNumber: "TCS-992817203",
    courier: "TCS Express",
    createdAt: "2026-03-09T11:20:00Z",
    estimatedDelivery: "2026-03-12"
  },
  {
    id: "ord-102",
    orderNumber: "ORD-2026-0892",
    invoiceNumber: "INV-2026-10040",
    customerInfo: {
      fullName: "Bilal Tariq",
      email: "bilal.t@example.com",
      phone: "+92 321 9876543",
      address: "Street 8, F-7/2",
      city: "Islamabad",
      province: "Federal Capital",
      postalCode: "44000",
      country: "Pakistan"
    },
    items: [
      {
        productId: "prod-003",
        productName: "Pressed Botanical Flora Decorative Tray with Brass Handles",
        sku: "HE-TRY-0402",
        unitPrice: 16500,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
        total: 16500
      }
    ],
    subtotal: 16500,
    discount: 0,
    tax: 825,
    shipping: 0,
    shippingMethod: "standard",
    total: 17325,
    paymentMethod: "cod",
    paymentStatus: "Pending",
    orderStatus: "Shipped",
    trackingNumber: "LCS-88129301",
    courier: "Leopards Courier",
    createdAt: "2026-03-12T14:40:00Z",
    estimatedDelivery: "2026-03-15"
  }
];

const INITIAL_CUSTOM_ORDERS: CustomOrderRequest[] = [
  {
    id: "cus-1",
    ticketNumber: "CUS-2026-501",
    customerName: "Zahra & Daniyal",
    phone: "+92 333 4455667",
    email: "zahra.wedding@example.com",
    productType: "Resin Art Plate / Wedding Memory Plaque",
    description: "Preserve our wedding varmala garlands (ivory roses, baby's breath) into a 16 inch round resin platter with custom Arabic calligraphy in the center (Surah Ar-Rum 30:21) and gold leaf flakes on the scalloped edges.",
    preferredSize: '16" Diameter Platter',
    preferredColors: "Ivory, Dusty Rose, 24K Gold Leaf",
    material: "High Clarity UV Bio-Resin & Real Dried Wedding Flowers",
    budget: "PKR 35,000 - 45,000",
    requiredDate: "2026-04-10",
    status: "Quotation Sent",
    quotationAmount: 38000,
    depositRequired: 19000,
    adminNotes: "Client sent photo of dried roses. In good condition for casting. 50% deposit required before pouring.",
    createdAt: "2026-03-10T15:00:00Z"
  }
];

// Helper to safely access localStorage
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('he_store_updated', { detail: { key } }));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export const StoreService = {
  // PRODUCTS
  getProducts(): Product[] {
    return getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id || p.slug === id);
  },

  saveProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  deleteProduct(id: string): void {
    const products = this.getProducts().filter(p => p.id !== id);
    setStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  // ORDERS
  getOrders(): Order[] {
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'invoiceNumber' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const settings = this.getSettings();
    const nextSeq = (settings.nextInvoiceSequence || 10042) + 1;
    const invNum = `${settings.invoicePrefix || 'INV-2026-'}${nextSeq}`;
    const ordNum = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: ordNum,
      invoiceNumber: invNum,
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    setStorage(STORAGE_KEYS.ORDERS, orders);

    // Update next invoice sequence in settings
    this.updateSettings({ ...settings, nextInvoiceSequence: nextSeq });

    // Inventory reduction & One-of-a-Kind lock
    const products = this.getProducts();
    newOrder.items.forEach(item => {
      const pIdx = products.findIndex(p => p.id === item.productId);
      if (pIdx >= 0) {
        const prod = products[pIdx];
        const newStock = Math.max(0, prod.stock - item.quantity);
        products[pIdx] = {
          ...prod,
          stock: newStock,
          isSold: prod.isOneOfAKind ? (newStock === 0) : prod.isSold
        };
      }
    });
    setStorage(STORAGE_KEYS.PRODUCTS, products);

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatusType, courier?: string, tracking?: string): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].orderStatus = status;
      if (courier) orders[idx].courier = courier;
      if (tracking) orders[idx].trackingNumber = tracking;
      
      // If COD delivered, mark as paid automatically
      if (orders[idx].paymentMethod === 'cod' && (status === 'Delivered' || status === 'Completed')) {
        orders[idx].paymentStatus = 'Paid';
      }

      setStorage(STORAGE_KEYS.ORDERS, orders);
    }
  },

  updatePaymentStatus(orderId: string, status: PaymentStatusType): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx >= 0) {
      orders[idx].paymentStatus = status;
      if (status === 'Paid' && orders[idx].orderStatus === 'Payment Verification') {
        orders[idx].orderStatus = 'Order Processing';
      }
      setStorage(STORAGE_KEYS.ORDERS, orders);
    }
  },

  // CUSTOM COMMISSIONS
  getCustomOrders(): CustomOrderRequest[] {
    return getStorage<CustomOrderRequest[]>(STORAGE_KEYS.CUSTOM_ORDERS, INITIAL_CUSTOM_ORDERS);
  },

  createCustomOrder(data: Omit<CustomOrderRequest, 'id' | 'ticketNumber' | 'createdAt' | 'status'>): CustomOrderRequest {
    const customOrders = this.getCustomOrders();
    const ticket = `CUS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newRequest: CustomOrderRequest = {
      ...data,
      id: `cus-${Date.now()}`,
      ticketNumber: ticket,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    customOrders.unshift(newRequest);
    setStorage(STORAGE_KEYS.CUSTOM_ORDERS, customOrders);
    return newRequest;
  },

  updateCustomOrderQuote(id: string, quote: number, deposit: number, notes?: string, status?: CustomOrderRequest['status']): void {
    const list = this.getCustomOrders();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx].quotationAmount = quote;
      list[idx].depositRequired = deposit;
      if (notes) list[idx].adminNotes = notes;
      list[idx].status = status || 'Quotation Sent';
      setStorage(STORAGE_KEYS.CUSTOM_ORDERS, list);
    }
  },

  // COUPONS
  getCoupons(): Coupon[] {
    return getStorage<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const normalized = code.trim().toUpperCase();
    const coupon = this.getCoupons().find(c => c.code.toUpperCase() === normalized && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: "Invalid or inactive promotional code." };
    }
    if (subtotal < coupon.minPurchase) {
      return { valid: false, discount: 0, message: `Minimum purchase of PKR ${coupon.minPurchase.toLocaleString()} required for this code.` };
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return { valid: true, discount: Math.round(discount), message: "Promotional code applied successfully!", coupon };
  },

  saveCoupon(coupon: Coupon): void {
    const list = this.getCoupons();
    const idx = list.findIndex(c => c.code === coupon.code);
    if (idx >= 0) {
      list[idx] = coupon;
    } else {
      list.push(coupon);
    }
    setStorage(STORAGE_KEYS.COUPONS, list);
  },

  // REVIEWS
  getReviews(productId?: string): Review[] {
    const all = getStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return productId ? all.filter(r => r.productId === productId) : all;
  },

  addReview(review: Omit<Review, 'id' | 'date'>): Review {
    const list = getStorage<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    list.unshift(newRev);
    setStorage(STORAGE_KEYS.REVIEWS, list);

    // Update product rating
    const products = this.getProducts();
    const pIdx = products.findIndex(p => p.id === review.productId);
    if (pIdx >= 0) {
      const prodReviews = list.filter(r => r.productId === review.productId);
      const avg = prodReviews.reduce((acc, r) => acc + r.rating, 0) / prodReviews.length;
      products[pIdx].rating = Number(avg.toFixed(1));
      products[pIdx].reviewCount = prodReviews.length;
      setStorage(STORAGE_KEYS.PRODUCTS, products);
    }

    return newRev;
  },

  // EXPENSES
  getExpenses(): ExpenseRecord[] {
    return getStorage<ExpenseRecord[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  },

  addExpense(expense: Omit<ExpenseRecord, 'id'>): ExpenseRecord {
    const list = this.getExpenses();
    const newExp: ExpenseRecord = { ...expense, id: `exp-${Date.now()}` };
    list.unshift(newExp);
    setStorage(STORAGE_KEYS.EXPENSES, list);
    return newExp;
  },

  // SETTINGS
  getSettings(): StoreSettings {
    return getStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings(settings: StoreSettings): void {
    setStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  // WISHLIST
  getWishlist(): string[] {
    return getStorage<string[]>(STORAGE_KEYS.WISHLIST, []);
  },

  toggleWishlist(productId: string): string[] {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
    setStorage(STORAGE_KEYS.WISHLIST, updated);
    return updated;
  },

  // CART
  getCart(): CartItem[] {
    return getStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  },

  setCart(cart: CartItem[]): void {
    setStorage(STORAGE_KEYS.CART, cart);
  },

  addToCart(product: Product, quantity = 1): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let updated: CartItem[];
    if (existingIndex >= 0) {
      updated = [...cart];
      const maxStock = product.stock;
      const newQty = product.isOneOfAKind ? 1 : Math.min(updated[existingIndex].quantity + quantity, maxStock);
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty
      };
    } else {
      updated = [...cart, { product, quantity: product.isOneOfAKind ? 1 : quantity }];
    }
    this.setCart(updated);
    return updated;
  },

  updateCartQuantity(productId: string, quantity: number): CartItem[] {
    const cart = this.getCart();
    let updated: CartItem[];
    if (quantity <= 0) {
      updated = cart.filter(item => item.product.id !== productId);
    } else {
      updated = cart.map(item => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return {
            ...item,
            quantity: item.product.isOneOfAKind ? 1 : Math.min(quantity, maxStock)
          };
        }
        return item;
      });
    }
    this.setCart(updated);
    return updated;
  },

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart();
    const updated = cart.filter(item => item.product.id !== productId);
    this.setCart(updated);
    return updated;
  },

  clearCart(): void {
    this.setCart([]);
  },

  // ACCOUNTING / METRICS
  getAccountingSummary() {
    const orders = this.getOrders();
    const expenses = this.getExpenses();
    const products = this.getProducts();

    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrdersCount = orders.length;
    const paidOrdersCount = paidOrders.length;
    const pendingOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Completed' && o.orderStatus !== 'Cancelled').length;

    // Cost of Goods Sold (estimated from products sold)
    let cogs = 0;
    paidOrders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const unitCost = prod?.costPrice || (item.unitPrice * 0.45);
        cogs += unitCost * item.quantity;
      });
    });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const grossProfit = totalRevenue - cogs;
    const netProfit = grossProfit - totalExpenses;

    // Sales by Category
    const categorySales: Record<string, number> = {};
    paidOrders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'General';
        categorySales[cat] = (categorySales[cat] || 0) + item.total;
      });
    });

    // Payment Methods Breakdown
    const paymentMethods: Record<string, number> = {};
    orders.forEach(o => {
      paymentMethods[o.paymentMethod] = (paymentMethods[o.paymentMethod] || 0) + 1;
    });

    return {
      totalRevenue,
      totalOrdersCount,
      paidOrdersCount,
      pendingOrdersCount,
      cogs,
      totalExpenses,
      grossProfit,
      netProfit,
      categorySales,
      paymentMethods,
      lowStockCount: products.filter(p => p.stock <= 2 && !p.isSold).length,
      outOfStockCount: products.filter(p => p.stock === 0 || p.isSold).length
    };
  },

  // EXPORT / IMPORT (Backup-Ready Architecture)
  exportFullBackup(): string {
    const backup = {
      timestamp: new Date().toISOString(),
      products: this.getProducts(),
      orders: this.getOrders(),
      customOrders: this.getCustomOrders(),
      coupons: this.getCoupons(),
      reviews: this.getReviews(),
      expenses: this.getExpenses(),
      settings: this.getSettings()
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) setStorage(STORAGE_KEYS.PRODUCTS, data.products);
      if (data.orders) setStorage(STORAGE_KEYS.ORDERS, data.orders);
      if (data.customOrders) setStorage(STORAGE_KEYS.CUSTOM_ORDERS, data.customOrders);
      if (data.coupons) setStorage(STORAGE_KEYS.COUPONS, data.coupons);
      if (data.reviews) setStorage(STORAGE_KEYS.REVIEWS, data.reviews);
      if (data.expenses) setStorage(STORAGE_KEYS.EXPENSES, data.expenses);
      if (data.settings) setStorage(STORAGE_KEYS.SETTINGS, data.settings);
      return true;
    } catch (e) {
      console.error("Failed to import backup:", e);
      return false;
    }
  }
};
