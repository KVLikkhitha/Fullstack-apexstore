import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please enter Coupon Code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: [true, "Please enter Discount Percentage"],
      min: 1,
      max: 100,
    },
    maxDiscount: {
      type: Number,
      default: 5000,
    },
    minSpend: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
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

export const Coupon = mongoose.model("Coupon", schema);
