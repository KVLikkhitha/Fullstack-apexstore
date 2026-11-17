export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  photo: string;
  description: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  brand?: string;
  specs?: { label: string; value: string }[];
}

export interface CartItem {
  productId: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
  stock: number;
  category: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  phone: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  photo: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user: string;
  userEmail: string;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "Card" | "UPI" | "NetBanking" | "COD";
  paymentStatus: "Paid" | "Pending";
  createdAt: string;
  estimatedDelivery: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  gender: string;
  role: "Admin" | "Customer";
  avatar: string;
  joinedDate: string;
  totalOrders: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minSpend?: number;
  expiryDate?: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
  inStockOnly: boolean;
}
