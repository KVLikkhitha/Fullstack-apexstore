import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import type { NewUserRequestBody } from "../types/types.js";
import { tryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

export const newUser = tryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, _id, dob, role } = req.body;

    if (!_id || !name || !email) {
      return next(new ErrorHandler("Please provide id, name and email", 400));
    }

    let user: any = await User.findById(_id);
    if (!user) {
      user = await User.findOne({ email });
    }

    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome back, ${user.name}`,
        user,
      });
    }

    user = await User.create({
      _id,
      name,
      email,
      photo: photo || "https://randomuser.me/api/portraits/women/54.jpg",
      gender: (gender || "female") as "female" | "male" | "Female" | "Male",
      role: (role || "user") as "admin" | "user" | "Admin" | "Customer",
      dob: dob ? new Date(dob) : new Date("2000-01-01"),
    });

    return res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
      user,
    });
  }
);

export const getAllUsers = tryCatch(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });

  // Compute order counts for all users
  const userOrderCounts = await Order.aggregate([
    {
      $group: {
        _id: "$user",
        count: { $sum: 1 },
      },
    },
  ]);

  const orderMap: Record<string, number> = {};
  userOrderCounts.forEach((o) => {
    if (o._id) orderMap[String(o._id)] = o.count;
  });

  const formattedUsers = users.map((u) => {
    const userObj = u.toObject();
    const totalOrders = orderMap[String(u._id)] || orderMap[u.name] || 0;
    return {
      ...userObj,
      totalOrders,
      avatar: u.photo,
      joinedDate: userObj.createdAt
        ? new Date(userObj.createdAt).toISOString().split("T")[0]
        : "",
    };
  });

  return res.status(200).json({
    success: true,
    users: formattedUsers,
  });
});

export const getUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  const totalOrders = await Order.countDocuments({
    $or: [{ user: id }, { user: user.name }, { userEmail: user.email }],
  });

  const userObj = user.toObject();

  return res.status(200).json({
    success: true,
    user: {
      ...userObj,
      totalOrders,
      avatar: user.photo,
      joinedDate: userObj.createdAt
        ? new Date(userObj.createdAt).toISOString().split("T")[0]
        : "",
    },
  });
});

export const deleteUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found", 404));
  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const updateUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("User not found", 404));

  const { name, photo, gender, dob, role } = req.body;

  if (name) user.name = name.trim();
  if (photo) user.photo = photo;
  if (gender) user.gender = gender;
  if (dob) user.dob = new Date(dob);
  if (role) user.role = role;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    user,
  });
});