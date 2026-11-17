import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  getDashboardStats,
  getPieCharts,
  getBarCharts,
  getLineCharts,
} from "../controllers/statistics.js";

const app = express.Router();

// Route: /api/v1/dashboard/stats
app.get("/stats", adminOnly, getDashboardStats);

// Route: /api/v1/dashboard/pie
app.get("/pie", adminOnly, getPieCharts);

// Route: /api/v1/dashboard/bar
app.get("/bar", adminOnly, getBarCharts);

// Route: /api/v1/dashboard/line
app.get("/line", adminOnly, getLineCharts);

export default app;
