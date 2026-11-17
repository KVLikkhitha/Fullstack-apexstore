import type { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { MyCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import type { NewOrderRequestBody, OrderItemType } from "../types/types.js";

const reduceStock = async (orderItems: OrderItemType[]) => {
  for (let i = 0; i < orderItems.length; i++) {
    const order = orderItems[i];
    if (!order) continue;
    const product = await Product.findById(order.productId);
    if (!product) continue;
    product.stock = Math.max(0, product.stock - order.quantity);
    await product.save();
  }
};

// Create New Order
export const newOrder = tryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingAddress,
      shippingInfo,
      orderItems,
      user,
      userEmail,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      paymentMethod,
      paymentStatus,
      estimatedDelivery,
    } = req.body;

    const shipping = shippingAddress || shippingInfo;

    if (
      !shipping ||
      !orderItems ||
      orderItems.length === 0 ||
      !user ||
      subtotal === undefined ||
      total === undefined
    ) {
      return next(new ErrorHandler("Please enter all required order fields", 400));
    }

    // Verify stock availability for all items before placing order
    for (const item of orderItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return next(
          new ErrorHandler(`Product "${item.name || item.productId}" was not found`, 404)
        );
      }
      if (product.stock < item.quantity) {
        return next(
          new ErrorHandler(
            `Insufficient stock for "${product.name}". Only ${product.stock} left in stock.`,
            400
          )
        );
      }
    }

    const deliveryDate: string =
      estimatedDelivery ||
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const orderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await Order.create({
      _id: orderId,
      shippingInfo: {
        fullName: shipping.fullName || user,
        address: shipping.address,
        city: shipping.city,
        state: shipping.state,
        country: shipping.country || "India",
        pinCode: String(shipping.pinCode),
        phone: shipping.phone || "",
      },
      orderItems,
      user,
      userEmail: userEmail || "",
      subtotal: Number(subtotal),
      tax: Number(tax || 0),
      shippingCharges: Number(shippingCharges || 0),
      discount: Number(discount || 0),
      total: Number(total),
      paymentMethod: paymentMethod || "Card",
      paymentStatus: paymentStatus || "Paid",
      estimatedDelivery: deliveryDate,
      status: "Processing",
    });

    await reduceStock(orderItems);
    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
    });

  return res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
    order,
  });
});

// Customer: Get current customer's orders
export const myOrders = tryCatch(async (req, res, next) => {
  const { id: user, email } = req.query;

  if (!user && !email) {
    return next(new ErrorHandler("Please provide user ID or email", 400));
  }

  const queryKey = user || email;

  let orders;
  if (MyCache.has(`my-orders-${queryKey}`)) {
    orders = JSON.parse(MyCache.get(`my-orders-${queryKey}`) as string);
  } else {
    const query: any = {};
    if (user && email) {
      query.$or = [{ user: String(user) }, { userEmail: String(email) }];
    } else if (user) {
      query.$or = [{ user: String(user) }, { "shippingInfo.fullName": String(user) }];
    } else {
      query.userEmail = String(email);
    }

    orders = await Order.find(query).sort({ createdAt: -1 });
    MyCache.set(`my-orders-${queryKey}`, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

// Admin-Only: Get all orders across the system
export const allOrders = tryCatch(async (req, res) => {
  let orders;
  if (MyCache.has("all-orders")) {
    orders = JSON.parse(MyCache.get("all-orders") as string);
  } else {
    orders = await Order.find({}).sort({ createdAt: -1 });
    MyCache.set("all-orders", JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

// Get Single Order details
export const getSingleOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  let order;

  if (MyCache.has(`order-${id}`)) {
    order = JSON.parse(MyCache.get(`order-${id}`) as string);
  } else {
    order = await Order.findById(id);
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    MyCache.set(`order-${id}`, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

// Process Order (Admin: change or advance status)
export const processOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  if (status) {
    order.status = status;
  } else {
    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }
  }

  await order.save();
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: `Order status updated to ${order.status}`,
    order,
  });
});

// Delete Order (Admin)
export const deleteOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: id,
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});

// Cancel Order (Customer / Admin): Restores product stock
export const cancelOrder = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);

  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  if (order.status === "Delivered") {
    return next(
      new ErrorHandler(
        "Delivered orders cannot be cancelled directly. Please contact support or request a return.",
        400
      )
    );
  }

  if (order.status === "Cancelled") {
    return next(new ErrorHandler("This order is already cancelled", 400));
  }

  order.status = "Cancelled";
  await order.save();

  // Restore inventory stock for each order item
  for (const item of order.orderItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }

  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: `Order #${order._id} cancelled successfully and inventory stock restored`,
    order,
  });
});