import type { Request, Response, NextFunction } from "express";
import { tryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";
import { MyCache } from "../app.js";

// Admin: Create or Register Coupon
export const createCoupon = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, discountPercent, maxDiscount, minSpend, expiryDate } = req.body;

    if (!code || discountPercent === undefined) {
      return next(
        new ErrorHandler("Please enter both Coupon Code and Discount Percentage", 400)
      );
    }

    const cleanCode = String(code).toUpperCase().trim();

    let coupon = await Coupon.findOne({ code: cleanCode });

    if (coupon) {
      coupon.discountPercent = Number(discountPercent);
      if (maxDiscount !== undefined) coupon.maxDiscount = Number(maxDiscount);
      if (minSpend !== undefined) coupon.minSpend = Number(minSpend);
      if (expiryDate) coupon.expiryDate = new Date(expiryDate);
      await coupon.save();
    } else {
      const couponData: any = {
        code: cleanCode,
        discountPercent: Number(discountPercent),
        maxDiscount: maxDiscount !== undefined ? Number(maxDiscount) : 5000,
        minSpend: minSpend !== undefined ? Number(minSpend) : 0,
      };
      if (expiryDate) {
        couponData.expiryDate = new Date(expiryDate);
      }
      coupon = await Coupon.create(couponData);
    }

    MyCache.del(["all-coupons"]);

    return res.status(201).json({
      success: true,
      message: `Coupon "${cleanCode}" registered successfully`,
      coupon,
    });
  }
);

// Get All Coupons
export const getAllCoupons = tryCatch(async (req: Request, res: Response) => {
  let coupons;
  if (MyCache.has("all-coupons")) {
    coupons = JSON.parse(MyCache.get("all-coupons") as string);
  } else {
    coupons = await Coupon.find({}).sort({ createdAt: -1 });
    MyCache.set("all-coupons", JSON.stringify(coupons));
  }

  return res.status(200).json({
    success: true,
    coupons,
  });
});

// Apply Discount / Validate Coupon
export const applyDiscount = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { coupon: couponCode, subtotal } = req.query;

    if (!couponCode) {
      return next(new ErrorHandler("Please provide a Coupon Code", 400));
    }

    const cleanCode = String(couponCode).toUpperCase().trim();
    const discountRecord = await Coupon.findOne({ code: cleanCode });

    if (!discountRecord) {
      return next(new ErrorHandler("Invalid or expired Coupon Code", 400));
    }

    if (discountRecord.expiryDate && new Date() > discountRecord.expiryDate) {
      return next(new ErrorHandler("This Coupon Code has expired", 400));
    }

    const subtotalNum = subtotal ? Number(subtotal) : 0;
    if (discountRecord.minSpend && subtotalNum < discountRecord.minSpend) {
      return next(
        new ErrorHandler(
          `Minimum order value of ₹${discountRecord.minSpend} required for this coupon`,
          400
        )
      );
    }

    let discountAmount = 0;
    if (subtotalNum > 0) {
      const raw = Math.round(
        (subtotalNum * discountRecord.discountPercent) / 100
      );
      discountAmount = discountRecord.maxDiscount
        ? Math.min(raw, discountRecord.maxDiscount)
        : raw;
    }

    return res.status(200).json({
      success: true,
      discount: discountAmount,
      discountPercent: discountRecord.discountPercent,
      coupon: discountRecord,
    });
  }
);

// Admin: Delete Coupon
export const deleteCoupon = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const idParam = req.params.id;
    const cleanId = typeof idParam === "string" ? idParam : String(idParam || "");

    const coupon =
      (await Coupon.findById(cleanId)) ||
      (await Coupon.findOne({ code: cleanId.toUpperCase() }));

    if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

    await coupon.deleteOne();
    MyCache.del(["all-coupons"]);

    return res.status(200).json({
      success: true,
      message: `Coupon "${coupon.code}" deleted successfully`,
    });
  }
);

// Payment Gateway / Intent Initialization
export const createPaymentIntent = tryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;

    if (!amount) {
      return next(new ErrorHandler("Please enter payment amount", 400));
    }

    // Returns simulated payment authorization secret
    const clientSecret = `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;

    return res.status(200).json({
      success: true,
      clientSecret,
      amount: Number(amount),
      status: "requires_payment_method",
      message: "Payment intent initialized successfully",
    });
  }
);
