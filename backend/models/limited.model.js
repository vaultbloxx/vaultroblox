import mongoose, { Schema } from "mongoose";

const limitedSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromRbxAccount: {
      type: Schema.Types.ObjectId,
      ref: "RobloxAccount",
    },

    assetId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rap: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    sold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Limited = mongoose.model("Limited", limitedSchema);
