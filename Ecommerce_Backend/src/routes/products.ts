import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  getlatestProducts,
  getFeaturedProducts,
  newProduct,
  updateProduct,
  getAllCategories,
  getAdminProducts,
  getAllProducts,
  getSingleProduct,
  createReview,
  getProductReviews,
  deleteReview,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express.Router();

// Product CRUD routes
app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getlatestProducts);
app.get("/featured", getFeaturedProducts);
app.get("/categories", getAllCategories);
app.get("/admin-products", adminOnly, getAdminProducts);
app.get("/all", getAllProducts);

// Reviews routes
app.post("/:id/review", createReview);
app.get("/:id/reviews", getProductReviews);
app.delete("/:id/review/:reviewId", adminOnly, deleteReview);

// Single Product route
app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default app;
