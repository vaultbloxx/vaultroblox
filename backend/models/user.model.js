import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "seller", "admin", "owner", "banned"],
      default: "user",
    },
    account: {
      type: Number,
      default: 0,
    },
    completed_order: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    sellerBalance: {
      type: Number,
      default: 0,
    },
    buyerBalance: {
      type: Number,
      default: 0,
    },
    frozenBalance: {
      type: Number,
      default: 0,
    },
    frozenStart: {
      type: Date,
      default: null,
    },
    frozenEnd: {
      type: Date,
      default: null,
    },
    btcAddy: {
      type: String,
      default: "",
    },
    usdtAddy: {
      type: String,
      default: "",
    },
    ltcAddy: {
      type: String,
      default: "",
    },

    likedLimiteds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Limited",
        default: [],
      },
    ],
    temp_secret: {
      type: String,
      default: "",
    },
    secret: {
      type: String,
      default: "",
    },
    twoFa: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
