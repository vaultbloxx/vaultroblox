import mongoose, { Schema } from "mongoose";

const robuxSchema = new Schema(
  {
    robux: {
      type: String,
      default: "",
    },
    first: {
      type: String,
      default: "",
    },
    firstR: {
      type: String,
      default: "",
    },
    second: {
      type: String,
      default: "",
    },
    secondR: {
      type: String,
      default: "",
    },
    third: {
      type: String,
      default: "",
    },
    thirdR: {
      type: String,
      default: "",
    },
    four: {
      type: String,
      default: "",
    },
    fourR: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Robux = mongoose.model("Robux", robuxSchema);
