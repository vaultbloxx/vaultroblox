import mongoose from "mongoose";
import { redis } from "../config/redis.js";
import { Limited } from "../models/limited.model.js";
import { Notification } from "../models/notification.model.js";
import { Order } from "../models/order.model.js";
import { RecentSold } from "../models/recentSold.model.js";
import { Robux } from "../models/robux.model.js";
import { User } from "../models/user.model.js";
import { Withdraw } from "../models/withdraw.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import axios from "axios";

const updateRobux = asyncHandler(async (req, res) => {
  try {
    const { robux } = req.body;

    if (!robux) {
      return res.status(400).json({ error: "Robux is required" });
    }

    const updatedRobux = await Robux.findOneAndUpdate(
      {},
      { robux },
      { new: true, upsert: true }
    );

    await redis.del("robuxPrice");

    res.status(200).json(updatedRobux);
  } catch (error) {
    console.log("Error updateRobux controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateRobuxPrice = asyncHandler(async (req, res) => {
  try {
    const { first, second, third, four, firstR, secondR, thirdR, fourR } =
      req.body;

    const id = "67b3a8690907c00aa98c176e";

    const robux = await Robux.findById(id);

    if (!robux) {
      return res.status(400).json({ error: "Robux is required" });
    }

    robux.first = first || robux.first;
    robux.second = second || robux.second;
    robux.third = third || robux.third;
    robux.four = four || robux.four;
    robux.firstR = firstR || robux.firstR;
    robux.secondR = secondR || robux.secondR;
    robux.thirdR = thirdR || robux.thirdR;
    robux.fourR = fourR || robux.fourR;
    const updatedRobux = await robux.save();

    await redis.del("robuxPrice");

    res.status(200).json(updatedRobux);
  } catch (error) {
    console.log("Error updateRobuxPrice controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const createRecentSold = asyncHandler(async (req, res) => {
  try {
    let { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res
        .status(400)
        .json({ error: "Name, price, and image are required" });
    }

    const result = await cloudinary.uploader.upload(image || "");

    if (!result) {
      console.log("Error uploading image:", result);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const recentSold = new RecentSold({
        name,
        price,
        image: result.secure_url,
      });
      await recentSold.save();
      await redis.del("recentlySold");
      res.status(201).json(recentSold);
    }
  } catch (error) {
    console.log("Error updating robux:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteRecentSold = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const recentSold = await RecentSold.findById(id);

    if (!recentSold) {
      return res.status(404).json({ error: "RecentSold not found" });
    }
    const imgId = recentSold.image.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(imgId);
    await RecentSold.findByIdAndDelete(id);
    await redis.del("recentlySold");
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error deleteRecentSold controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { search, skip = 0 } = req.query;
  const DEFAULT_LIMIT = 10;
  try {
    let users;

    // Check if users are cached in Redis
    const cachedUsers = await redis.get("allUsers");

    if (cachedUsers) {
      users = JSON.parse(cachedUsers);
    } else {
      // Fetch all users from DB
      users = await User.find(
        { role: { $ne: "owner" } }, // exclude owner
        { password: 0 }
      )
        .sort({ createdAt: -1 })
        .select("_id email username account createdAt");

      // Cache users in Redis for 10 minutes
      await redis.set("allUsers", JSON.stringify(users), "EX", 10 * 60);
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive partial match
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search); // Check if search is a valid MongoDB ObjectID

      users = users.filter((user) =>
        isValidObjectId
          ? user?._id.toString() === search
          : user.username.match(regex) || user.email.match(regex)
      );
    }

    // Get total count after filtering
    const totalUsers = users.length;

    // Apply pagination on the filtered data
    const paginatedUsers = users.slice(skip, skip + DEFAULT_LIMIT);

    res.status(200).json({ users: paginatedUsers, total: totalUsers });
  } catch (error) {
    console.log("Error getting all users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await redis.del("allUsers");
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const changeUserVerified = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.verified = !user.verified;
    await user.save();
    await redis.del(`user:${id}`);
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const freezeBalance = asyncHandler(async (req, res) => {
  try {
    const { userId, amount, clientStart, clientHoldUntil } = req.body;
    // clientStart = client Date.now()
    // clientHoldUntil = date until balance is frozen (calculated on client)

    if (!userId || !amount || !clientStart || !clientHoldUntil) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (parseFloat(user.sellerBalance) < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient balance to freeze" });
    }

    // Deduct from seller balance and move to frozen balance
    user.sellerBalance -= parseFloat(amount);
    user.frozenBalance += parseFloat(amount);

    // Save client times directly
    user.frozenStart = new Date(clientStart);
    user.frozenEnd = new Date(clientHoldUntil);

    await user.save();
    await redis.del(`user:${userId}`);
    await redis.del(`allUsers`);

    res.status(200).json({
      message: "Balance frozen successfully",
    });
  } catch (error) {
    console.error("Freeze balance error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const updateWithdrawStatus = asyncHandler(async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const { status } = req.body;
    const withdraw = await Withdraw.findById(withdrawalId);
    if (!withdraw) {
      return res.status(404).json({ error: "withdraw not found" });
    }
    withdraw.stauts = status;
    await withdraw.save();
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error updating withdraw status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    order.status = status;
    await order.save();
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getUserInfo = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const cachedUserInfo = await redis.get(`user:${userId}`);

    if (cachedUserInfo) {
      return res.status(200).json(JSON.parse(cachedUserInfo));
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 5 * 60);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error getting user info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const forceDelivered = asyncHandler(async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }
    order.status = "delivered";
    order.buyerOk = true;
    order.sellerOk = true;
    await order.save();

    const limited = await Limited.findById(order.limitedId);

    //create notification
    await Notification.create({
      to: order.buyerId,
      amount: limited.name,
      type: "orderDelivered",
    });

    const result = await redis.exists("allOrders");
    if (result) {
      await redis.del("allOrders");
    }

    res.status(200).json({ message: "Order marked as delivered" });
  } catch (error) {
    console.log("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchLimitedByAssetId = asyncHandler(async (req, res) => {
  try {
    const { assetId } = req.params;

    let items;
    const cachedItems = await redis.get("itemDetails");
    if (cachedItems) {
      items = JSON.parse(cachedItems);
    } else {
      // Fetch all item details once
      const itemDetailsResponse = await axios.get(
        "https://api.rolimons.com/items/v1/itemdetails"
      );
      items = itemDetailsResponse.data.items;
      await redis.set("itemDetails", JSON.stringify(items), "EX", 60 * 60); // cache 1 hr
    }

    const itemData = items[assetId];
    if (!itemData) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Extract details
    const name = itemData[0];
    const rap = itemData[2];

    // Fetch image from Roblox thumbnail API
    const thumbnailResponse = await axios.get(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=png`
    );

    const imageUrl = thumbnailResponse.data?.data?.[0]?.imageUrl || null;

    // Final response
    return res.status(200).json({
      assetId,
      name,
      rap,
      image: imageUrl,
    });
  } catch (error) {
    console.error("Error searching limited by assetId:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const createLimited = asyncHandler(async (req, res) => {
  try {
    let { name, price, image, sellerId, rap, assetId } = req.body;

    if (!name || !price || !image || !sellerId || !rap) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const limited = await Limited.create({
      assetId,
      sellerId,
      name,
      price,
      image,
      rap,
    });
    res.status(200).json(limited);
  } catch (error) {
    console.log("Error creating limited:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getAllOrder = asyncHandler(async (req, res) => {
  const { search, skip = 0 } = req.query;
  const DEFAULT_LIMIT = 10;
  try {
    let orders;
    const cachedOrders = await redis.get("allOrders");

    if (cachedOrders) {
      orders = JSON.parse(cachedOrders);
    } else {
      orders = await Order.find({
        paymentStatus: "completed",
      })
        .populate({
          path: "limitedId",
          select: "name image",
        })
        .populate({
          path: "buyerId",
          select: "email",
        })
        .populate({
          path: "sellerId",
          select: "email",
        })
        .sort({
          createdAt: -1,
        });

      if (orders.length > 0) {
        await redis.set("allOrders", JSON.stringify(orders), "EX", 5 * 60);
      }
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive partial match
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search); // Check if search is a valid MongoDB ObjectID

      orders = orders.filter((order) =>
        isValidObjectId
          ? order?._id.toString() === search
          : order?.gameUsername?.match(regex) ||
            order?.buyerId?.email?.match(regex) ||
            order?.sellerId?.email?.match(regex) ||
            order?.limitedId?.name?.match(regex)
      );
    }

    // Get total count after filtering
    const totalOrders = orders.length;

    // Apply pagination on the filtered data
    const paginatedOrders = orders.slice(skip, skip + DEFAULT_LIMIT);

    res.status(200).json({
      totalOrders,
      orders: paginatedOrders,
    });
  } catch (error) {
    console.log("Error getting all orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getAllLimited = asyncHandler(async (req, res) => {
  const { search, skip = 0 } = req.query;
  const DEFAULT_LIMIT = 10;
  try {
    let limiteds;
    const cachedLimiteds = await redis.get("allLimiteds");

    if (cachedLimiteds) {
      limiteds = JSON.parse(cachedLimiteds);
    } else {
      limiteds = await Limited.find().sort({
        sold: 1,
        createdAt: -1,
      });

      if (limiteds.length > 0) {
        await redis.set("allLimiteds", JSON.stringify(limiteds), "EX", 5 * 60);
      }
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive partial match
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search); // Check if search is a valid MongoDB ObjectID

      limiteds = limiteds.filter((limited) =>
        isValidObjectId
          ? limited?._id.toString() === search
          : limited.name.match(regex)
      );
    }

    // Get total count after filtering
    const totalLimiteds = limiteds.length;

    // Apply pagination on the filtered data
    const paginatedLimiteds = limiteds.slice(skip, skip + DEFAULT_LIMIT);

    res.status(200).json({
      totalLimiteds,
      limiteds: paginatedLimiteds,
    });
  } catch (error) {
    console.log("Error getting all limiteds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteLimiteds = asyncHandler(async (req, res) => {
  try {
    const { limitedId } = req.params;
    await Limited.findByIdAndDelete(limitedId);
    await redis.del("allLimiteds");

    const orders = await Order.find({ limitedId });
    if (orders.length > 0) {
      await Order.deleteMany({ limitedId });
      await redis.del("allOrders");
    }

    res.status(200).json({ message: "Limited deleted successfully" });
  } catch (error) {
    console.log("Error deleting limited:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getwithdrawalRequests = asyncHandler(async (req, res) => {
  const { search, skip = 0 } = req.query;
  const DEFAULT_LIMIT = 10;
  try {
    let request;
    const cachedRequests = await redis.get("allRequests");
    if (cachedRequests) {
      request = JSON.parse(cachedRequests);
    } else {
      request = await Withdraw.find()
        .populate({
          path: "userId",
          select: "_id username email",
        })
        .sort({
          createdAt: -1,
        });

      if (request.length > 0) {
        await redis.set("allRequests", JSON.stringify(request), "EX", 5 * 60);
      }
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive partial match
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search); // Check if search is a valid MongoDB ObjectID

      request = request.filter((order) =>
        isValidObjectId
          ? order?._id.toString() === search
          : order.sellerEmail.match(regex) ||
            order.userId?.username?.match(regex) ||
            order.userId?._id?.match(regex)
      );
    }

    // Get total count after filtering
    const totalRequests = request.length;

    // Apply pagination on the filtered data
    const paginatedRequests = request.slice(skip, skip + DEFAULT_LIMIT);

    res.status(200).json({
      total: totalRequests,
      requests: paginatedRequests,
    });
  } catch (error) {
    console.log("Error getting withdrawal requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const rejectWithdrawal = asyncHandler(async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const withdraw = await Withdraw.findById(withdrawalId);
    if (!withdraw) {
      return res.status(404).json({ error: "withdraw not found" });
    }
    withdraw.status = "rejected";
    await withdraw.save();

    const seller = await User.findById(withdraw.userId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    seller.sellerBalance += withdraw.amount;
    await seller.save();

    await Notification.create({
      to: withdraw.userId,
      amount: withdraw.amount,
      type: "withdrawalRejected",
    });
    const result = await redis.exists("allRequests");
    if (result) {
      await redis.del("allRequests");
    }
    await redis.del(`user:${withdraw.userId}`);

    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error updating withdraw status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const acceptWithdrawal = asyncHandler(async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    const withdraw = await Withdraw.findById(withdrawalId);
    if (!withdraw) {
      return res.status(404).json({ error: "withdraw not found" });
    }
    withdraw.status = "completed";
    await withdraw.save();

    await Notification.create({
      to: withdraw.userId,
      amount: withdraw.amount,
      type: "withdrawal",
    });

    const result = await redis.exists("allRequests");
    if (result) {
      await redis.del("allRequests");
    }
    await redis.del(`notification:${withdraw.userId}`);
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error updating withdraw status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteWithdrawal = asyncHandler(async (req, res) => {
  try {
    const { withdrawalId } = req.params;
    await Withdraw.findByIdAndDelete(withdrawalId);
    const result = await redis.exists("allRequests");
    if (result) {
      await redis.del("allRequests");
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Error deleting withdraw:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const makeBanner = asyncHandler(async (req, res) => {
  try {
    const limitedId = req.params.limitedId;

    // Step 1: Find the limited item
    const limited = await Limited.findById(limitedId);
    if (!limited) {
      return res.status(404).json({ error: "Limited item not found" });
    }

    if (limited.sold) {
      return res.status(400).json({ error: "Sold items can not be promoted" });
    }

    // Step 2: Convert to plain object (keep _id this time)
    const limitedObject = limited.toObject();

    // Optional: Check if this _id already exists in banner
    const existing = await mongoose.connection
      .collection("banners")
      .findOne({ _id: limited._id });

    if (existing) {
      return res
        .status(400)
        .json({ error: "Banner already exists for this item" });
    }

    // Step 3: Insert into 'banner' collection with same _id
    await mongoose.connection.collection("banners").insertOne(limitedObject);

    await redis.del("allBanners");

    res.status(200).json({ message: "Banner created successfully" });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getShopsForLimitedCreation = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;

    let query = { _id: { $ne: req.user._id } };

    if (search) {
      query.fullName = { $regex: search, $options: "i" };
    }

    const users = await User.find(query)
      .select("_id username")
      .limit(search ? 50 : 10) // if searching, allow more results
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsersForSidebar", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteBanner = asyncHandler(async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const deleteResult = await mongoose.connection
      .collection("banners")
      .deleteOne({ _id: new mongoose.Types.ObjectId(bannerId) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Banner not found" });
    }
    await redis.del("allBanners");
    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      sellerBalance,
      buyerBalance,
      secret,
      userId,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username !== "") {
      user.username = username || user.username;
    }
    if (email !== "") {
      user.email = email || user.email;
    }
    if (password !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword || user.password;
    }
    if (role !== "") {
      user.role = role || user.role;
    }
    if (sellerBalance !== "") {
      user.sellerBalance = parseFloat(sellerBalance) || user.sellerBalance;
    }
    if (buyerBalance !== "") {
      user.buyerBalance = parseFloat(buyerBalance) || user.buyerBalance;
    }
    if (secret !== "") {
      user.secret = secret || user.secret;
    }

    await user.save();
    await redis.del(`user:${userId}`);
    await redis.del(`allUsers`);
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  updateRobux,
  updateRobuxPrice,
  createRecentSold,
  deleteRecentSold,
  getUserInfo,
  getAllOrder,
  getAllUsers,
  getAllLimited,
  deleteLimiteds,
  getwithdrawalRequests,
  updateWithdrawStatus,
  updateOrderStatus,
  deleteUser,
  changeUserVerified,
  forceDelivered,
  rejectWithdrawal,
  acceptWithdrawal,
  deleteWithdrawal,
  makeBanner,
  deleteBanner,
  createLimited,
  getShopsForLimitedCreation,
  freezeBalance,
  updateUser,
  searchLimitedByAssetId,
};
