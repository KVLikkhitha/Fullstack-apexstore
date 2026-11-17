import type { Request, Response } from "express";
import { tryCatch } from "../middlewares/error.js";
import { MyCache } from "../app.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { calculatePercentage, getLastMonths } from "../utils/features.js";

// Main Dashboard Analytics
export const getDashboardStats = tryCatch(async (req: Request, res: Response) => {
  let stats;

  if (MyCache.has("admin-stats")) {
    stats = JSON.parse(MyCache.get("admin-stats") as string);
  } else {
    const today = new Date();
    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    // Parallel queries
    const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
      last6MonthsOrders,
      categories,
      femaleUsersCount,
      latestTransactions,
    ] = await Promise.all([
      Product.find({ createdAt: { $gte: thisMonth.start, $lte: thisMonth.end } }),
      User.find({ createdAt: { $gte: thisMonth.start, $lte: thisMonth.end } }),
      Order.find({ createdAt: { $gte: thisMonth.start, $lte: thisMonth.end } }),
      Product.find({ createdAt: { $gte: lastMonth.start, $lte: lastMonth.end } }),
      User.find({ createdAt: { $gte: lastMonth.start, $lte: lastMonth.end } }),
      Order.find({ createdAt: { $gte: lastMonth.start, $lte: lastMonth.end } }),
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total discount"),
      Order.find({
        createdAt: {
          $gte: new Date(today.getFullYear(), today.getMonth() - 5, 1),
          $lte: today,
        },
      }),
      Product.distinct("category"),
      User.countDocuments({ gender: { $in: ["female", "Female"] } }),
      Order.find({})
        .select("total discount status orderItems createdAt")
        .sort({ createdAt: -1 })
        .limit(6),
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );

    const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
    };

    const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const count = {
      revenue,
      product: productsCount,
      user: usersCount,
      order: allOrders.length,
    };

    // 6-Month chart data
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);

    last6MonthsOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthDiff = (today.getMonth() - orderDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        const index = 5 - monthDiff;
        if (index >= 0 && index < 6) {
          orderMonthCounts[index] += 1;
          orderMonthRevenue[index] += order.total || 0;
        }
      }
    });

    // Categories Distribution
    const categoriesCountPromise = categories.map((cat) =>
      Product.countDocuments({ category: cat })
    );
    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];
    categories.forEach((cat, idx) => {
      const cnt = categoriesCount[idx] || 0;
      const percent =
        productsCount > 0 ? Math.round((cnt / productsCount) * 100) : 0;
      categoryCount.push({
        [cat]: percent,
      });
    });

    // User Ratio
    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    const modifiedLatestTransactions = latestTransactions.map((t) => ({
      _id: t._id,
      id: t._id,
      discount: t.discount || 0,
      amount: t.total,
      quantity: t.orderItems.reduce((acc, i) => acc + (i.quantity || 1), 0),
      status: t.status,
    }));

    stats = {
      categoryCount,
      changePercent,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue,
      },
      userRatio,
      latestTransactions: modifiedLatestTransactions,
    };

    MyCache.set("admin-stats", JSON.stringify(stats));
  }

  return res.status(200).json({
    success: true,
    stats,
  });
});

