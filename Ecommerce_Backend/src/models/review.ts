import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    productId: {
      type: String,
      ref: "Product",
      required: [true, "Please provide Product ID"],
    },
    userName: {
      type: String,
      required: [true, "Please provide User Name"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Please provide Rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Please provide Review Comment"],
      trim: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
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

export const Review = mongoose.model("Review", schema);
