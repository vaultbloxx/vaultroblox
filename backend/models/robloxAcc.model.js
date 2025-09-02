import mongoose, { Schema } from "mongoose";

const robloxAccSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playerId: {
      type: String,
      required: true,
    },
    robloxSecurity: {
      type: String,
      required: true,
    },
    temp_robloxTwoFactor: {
      type: String,
    },
    robloxTwoFactor: {
      type: String,
    },
    isRobloxSecurity: {
      type: Boolean,
      default: false,
    },
    isRobloxTwoFactor: {
      type: Boolean,
      default: false,
    },
    name: {
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

export const RobloxAccount = mongoose.model("RobloxAccount", robloxAccSchema);
