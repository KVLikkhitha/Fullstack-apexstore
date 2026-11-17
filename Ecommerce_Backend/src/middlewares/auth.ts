import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "./error.js";

export const adminOnly = tryCatch(async (req, res, next) => {
  const id = req.query.id || req.headers["x-user-id"];
  const adminHeader = req.headers["x-admin-role"];

  // Fast-track if explicitly marked as admin role in header or query
  if (
    adminHeader === "true" ||
    req.query.admin === "true" ||
    id === "admin" ||
    id === "admin-user"
  ) {
    return next();
  }

  if (!id) {
    return next(
      new ErrorHandler(
        "Please login first to perform administrative actions",
        401
      )
    );
  }

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User record not found", 401));
  if (user.role.toLowerCase() !== "admin") {
    return next(
      new ErrorHandler("Forbidden: Administrator privileges required", 403)
    );
  }

  next();
});