// Pie & Doughnut Chart Analytics
export const getPieCharts = tryCatch(async (req: Request, res: Response) => {
  let charts;

  if (MyCache.has("pie-charts")) {
    charts = JSON.parse(MyCache.get("pie-charts") as string);
  } else {
    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      cancelledOrder,
      categories,
      productsCount,
      outOfStock,
      allOrders,
      allUsers,
      adminCustomer,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Order.countDocuments({ status: "Cancelled" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: { $lte: 0 } }),
      Order.find({}).select("total discount subtotal tax shippingCharges"),
      User.find({}).select("dob"),
      User.aggregate([
        {
          $group: {
            _id: { $toLower: "$role" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const orderFulfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
      cancelled: cancelledOrder,
    };

    // Category distribution
    const categoriesCountPromise = categories.map((cat) =>
      Product.countDocuments({ category: cat })
    );
    const categoriesCount = await Promise.all(categoriesCountPromise);

    const productCategories: Record<string, number>[] = [];
    categories.forEach((cat, idx) => {
      productCategories.push({
        [cat]: categoriesCount[idx] || 0,
      });
    });

    const stockAvailability = {
      inStock: Math.max(0, productsCount - outOfStock),
      outOfStock,
    };

    // Financial breakdown
    const totalGrossRevenue = allOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    );
    const totalDiscount = allOrders.reduce(
      (sum, o) => sum + (o.discount || 0),
      0
    );
    const productionCost = Math.round(totalGrossRevenue * 0.25);
    const burnt = Math.round(totalGrossRevenue * 0.05);
    const marketingCost = Math.round(totalGrossRevenue * 0.3);
    const netMargin = Math.max(
      0,
      totalGrossRevenue - productionCost - burnt - marketingCost - totalDiscount
    );

    const revenueDistribution = {
      netMargin,
      discount: totalDiscount,
      productionCost,
      burnt,
      marketingCost,
    };

    // Users Age Group
    const usersAgeGroup = {
      teen: allUsers.filter((u) => u.age < 20).length,
      adult: allUsers.filter((u) => u.age >= 20 && u.age < 40).length,
      older: allUsers.filter((u) => u.age >= 40).length,
    };

    let adminCount = 0;
    let customerCount = 0;
    adminCustomer.forEach((item) => {
      if (item._id === "admin") adminCount += item.count;
      else customerCount += item.count;
    });

    const adminCustomerRatio = {
      admin: adminCount,
      customer: customerCount,
    };

    charts = {
      orderFulfillment,
      productCategories,
      stockAvailability,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer: adminCustomerRatio,
    };

    MyCache.set("pie-charts", JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

// Bar Chart Analytics
export const getBarCharts = tryCatch(async (req: Request, res: Response) => {
  let charts;

  if (MyCache.has("bar-charts")) {
    charts = JSON.parse(MyCache.get("bar-charts") as string);
  } else {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const twelveMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      1
    );

    const [sixMonthsProducts, sixMonthsUsers, twelveMonthsOrders] =
      await Promise.all([
        Product.find({ createdAt: { $gte: sixMonthsAgo, $lte: today } }),
        User.find({ createdAt: { $gte: sixMonthsAgo, $lte: today } }),
        Order.find({ createdAt: { $gte: twelveMonthsAgo, $lte: today } }),
      ]);

    const productCounts = new Array(6).fill(0);
    const userCounts = new Array(6).fill(0);
    const orderCounts = new Array(12).fill(0);

    sixMonthsProducts.forEach((p) => {
      const pDate = new Date(p.createdAt);
      const diff = (today.getMonth() - pDate.getMonth() + 12) % 12;
      if (diff < 6) {
        const idx = 5 - diff;
        if (idx >= 0 && idx < 6) productCounts[idx] += 1;
      }
    });

    sixMonthsUsers.forEach((u) => {
      const uDate = new Date(u.createdAt);
      const diff = (today.getMonth() - uDate.getMonth() + 12) % 12;
      if (diff < 6) {
        const idx = 5 - diff;
        if (idx >= 0 && idx < 6) userCounts[idx] += 1;
      }
    });

    twelveMonthsOrders.forEach((o) => {
      const oDate = new Date(o.createdAt);
      const diff = (today.getMonth() - oDate.getMonth() + 12) % 12;
      if (diff < 12) {
        const idx = 11 - diff;
        if (idx >= 0 && idx < 12) orderCounts[idx] += 1;
      }
    });

    charts = {
      products: productCounts,
      users: userCounts,
      orders: orderCounts,
      months: getLastMonths(),
    };

    MyCache.set("bar-charts", JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

// Line Chart Analytics
export const getLineCharts = tryCatch(async (req: Request, res: Response) => {
  let charts;

  if (MyCache.has("line-charts")) {
    charts = JSON.parse(MyCache.get("line-charts") as string);
  } else {
    const today = new Date();
    const twelveMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 11,
      1
    );

    const [twelveMonthsProducts, twelveMonthsUsers, twelveMonthsOrders] =
      await Promise.all([
        Product.find({ createdAt: { $gte: twelveMonthsAgo, $lte: today } }),
        User.find({ createdAt: { $gte: twelveMonthsAgo, $lte: today } }),
        Order.find({ createdAt: { $gte: twelveMonthsAgo, $lte: today } }),
      ]);

    const productCounts = new Array(12).fill(0);
    const userCounts = new Array(12).fill(0);
    const revenueCounts = new Array(12).fill(0);
    const discountCounts = new Array(12).fill(0);

    twelveMonthsProducts.forEach((p) => {
      const pDate = new Date(p.createdAt);
      const diff = (today.getMonth() - pDate.getMonth() + 12) % 12;
      if (diff < 12) {
        const idx = 11 - diff;
        if (idx >= 0 && idx < 12) productCounts[idx] += 1;
      }
    });

    twelveMonthsUsers.forEach((u) => {
      const uDate = new Date(u.createdAt);
      const diff = (today.getMonth() - uDate.getMonth() + 12) % 12;
      if (diff < 12) {
        const idx = 11 - diff;
        if (idx >= 0 && idx < 12) userCounts[idx] += 1;
      }
    });

    twelveMonthsOrders.forEach((o) => {
      const oDate = new Date(o.createdAt);
      const diff = (today.getMonth() - oDate.getMonth() + 12) % 12;
      if (diff < 12) {
        const idx = 11 - diff;
        if (idx >= 0 && idx < 12) {
          revenueCounts[idx] += o.total || 0;
          discountCounts[idx] += o.discount || 0;
        }
      }
    });

    charts = {
      users: userCounts,
      products: productCounts,
      discount: discountCounts,
      revenue: revenueCounts,
      months: getLastMonths(),
    };

    MyCache.set("line-charts", JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});
