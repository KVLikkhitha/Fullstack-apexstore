import { rm } from "node:fs";
import type { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import type {
  NewProductRequestBody,
  SearchRequestQuery,
  BaseQuery,
} from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { Review } from "../models/review.js";
import { MyCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const newProduct = tryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const {
      name,
      price,
      stock,
      category,
      description,
      originalPrice,
      brand,
      specs,
      featured,
      _id,
    } = req.body;
    const file = (req as any).file;
    const photoUrl = req.body.photo;

    // Use uploaded file path (normalized with forward slashes) or provided photo URL
    const photo = file ? `/${file.path.replace(/\\/g, "/")}` : photoUrl;

    if (!photo) {
      return next(new ErrorHandler("Please provide product photo or image URL", 400));
    }

    if (!name || price === undefined || stock === undefined || !category) {
      if (file) {
        rm(file.path, () => {
          console.log("Uploaded photo deleted due to missing fields.");
        });
      }
      return next(new ErrorHandler("Please enter all required fields", 400));
    }

    let parsedSpecs = [];
    if (specs) {
      if (typeof specs === "string") {
        try {
          parsedSpecs = JSON.parse(specs);
        } catch {
          parsedSpecs = [];
        }
      } else if (Array.isArray(specs)) {
        parsedSpecs = specs;
      }
    }

    const productPayload: any = {
      name: name.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      stock: Number(stock),
      category: category.trim(),
      photo,
      description: description || "",
      brand: brand || "",
      specs: parsedSpecs,
      featured:
        featured === true ||
        featured === "true" ||
        featured === "1",
    };

    if (_id) {
      productPayload._id = _id;
    }

    const product = await Product.create(productPayload);

    await invalidateCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  }
);

