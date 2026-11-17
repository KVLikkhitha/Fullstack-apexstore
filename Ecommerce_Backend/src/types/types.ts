import type { Request, Response, NextFunction } from "express";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "admin" | "user" | "Admin" | "Customer";
  gender: "male" | "female" | "Male" | "Female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  age: number;
}

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role?: string;
  _id: string;
  dob: Date | string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface NewProductRequestBody {
  name: string;
  category: string;
  price: number | string;
  stock: number | string;
  photo?: string;
  description?: string;
  originalPrice?: number | string;
  brand?: string;
  specs?: SpecItem[] | string;
  featured?: boolean | string;
  _id?: string;
}

export type ControllerType = (
  req: Request<any, any, any, any>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  minPrice?: string;
  category?: string;
  sort?: string;
  page?: string;
  inStockOnly?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $gte?: number; $lte?: number };
  category?: string;
  stock?: { $gt: number };
}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string;
};

export type OrderItemType = {
  name: string;
  price: number;
  quantity: number;
  photo?: string;
  productId: string;
  stock?: number;
  category?: string;
};

export type ShippingInfoType = {
  fullName?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  pinCode: string | number;
  phone?: string;
};

export interface NewOrderRequestBody {
  shippingAddress?: ShippingInfoType;
  shippingInfo?: ShippingInfoType;
  user: string;
  userEmail?: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
  paymentMethod?: "Card" | "UPI" | "NetBanking" | "COD";
  paymentStatus?: "Paid" | "Pending";
  estimatedDelivery?: string;
}

export interface NewCouponRequestBody {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minSpend?: number;
  expiryDate?: string | Date;
}