import mongoose from "mongoose";
import validator from "validator";
import type { IUser } from "../types/types.js";

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "Please enter ID"],
    },
    name: {
      type: String,
      required: [true, "Please enter Name"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter Email"],
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid Email"],
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    role: {
      type: String,
      enum: ["admin", "user", "Admin", "Customer"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "Male", "Female"],
      required: [true, "Please enter your gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of Birth"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.virtual("id").get(function () {
  return this._id;
});

schema.virtual("avatar").get(function () {
  return this.photo;
});

schema.virtual("joinedDate").get(function () {
  return (this as any).createdAt
    ? (this as any).createdAt.toISOString().split("T")[0]
    : "";
});

schema.virtual("age").get(function (this: { dob: Date }) {
  if (!this.dob) return 0;
  const today = new Date();
  const dob = new Date(this.dob);
  let age = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  ) {
    age--;
  }
  return age;
});

export const User = mongoose.model<IUser>("User", schema);