import mongoose, { Schema } from "mongoose";

const withdrawSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    network: {
      type: String,
      required: true,
      enum: ["ltc", "btc", "usdt", "paypal"],
    },
    addy: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Withdraw = mongoose.model("Withdraw", withdrawSchema);