export const getlatestProducts = tryCatch(async (req, res) => {
  let products;
  if (MyCache.has("latest-products")) {
    products = JSON.parse(MyCache.get("latest-products") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    MyCache.set("latest-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getFeaturedProducts = tryCatch(async (req, res) => {
  let products;
  if (MyCache.has("featured-products")) {
    products = JSON.parse(MyCache.get("featured-products") as string);
  } else {
    products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(8);
    MyCache.set("featured-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = tryCatch(async (req, res) => {
  let categories;
  if (MyCache.has("categories")) {
    categories = JSON.parse(MyCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    MyCache.set("categories", JSON.stringify(categories));
  }
  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = tryCatch(async (req, res) => {
  let products;
  if (MyCache.has("admin-products")) {
    products = JSON.parse(MyCache.get("admin-products") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 });
    MyCache.set("admin-products", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = tryCatch(async (req, res, next) => {
  let product;
  const id = req.params.id;

  if (MyCache.has(`product-${id}`)) {
    product = JSON.parse(MyCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 404));
    MyCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = tryCatch(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    price,
    stock,
    category,
    description,
    originalPrice,
    brand,
    specs,
    featured,
    photo: photoUrl,
  } = req.body;
  const file = (req as any).file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (file) {
    if (product.photo && !product.photo.startsWith("http")) {
      const localFilePath = product.photo.startsWith("/")
        ? product.photo.slice(1)
        : product.photo;
      rm(localFilePath, () => {
        console.log("Old local photo deleted.");
      });
    }
    product.photo = `/${file.path.replace(/\\/g, "/")}`;
  } else if (photoUrl) {
    product.photo = photoUrl;
  }

  if (name) product.name = name.trim();
  if (price !== undefined) product.price = Number(price);
  if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
  if (stock !== undefined) product.stock = Number(stock);
  if (category) product.category = category.trim();
  if (description !== undefined) product.description = description;
  if (brand !== undefined) product.brand = brand;
  if (featured !== undefined) {
    product.featured =
      featured === true ||
      featured === "true" ||
      featured === 1 ||
      featured === "1";
  }

  if (specs) {
    if (typeof specs === "string") {
      try {
        product.specs = JSON.parse(specs);
      } catch {
        // ignore
      }
    } else if (Array.isArray(specs)) {
      (product as any).specs = specs;
    }
  }

  await product.save();
  await invalidateCache({ product: true, admin: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

export const deleteProduct = tryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  if (product.photo && !product.photo.startsWith("http")) {
    const localFilePath = product.photo.startsWith("/")
      ? product.photo.slice(1)
      : product.photo;
    rm(localFilePath, () => {
      console.log("Product photo deleted.");
    });
  }

  await product.deleteOne();
  await Review.deleteMany({ productId: req.params.id });
  await invalidateCache({ product: true, admin: true, productId: req.params.id });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllProducts = tryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res) => {
    const { search, sort, category, price, minPrice, inStockOnly } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 12;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};
    const escapeRegex = (str: string) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

    if (search && search.trim()) {
      baseQuery.name = {
        $regex: escapeRegex(search.trim()),
        $options: "i",
      };
    }

    if (price || minPrice) {
      baseQuery.price = {};
      if (price) {
        baseQuery.price.$lte = Number(price);
      }
      if (minPrice) {
        baseQuery.price.$gte = Number(minPrice);
      }
    }

    if (category && category.trim()) {
      baseQuery.category = {
        $regex: new RegExp(`^${escapeRegex(category.trim())}$`, "i"),
      } as any;
    }

    if (inStockOnly === "true") {
      baseQuery.stock = { $gt: 0 };
    }

    const sortOption: any = {};
    if (sort) {
      if (sort === "price-asc" || sort === "asc") sortOption.price = 1;
      else if (sort === "price-desc" || sort === "desc") sortOption.price = -1;
      else if (sort === "rating") sortOption.rating = -1;
      else if (sort === "newest") sortOption.createdAt = -1;
      else if (sort === "featured") sortOption.featured = -1;
    } else {
      sortOption.createdAt = -1;
    }

    const [products, totalFiltered] = await Promise.all([
      Product.find(baseQuery).sort(sortOption).limit(limit).skip(skip),
      Product.countDocuments(baseQuery),
    ]);

    const totalPage = Math.ceil(totalFiltered / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
      totalCount: totalFiltered,
      page,
    });
  }
);

// Review Controllers
export const createReview = tryCatch(async (req, res, next) => {
  const { id: productId } = req.params;
  const { userName, rating, comment } = req.body;

  if (!userName || rating === undefined || !comment) {
    return next(new ErrorHandler("Please enter all review fields", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const review = await Review.create({
    productId,
    userName: userName.trim(),
    rating: Number(rating),
    comment: comment.trim(),
    date: new Date().toISOString().slice(0, 10),
  });

  // Recalculate average rating
  const allProductReviews = await Review.find({ productId });
  const avgRating =
    allProductReviews.reduce((sum, r) => sum + r.rating, 0) /
    allProductReviews.length;

  product.rating = Number(avgRating.toFixed(1));
  product.reviewCount = allProductReviews.length;
  await product.save();

  await invalidateCache({ product: true, productId });

  return res.status(201).json({
    success: true,
    message: "Review added successfully",
    review,
    product,
  });
});

export const getProductReviews = tryCatch(async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    reviews,
  });
});

export const deleteReview = tryCatch(async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) return next(new ErrorHandler("Review not found", 404));

  const productId = review.productId;
  await review.deleteOne();

  // Recalculate average rating
  const remainingReviews = await Review.find({ productId });
  const product = await Product.findById(productId);
  if (product) {
    if (remainingReviews.length > 0) {
      const avg =
        remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
        remainingReviews.length;
      product.rating = Number(avg.toFixed(1));
      product.reviewCount = remainingReviews.length;
    } else {
      product.rating = 5.0;
      product.reviewCount = 0;
    }
    await product.save();
  }

  await invalidateCache({ product: true, productId });

  return res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
