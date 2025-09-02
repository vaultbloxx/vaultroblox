import mongoose, { Schema } from "mongoose";

const recentSoldSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const RecentSold = mongoose.model("RecentSold", recentSoldSchema);
