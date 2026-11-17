import mongoose from "mongoose";

const specSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    name: {
      type: String,
      required: [true, "Please enter Name"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter Price"],
    },
    originalPrice: {
      type: Number,
      default: function (this: { price: number }) {
        return this.price;
      },
    },
    stock: {
      type: Number,
      required: [true, "Please enter Stock"],
      default: 0,
    },
    photo: {
      type: String,
      required: [true, "Please enter Photo"],
    },
    category: {
      type: String,
      required: [true, "Please enter Category"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      default: "",
    },
    specs: [specSchema],
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

export const Product = mongoose.model("Product", schema);