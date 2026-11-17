import mongoose from "mongoose";
import type { InvalidateCacheProps } from "../types/types.js";
import { MyCache } from "../app.js";
import { Product } from "../models/product.js";

export const connectDb = async (uri: string = "mongodb://localhost:27017") => {
  try {
    const c = await mongoose.connect(uri, {
      dbName: "Ecommerce_2026",
    });
    console.log(`DB connected to ${c.connection.host}`);
    return c;
  } catch (e) {
    console.error("Database connection error:", e);
    throw e;
  }
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: InvalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "featured-products",
      "categories",
      "all-products",
      "admin-products",
    ];

    if (productId) {
      productKeys.push(`product-${productId}`);
    } else {
      const products = await Product.find({}).select("_id");
      products.forEach((i) => {
        productKeys.push(`product-${i._id}`);
      });
    }

    MyCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = ["all-orders"];
    if (orderId) orderKeys.push(`order-${orderId}`);
    if (userId) orderKeys.push(`my-orders-${userId}`);
    MyCache.del(orderKeys);
  }

  if (admin) {
    MyCache.del([
      "admin-stats",
      "pie-charts",
      "bar-charts",
      "line-charts",
      "all-coupons",
    ]);
  }
};

export const calculatePercentage = (
  thisMonth: number,
  lastMonth: number
): number => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return Number(percent.toFixed(0));
};

export const getLastMonths = () => {
  const currentDate = new Date();
  currentDate.setDate(1);

  const last6Months: string[] = [];
  const last12Months: string[] = [];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let i = 0; i < 6; i++) {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthName = monthNames[monthDate.getMonth()];
    if (monthName) last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthName = monthNames[monthDate.getMonth()];
    if (monthName) last12Months.unshift(monthName);
  }

  return {
    last6Months,
    last12Months,
  };
};