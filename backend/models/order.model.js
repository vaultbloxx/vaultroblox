import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    limitedId: {
      type: Schema.Types.ObjectId,
      ref: "Limited",
      required: true,
    },
    buyerEmail: {
      type: String,
      trim: true,
    },
    sellerEmail: {
      type: String,
      trim: true,
    },
    gameUsername: {
      type: String,
      trim: true,
    },
    buyerOk: {
      type: Boolean,
      default: false,
    },
    sellerOk: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
