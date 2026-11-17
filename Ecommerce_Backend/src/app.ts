import express from "express";
import cors from "cors";
import morgan from "morgan";
import NodeCache from "node-cache";
import mongoose from "mongoose";
import { config } from "dotenv";

import { connectDb } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import { seedDatabaseIfEmpty } from "./utils/seeder.js";

// Import Routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import statsRoutes from "./routes/stats.js";

// Load environment variables
config({
  path: "./.env",
});

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017";

// Connect to MongoDB and seed if empty with graceful error handling
try {
  await connectDb(mongoURI);
  await seedDatabaseIfEmpty();
} catch (err) {
  console.error("Database connection/seeding startup error:", err);
}

export const MyCache = new NodeCache();

const app = express();

// Global Middlewares
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use(express.json({ limit: "5mb" }));

const allowedOrigins = [
  "http://localhost",
  "http://localhost:80",
  "http://127.0.0.1",
  "http://127.0.0.1:80",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((s) => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Health check routes
app.get(["/health", "/api/v1/health"], (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? "healthy" : "unhealthy",
    database: isDbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "ApexStore Ecommerce API v1 is live and operational",
    endpoints: {
      user: "/api/v1/user",
      product: "/api/v1/product",
      order: "/api/v1/order",
      payment: "/api/v1/payment",
      dashboard: "/api/v1/dashboard",
    },
  });
});

// Mount Resource Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", statsRoutes);

// Global Error Handling Middleware (must be after routes)
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;