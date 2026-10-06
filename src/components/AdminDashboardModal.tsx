import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Clock, 
  Truck, 
  Tag, 
  Sparkles, 
  Download, 
  Upload, 
  Settings, 
  PieChart, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Product, Order, CustomOrderRequest, Coupon, StoreSettings, ExpenseRecord, OrderStatusType } from '../types';
import { SupportedCurrency, formatCurrency } from '../utils/currency';
import { StoreService } from '../services/store';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: SupportedCurrency;
  onViewInvoice: (order: Order) => void;
  onRefreshProducts: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currency,
  onViewInvoice,
  onRefreshProducts
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'commissions' | 'accounting' | 'coupons' | 'settings'>('overview');
  
  // Data from store
  const [products, setProducts] = useState<Product[]>(() => StoreService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => StoreService.getOrders());
  const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>(() => StoreService.getCustomOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StoreService.getCoupons());
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => StoreService.getExpenses());
  const [settings, setSettings] = useState<StoreSettings>(() => StoreService.getSettings());

  // Editing product modal / state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Resin Art',
    price: 15000,
    costPrice: 6000,
    stock: 5,
    condition: 'Handmade',
    material: 'Bio-Resin, 24K Gold Leaf & Preserved Flowers',
    dimensions: '14" Diameter',
    weight: '1.2 kg',
    color: 'Ivory & Gold',
    tags: ['resin art', 'decorative plate'],
    story: 'Handcrafted in our boutique atelier with organic preserved flowers.',
    description: 'Luxury decorative plate suitable for elegant dining and console displays.',
    images: ['https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80']
  });

  // New Expense form
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number>(5000);
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseRecord['category']>('Raw Materials');

  // New Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponVal, setNewCouponVal] = useState<number>(10);
  const [newCouponMin, setNewCouponMin] = useState<number>(10000);

  // Accounting Summary calculation
  const summary = StoreService.getAccountingSummary();

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditProduct.name) return;

    const prodId = currentEditProduct.id || `prod-${Date.now()}`;
    const sku = currentEditProduct.sku || `HE-ART-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = currentEditProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const productToSave: Product = {
      id: prodId,
      name: currentEditProduct.name,
      slug: slug,
      sku: sku,
      category: currentEditProduct.category || 'Resin Art',
      subcategory: currentEditProduct.subcategory || 'Decorative Plates',
      price: Number(currentEditProduct.price) || 10000,
      salePrice: currentEditProduct.salePrice ? Number(currentEditProduct.salePrice) : undefined,
      costPrice: Number(currentEditProduct.costPrice) || 4000,
      stock: Number(currentEditProduct.stock) || 1,
      condition: currentEditProduct.condition || 'Handmade',
      material: currentEditProduct.material || 'Bio-Resin & 24K Gold Leaf',
      dimensions: currentEditProduct.dimensions || '14" Diameter',
      weight: currentEditProduct.weight || '1.2 kg',
      color: currentEditProduct.color || 'Ivory & Gold',
      tags: currentEditProduct.tags || ['resin'],
      isOneOfAKind: Boolean(currentEditProduct.isOneOfAKind),
      isSold: Boolean(currentEditProduct.isSold),
      certificateNumber: currentEditProduct.certificateNumber,
      provenance: currentEditProduct.provenance,
      story: currentEditProduct.story || '',
      description: currentEditProduct.description || '',
      images: currentEditProduct.images && currentEditProduct.images.length > 0 ? currentEditProduct.images : ['https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80'],
      rating: currentEditProduct.rating || 5.0,
      reviewCount: currentEditProduct.reviewCount || 1,
      createdAt: currentEditProduct.createdAt || new Date().toISOString()
    };

    StoreService.saveProduct(productToSave);
    setProducts(StoreService.getProducts());
    setIsEditingProduct(false);
    onRefreshProducts();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product from the atelier catalog?")) {
      StoreService.deleteProduct(id);
      setProducts(StoreService.getProducts());
      onRefreshProducts();
    }
  };

  const handleDuplicateProduct = (p: Product) => {
    const dup: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      sku: `HE-CPY-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${p.name} (Copy)`
    };
    StoreService.saveProduct(dup);
    setProducts(StoreService.getProducts());
    onRefreshProducts();
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatusType) => {
    StoreService.updateOrderStatus(orderId, status);
    setOrders(StoreService.getOrders());
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseAmount) return;
    StoreService.addExpense({
      description: newExpenseDesc,
      amount: Number(newExpenseAmount),
      category: newExpenseCategory,
      date: new Date().toISOString().split('T')[0]
    });
    setExpenses(StoreService.getExpenses());
    setNewExpenseDesc('');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newC: Coupon = {
      code: newCouponCode.toUpperCase().trim(),
      type: 'percentage',
      value: Number(newCouponVal),
      minPurchase: Number(newCouponMin),
      isActive: true,
      expiresAt: '2026-12-31T23:59:59Z',
      usageCount: 0
    };
    StoreService.saveCoupon(newC);
    setCoupons(StoreService.getCoupons());
    setNewCouponCode('');
  };

  const handleExportCSV = () => {
    const orders = StoreService.getOrders();
    let csv = "Order Number,Invoice Number,Customer,Total,Status,Payment Method,Date\n";
    orders.forEach(o => {
      csv += `"${o.orderNumber}","${o.invoiceNumber}","${o.customerInfo.fullName}",${o.total},"${o.orderStatus}","${o.paymentMethod}","${o.createdAt}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Elegance_Orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleBackupDownload = () => {
    const jsonStr = StoreService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Heritage_Elegance_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Main Modal Shell */}
      <div className="relative bg-[#FAF7F2] rounded-2xl max-w-6xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-[#DFD1BD] z-10 p-5 sm:p-8 flex flex-col">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#E7DFD3] gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-[#88672D]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Back-Office Atelier Management</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
              Heritage &amp; Elegance Atelier Admin Portal
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-white border border-[#DFCBB0] text-xs font-medium rounded hover:bg-[#F3ECE0] flex items-center space-x-1"
              title="Export Orders as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleBackupDownload}
              className="px-3 py-1.5 bg-white border border-[#DFCBB0] text-xs font-medium rounded hover:bg-[#F3ECE0] flex items-center space-x-1"
              title="Download Full Database Backup"
            >
              <Download className="w-3.5 h-3.5 text-[#88672D]" />
              <span>Full DB Backup</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F3ECE0] text-[#78716C]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E7DFD3] text-xs font-semibold tracking-wider uppercase text-[#78716C] mt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'overview' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dashboard KPI</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'orders' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'products' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products &amp; Inventory ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'commissions' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Custom Commissions ({customOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('accounting')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'accounting' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Accounting &amp; P&amp;L</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'coupons' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-4 border-b-2 flex items-center space-x-1.5 transition-colors flex-shrink-0 ${
              activeTab === 'settings' ? 'border-[#88672D] text-[#88672D] font-bold' : 'border-transparent hover:text-[#1C1917]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="py-6 flex-1 overflow-y-auto">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metrics row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E7DFD3] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Total Revenue</span>
                  <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                    {formatCurrency(summary.totalRevenue, currency)}
                  </div>
                  <span className="text-[10px] text-emerald-700">Verified Paid Sales</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7DFD3] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Net Studio Profit</span>
                  <div className={`font-serif text-2xl font-bold mt-1 ${summary.netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                    {formatCurrency(summary.netProfit, currency)}
                  </div>
                  <span className="text-[10px] text-[#78716C]">Revenue - (COGS + Expenses)</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7DFD3] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Active Orders</span>
                  <div className="font-serif text-2xl font-bold text-[#1C1917] mt-1">
                    {orders.length}
                  </div>
                  <span className="text-[10px] text-amber-700 font-medium">{summary.pendingOrdersCount} in fulfillment pipeline</span>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7DFD3] shadow-xs">
                  <span className="text-[11px] font-semibold text-[#78716C] uppercase tracking-wider block">Low / Sold Stock</span>
                  <div className="font-serif text-2xl font-bold text-amber-800 mt-1">
                    {summary.lowStockCount} / {summary.outOfStockCount}
                  </div>
                  <span className="text-[10px] text-[#78716C]">Requires artisan casting batch</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-xl border border-[#E7DFD3] p-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#F3ECE0] mb-4">
                  <h3 className="font-serif text-base font-semibold text-[#1C1917]">
                    Recent Patron Acquisitions
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#88672D] hover:underline">
                    View All Orders
                  </button>
                </div>

                <div className="divide-y divide-[#F3ECE0] text-xs">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-[#1C1917] mr-2">{o.orderNumber}</span>
                        <span className="text-[#78716C]">{o.customerInfo.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-[#1C1917]">{formatCurrency(o.total, currency)}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#F3ECE0] text-[#88672D]">
                          {o.orderStatus}
                        </span>
                        <button onClick={() => onViewInvoice(o)} className="text-gray-400 hover:text-black">
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Order Dispatch &amp; Status Pipeline
                </h3>
                <span className="text-xs text-[#78716C]">{orders.length} total orders</span>
              </div>

              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="bg-white p-4 rounded-xl border border-[#E7DFD3] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3ECE0] pb-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#1C1917]">{o.orderNumber}</span>
                        <span className="text-[#88672D] font-mono ml-2">({o.invoiceNumber})</span>
                        <span className="text-[#78716C] ml-2">by {o.customerInfo.fullName} ({o.customerInfo.city})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onViewInvoice(o)}
                          className="px-2.5 py-1 bg-[#FAF7F2] border border-[#DFCBB0] rounded text-xs text-[#88672D] hover:bg-[#F3ECE0] flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="text-[#78716C] block text-[11px]">Items:</span>
                        <span className="font-medium text-[#1C1917]">
                          {o.items.map(i => `${i.productName} × ${i.quantity}`).join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#78716C] block text-[11px]">Amount:</span>
                        <span className="font-serif font-bold text-sm text-[#1C1917]">
                          {formatCurrency(o.total, currency)}
                        </span>
                      </div>

                      {/* Workflow status selector */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-[#78716C]">Status:</span>
                        <select
                          value={o.orderStatus}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value as OrderStatusType)}
                          className="bg-[#FAF7F2] border border-[#E7DFD3] rounded px-2.5 py-1 text-xs text-[#1C1917] font-semibold"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Payment Verification">Payment Verification</option>
                          <option value="Order Processing">Order Processing</option>
                          <option value="Product Packed">Product Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Product Catalog &amp; One-of-a-Kind Locks
                </h3>
                <button
                  onClick={() => {
                    setCurrentEditProduct({
                      name: '',
                      category: 'Resin Art',
                      price: 16000,
                      costPrice: 6500,
                      stock: 5,
                      condition: 'Handmade',
                      material: 'Bio-Resin & Preserved Flowers',
                      dimensions: '14" Diameter',
                      weight: '1.2 kg',
                      color: 'Ivory & Gold',
                      tags: ['resin art', 'botanical'],
                      images: ['https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80']
                    });
                    setIsEditingProduct(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded flex items-center space-x-1.5 hover:bg-[#2C2723]"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-[#E7DFD3] overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] border-b border-[#E7DFD3] text-[#1C1917] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Piece</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Condition</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3ECE0]">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/50">
                        <td className="p-3 flex items-center space-x-2.5">
                          <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0" />
                          <div>
                            <span className="font-serif font-semibold text-[#1C1917] block">{p.name}</span>
                            {p.isOneOfAKind && (
                              <span className="text-[10px] text-[#88672D] font-bold">1-of-1 Artifact</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-[#78716C]">{p.sku}</td>
                        <td className="p-3 text-[#57534E]">{p.category}</td>
                        <td className="p-3 font-serif font-semibold text-[#1C1917]">
                          {formatCurrency(p.salePrice || p.price, currency)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock <= 0 || p.isSold ? 'bg-red-100 text-red-800' : p.stock === 1 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.isSold ? 'SOLD' : `${p.stock} units`}
                          </span>
                        </td>
                        <td className="p-3 text-[#78716C]">{p.condition}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setCurrentEditProduct(p);
                                setIsEditingProduct(true);
                              }}
                              className="p-1 text-gray-500 hover:text-black"
                              title="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="p-1 text-gray-500 hover:text-[#88672D]"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM COMMISSIONS */}
          {activeTab === 'commissions' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                Customer Commission Inquiries &amp; Quotations
              </h3>

              <div className="space-y-3">
                {customOrders.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-xl border border-[#E7DFD3] space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3ECE0] pb-2">
                      <div>
                        <span className="font-mono font-bold text-sm text-[#88672D]">{c.ticketNumber}</span>
                        <span className="text-[#1C1917] font-semibold ml-2">{c.customerName}</span>
                        <span className="text-[#78716C] ml-2">({c.phone} • {c.email})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {c.status}
                      </span>
                    </div>

                    <p className="text-[#57534E]">
                      <strong>Requirements:</strong> {c.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-[11px] text-[#78716C]">
                      <span>Size: {c.preferredSize}</span>
                      <span>Colors: {c.preferredColors}</span>
                      <span>Target Budget: {c.budget}</span>
                      <span>Required By: {c.requiredDate}</span>
                    </div>

                    {/* Admin response quotation fields */}
                    <div className="p-3 bg-[#FAF7F2] rounded border border-[#E7DFD3] flex flex-wrap items-center gap-3">
                      <div className="flex items-center space-x-2">
                        <span>Quote (PKR):</span>
                        <input
                          type="number"
                          defaultValue={c.quotationAmount || 30000}
                          id={`quote-amount-${c.id}`}
                          className="w-24 px-2 py-1 bg-white border border-[#E7DFD3] rounded text-xs"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>Deposit:</span>
                        <input
                          type="number"
                          defaultValue={c.depositRequired || 15000}
                          id={`deposit-amount-${c.id}`}
                          className="w-24 px-2 py-1 bg-white border border-[#E7DFD3] rounded text-xs"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const qEl = document.getElementById(`quote-amount-${c.id}`) as HTMLInputElement;
                          const dEl = document.getElementById(`deposit-amount-${c.id}`) as HTMLInputElement;
                          StoreService.updateCustomOrderQuote(c.id, Number(qEl.value), Number(dEl.value), "Quotation transmitted to patron.");
                          setCustomOrders(StoreService.getCustomOrders());
                          alert("Quotation saved & emailed to customer!");
                        }}
                        className="px-3 py-1 bg-[#88672D] text-white rounded text-xs font-semibold uppercase"
                      >
                        Send Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNTING & P&L */}
          {activeTab === 'accounting' && (
            <div className="space-y-6">
              
              {/* Financial Breakdown Table */}
              <div className="bg-white p-5 rounded-xl border border-[#E7DFD3] space-y-4">
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  Atelier Profit &amp; Loss Statement
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#FAF7F2] rounded border border-[#E7DFD3]">
                    <span className="text-[#78716C] block">Gross Revenue</span>
                    <span className="font-serif font-bold text-lg text-[#1C1917]">
                      {formatCurrency(summary.totalRevenue, currency)}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded border border-[#E7DFD3]">
                    <span className="text-[#78716C] block">Cost of Goods (COGS)</span>
                    <span className="font-serif font-bold text-lg text-[#1C1917]">
                      {formatCurrency(summary.cogs, currency)}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF7F2] rounded border border-[#E7DFD3]">
                    <span className="text-[#78716C] block">Studio Expenses</span>
                    <span className="font-serif font-bold text-lg text-[#1C1917]">
                      {formatCurrency(summary.totalExpenses, currency)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-800 font-bold block text-sm">Net Operating Profit</span>
                    <span className="text-emerald-700">Calculated after COGS and recorded production overhead</span>
                  </div>
                  <span className="font-serif font-bold text-2xl text-emerald-900">
                    {formatCurrency(summary.netProfit, currency)}
                  </span>
                </div>
              </div>

              {/* Record New Expense */}
              <div className="bg-white p-5 rounded-xl border border-[#E7DFD3] space-y-3">
                <h4 className="font-serif text-base font-semibold text-[#1C1917]">Record Atelier Operating Expense</h4>
                <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Expense description (e.g. 24K gold foil)"
                    value={newExpenseDesc}
                    onChange={e => setNewExpenseDesc(e.target.value)}
                    className="p-2 border border-[#E7DFD3] rounded sm:col-span-2"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Amount in PKR"
                    value={newExpenseAmount}
                    onChange={e => setNewExpenseAmount(Number(e.target.value))}
                    className="p-2 border border-[#E7DFD3] rounded"
                  />
                  <select
                    value={newExpenseCategory}
                    onChange={e => setNewExpenseCategory(e.target.value as any)}
                    className="p-2 border border-[#E7DFD3] rounded"
                  >
                    <option value="Raw Materials">Raw Materials</option>
                    <option value="Artisan Commission">Artisan Commission</option>
                    <option value="Packaging & Shipping">Packaging &amp; Shipping</option>
                    <option value="Studio Utilities">Studio Utilities</option>
                  </select>
                  <button type="submit" className="px-4 py-2 bg-[#1C1917] text-[#FAF7F2] rounded uppercase tracking-wider font-semibold sm:col-span-4">
                    Record Expense
                  </button>
                </form>

                {/* Expense records */}
                <div className="divide-y divide-[#F3ECE0] text-xs pt-2">
                  {expenses.map(exp => (
                    <div key={exp.id} className="py-2 flex justify-between">
                      <div>
                        <span className="font-medium text-[#1C1917]">{exp.description}</span>
                        <span className="text-[10px] text-gray-500 ml-2">({exp.category})</span>
                      </div>
                      <span className="font-semibold text-red-700">-{formatCurrency(exp.amount, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Promotional Coupons</h3>

              {/* Create coupon form */}
              <form onSubmit={handleAddCoupon} className="bg-white p-4 rounded-xl border border-[#E7DFD3] flex flex-wrap items-center gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Code (e.g. VIP25)"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                  className="p-2 border border-[#E7DFD3] rounded"
                />
                <input
                  type="number"
                  placeholder="Discount %"
                  value={newCouponVal}
                  onChange={e => setNewCouponVal(Number(e.target.value))}
                  className="p-2 border border-[#E7DFD3] rounded w-24"
                />
                <input
                  type="number"
                  placeholder="Min Purchase (PKR)"
                  value={newCouponMin}
                  onChange={e => setNewCouponMin(Number(e.target.value))}
                  className="p-2 border border-[#E7DFD3] rounded w-36"
                />
                <button type="submit" className="px-4 py-2 bg-[#1C1917] text-[#FAF7F2] rounded uppercase font-semibold">
                  Create Coupon
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map(c => (
                  <div key={c.code} className="bg-white p-3.5 rounded-xl border border-[#E7DFD3] flex justify-between items-center text-xs">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#88672D] block">{c.code}</span>
                      <span className="text-[#78716C]">
                        {c.type === 'percentage' ? `${c.value}% off` : `${formatCurrency(c.value, currency)} off`} (Min: {formatCurrency(c.minPurchase, currency)})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Active ({c.usageCount} uses)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl border border-[#E7DFD3] space-y-4 max-w-xl text-xs">
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">Atelier Business Configuration</h3>
              <div>
                <label className="block text-[#78716C] mb-1 font-semibold uppercase">Business Name</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={e => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full p-2 border border-[#E7DFD3] rounded"
                />
              </div>
              <div>
                <label className="block text-[#78716C] mb-1 font-semibold uppercase">Curatorial Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2 border border-[#E7DFD3] rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716C] mb-1 font-semibold uppercase">Sales Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.taxRatePercent}
                    onChange={e => setSettings({ ...settings, taxRatePercent: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  />
                </div>
                <div>
                  <label className="block text-[#78716C] mb-1 font-semibold uppercase">Free Shipping Threshold</label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={e => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  StoreService.updateSettings(settings);
                  alert("Store configuration saved successfully!");
                }}
                className="px-6 py-2.5 bg-[#1C1917] text-[#FAF7F2] uppercase tracking-wider font-semibold rounded"
              >
                Save Settings
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Edit / Add Product Sub-Modal */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsEditingProduct(false)} />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E7DFD3]">
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                {currentEditProduct.id ? 'Edit Atelier Artifact' : 'Add New Artifact to Catalog'}
              </h3>
              <button onClick={() => setIsEditingProduct(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={currentEditProduct.name}
                  onChange={e => setCurrentEditProduct({ ...currentEditProduct, name: e.target.value })}
                  className="w-full p-2 border border-[#E7DFD3] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={currentEditProduct.category}
                    onChange={e => setCurrentEditProduct({ ...currentEditProduct, category: e.target.value })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  >
                    <option>Resin Art</option>
                    <option>Decorative Plates</option>
                    <option>Antique Décor</option>
                    <option>Decorative Trays</option>
                    <option>Wall Art</option>
                    <option>Customized Gifts</option>
                    <option>One of a Kind</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Condition &amp; Heritage</label>
                  <select
                    value={currentEditProduct.condition}
                    onChange={e => setCurrentEditProduct({ ...currentEditProduct, condition: e.target.value as any })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  >
                    <option>Handmade</option>
                    <option>Original Antique</option>
                    <option>Antique-Inspired</option>
                    <option>Vintage</option>
                    <option>Limited Edition</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={currentEditProduct.price}
                    onChange={e => setCurrentEditProduct({ ...currentEditProduct, price: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cost Price (COGS)</label>
                  <input
                    type="number"
                    value={currentEditProduct.costPrice}
                    onChange={e => setCurrentEditProduct({ ...currentEditProduct, costPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={currentEditProduct.stock}
                    onChange={e => setCurrentEditProduct({ ...currentEditProduct, stock: Number(e.target.value) })}
                    className="w-full p-2 border border-[#E7DFD3] rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Material Composition</label>
                <input
                  type="text"
                  value={currentEditProduct.material}
                  onChange={e => setCurrentEditProduct({ ...currentEditProduct, material: e.target.value })}
                  className="w-full p-2 border border-[#E7DFD3] rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={currentEditProduct.images?.[0] || ''}
                  onChange={e => setCurrentEditProduct({ ...currentEditProduct, images: [e.target.value] })}
                  className="w-full p-2 border border-[#E7DFD3] rounded"
                />
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentEditProduct.isOneOfAKind}
                    onChange={e => setCurrentEditProduct({ ...currentEditProduct, isOneOfAKind: e.target.checked })}
                  />
                  <span className="font-semibold">One of a Kind Piece (Only 1 will exist)</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold mb-1">Artisan Story &amp; Provenance</label>
                <textarea
                  rows={3}
                  value={currentEditProduct.story}
                  onChange={e => setCurrentEditProduct({ ...currentEditProduct, story: e.target.value })}
                  className="w-full p-2 border border-[#E7DFD3] rounded"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1C1917] text-[#FAF7F2] rounded uppercase font-semibold"
                >
                  Save Piece to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
