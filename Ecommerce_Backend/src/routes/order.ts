import express from "express";
import {
  newOrder,
  myOrders,
  allOrders,
  getSingleOrder,
  processOrder,
  deleteOrder,
  cancelOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

// Route: /api/v1/order/new
app.post("/new", newOrder);

// Route: /api/v1/order/my - Customer isolated orders
app.get("/my", myOrders);

// Route: /api/v1/order/all - Admin only
app.get("/all", adminOnly, allOrders);

// Route: /api/v1/order/:id/cancel
app.put("/:id/cancel", cancelOrder);

// Route: /api/v1/order/:id
app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;