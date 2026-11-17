import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    },
    shippingInfo: {
      fullName: {
        type: String,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        default: "India",
      },
      pinCode: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "UPI", "NetBanking", "COD"],
      default: "Card",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Paid",
    },
    estimatedDelivery: {
      type: String,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        photo: {
          type: String,
        },
        productId: {
          type: String,
          ref: "Product",
          required: true,
        },
        stock: {
          type: Number,
        },
        category: {
          type: String,
        },
      },
    ],
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

// Alias shippingAddress to shippingInfo for seamless frontend compatibility
schema.virtual("shippingAddress").get(function () {
  return this.shippingInfo;
});

export const Order = mongoose.model("Order", schema);