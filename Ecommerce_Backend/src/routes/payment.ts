import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  createCoupon,
  getAllCoupons,
  applyDiscount,
  deleteCoupon,
  createPaymentIntent,
} from "../controllers/payment.js";

const app = express.Router();

// Route: /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, createCoupon);

// Route: /api/v1/payment/coupon/all
app.get("/coupon/all", getAllCoupons);

// Route: /api/v1/payment/discount
app.get("/discount", applyDiscount);

// Route: /api/v1/payment/coupon/:id
app.delete("/coupon/:id", adminOnly, deleteCoupon);

// Route: /api/v1/payment/create (Payment Gateway Intent)
app.post("/create", createPaymentIntent);

export default app;
