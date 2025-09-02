import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: [
        "order",
        "withdrawal",
        "deposit",
        "withdrawalRejected",
        "orderRejected",
        "orderDelivered",
      ],
      required: true,
      default: "unread",
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
