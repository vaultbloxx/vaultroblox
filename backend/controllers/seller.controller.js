import { Limited } from "../models/limited.model.js";
import { User } from "../models/user.model.js";
import { Withdraw } from "../models/withdraw.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { redis } from "../config/redis.js";
import { Order } from "../models/order.model.js";
import { authenticator } from "otplib";
import qrcode from "qrcode";
import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";
import { RobloxAccount } from "../models/robloxAcc.model.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const createItem = asyncHandler(async (req, res) => {
  try {
    const { name, price, rap, image, assetId } = req.body;
    const playerId = req.params.playerId;

    if (!name || !price || !rap || !image) {
      return res
        .status(400)
        .json({ error: "Name, price, rap, and image are required" });
    }

    const robloxAcc = await RobloxAccount.findOne({ playerId });

    if (!robloxAcc) {
      return res.status(404).json({ error: "Roblox account not found" });
    }

    const sellerId = robloxAcc.from;
    const seller = await User.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    if (seller.role !== "seller" && seller.role !== "admin") {
      return res.status(401).json({ error: "You are not a seller" });
    }

    const existingItem = await Limited.findOne({
      assetId,
      fromRbxAccount: robloxAcc._id,
    });

    if (existingItem) {
      return res.status(400).json({ error: "You've already listed this item" });
    }

    const item = new Limited({
      sellerId,
      seller: seller?.username,
      fromRbxAccount: robloxAcc?._id,
      name,
      price,
      rap,
      image,
      assetId,
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.log("Error creating item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteItem = asyncHandler(async (req, res) => {
  try {
    const { limitedId } = req.params;
    const item = await Limited.findById(limitedId);
    const accountId = item.fromRbxAccount;
    const userId = item.sellerId;
    const authUserId = req.user?._id;

    let user;

    const chacedUser = await redis.get(`user:${userId}`);

    if (chacedUser) {
      user = JSON.parse(chacedUser);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      item.sellerId.toString() !== authUserId.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ error: "Your are not the seller of this limited" });
    }

    // Check if the limited is in orders
    const hasInOrders = await Order.findById(limitedId);
    if (hasInOrders) {
      return res.status(400).json({
        error: "This limited is in orders, cannot be deleted",
      });
    }

    // Remove the limited ID from all users' likedLimiteds arrays
    await User.updateMany(
      { likedLimiteds: limitedId }, // Find users who liked this limited
      { $pull: { likedLimiteds: limitedId } } // Remove it from their likedLimiteds
    );
    await item.deleteOne();
    await redis.del(`listings:${accountId}`);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log("Error deleting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getSellerLimiteds = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }

    const limiteds = await Limited.find({ sellerId: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(limiteds);
  } catch (error) {
    console.log("Error getting seller limiteds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const placeWithdraw = asyncHandler(async (req, res) => {
  try {
    const { amount, network, address: addy, code } = req.body;
    const userId = req.user?._id;

    if (!code) {
      return res.status(400).json({ error: "Code is required" });
    }
    if (!amount || !addy || !network) {
      return res
        .status(400)
        .json({ error: "Network, Amount and address are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than 0" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //check if there is any pending order
    const pendingOrder = await Order.findOne({
      sellerId: userId,
      status: "pending",
      paymentStatus: "completed",
    });

    if (pendingOrder) {
      return res
        .status(400)
        .json({ error: "You have pending order, cannot withdraw now" });
    }

    //check 2fa enabled
    if (user.twoFa === false) {
      return res.status(400).json({ error: "2FA is not enabled" });
    }

    //check 2fa code
    const verified = authenticator.check(code, user.secret);
    if (!verified) {
      return res.status(400).json({ error: "Invalid 2FA code" });
    }

    if (user.role === "user") {
      return res.status(400).json({ error: "You are not a seller" });
    }

    // Check if the user has sufficient balance
    if (amount > user.sellerBalance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    await Withdraw.create({
      userId,
      network,
      amount,
      addy,
    });

    user.sellerBalance -= amount;
    await user.save();

    await redis.del("allRequests");
    await redis.del(`user:${userId}`);

    res.status(200).json({ message: "Withdrawal placed successfully" });
  } catch (error) {
    console.log("Error placing withdraw:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getWithdrawTransactions = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    const cachedTransactions = await redis.get(`withdraw:${userId}`);

    if (cachedTransactions) {
      return res.status(200).json(JSON.parse(cachedTransactions));
    }
    const transactions = await Withdraw.find({ userId }).sort({
      createdAt: -1,
    });
    if (transactions.length > 0) {
      await redis.set(
        `withdraw:${userId}`,
        JSON.stringify(transactions),
        "EX",
        5 * 60
      );
    }
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting deposit transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getRecentOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const chachedOrders = await redis.get(`recentOrders:${userId}`);

    if (chachedOrders) {
      return res.status(200).json(JSON.parse(chachedOrders));
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Query to find orders in the last 24 hours
    const recentOrders = await Order.find({
      sellerId: userId,
      createdAt: { $gte: twentyFourHoursAgo },
    })
      .populate({
        path: "limitedId",
        select: "name image",
      })
      .sort({ createdAt: -1 }); // Sort by most recent orders

    if (recentOrders.length > 0) {
      await redis.set(
        `recentOrders:${userId}`,
        JSON.stringify(recentOrders),
        "EX",
        5 * 60
      );
    }
    // Example response:
    // [
    //   {
    //     "_id": "61a7c2f5a7eb830015d6a7a2",
    //     "buyerId": "61a7c2f5a7eb830015d6a7a1",
    //     "limitedId": {
    //       "_id": "61a7c2f5a7eb830015d6a7a3",
    //       "name": "Test Limited",
    //       "image": "https://i.imgur.com/3kUHqZB.png"
    //     },
    //     "createdAt": "2021-12-02T02:44:05.343Z",
    //     "__v": 0
    //   }
    // ]

    res.status(200).json(recentOrders);
  } catch (error) {
    console.log("Error getting recent orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getSellerOrders = asyncHandler(async (req, res) => {
  const { search, skip = 0 } = req.query;
  const DEFAULT_LIMIT = 10;
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let orders;
    const cachedOrders = await redis.get(`orders:${userId}`);

    if (cachedOrders) {
      orders = JSON.parse(cachedOrders);
    } else {
      orders = await Order.find({
        sellerId: userId,
        paymentStatus: "completed",
      })
        .populate({
          path: "limitedId",
          select: "name image",
        })
        .sort({
          createdAt: -1,
        })
        .select("-buyerId -sellerEmail");

      if (orders.length > 0) {
        await redis.set(
          `orders:${userId}`,
          JSON.stringify(orders),
          "EX",
          5 * 60
        );
      }
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive partial match
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search); // Check if search is a valid MongoDB ObjectID

      orders = orders.filter((order) =>
        isValidObjectId
          ? order?._id.toString() === search
          : order.gameUsername.match(regex) || order.buyerEmail.match(regex)
      );
    }

    // Get total count after filtering
    const totalOrders = orders.length;

    // Apply pagination on the filtered data
    const paginatedOrders = orders.slice(skip, skip + DEFAULT_LIMIT);

    res.status(200).json({ orders: paginatedOrders, total: totalOrders });
  } catch (error) {
    console.log("Error getting orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getBuyerOrders = asyncHandler(async (req, res) => {
  const { search, skip = 0 } = req.query;
  const DEFAULT_LIMIT = 10;
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    let orders;
    const cachedOrders = await redis.get(`buyerOrders:${userId}`);

    if (cachedOrders) {
      orders = JSON.parse(cachedOrders);
    } else {
      orders = await Order.find({
        buyerId: userId,
        paymentStatus: "completed",
      })
        .populate({
          path: "limitedId",
          select: "name image",
        })
        .sort({
          createdAt: -1,
        })
        .select("-buyerId -sellerEmail");

      if (orders.length > 0) {
        await redis.set(
          `buyerOrders:${userId}`,
          JSON.stringify(orders),
          "EX",
          5 * 60
        );
      }
    }

    // Apply search filter
    if (search) {
      const regex = new RegExp(search, "i"); // Case-insensitive partial match
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(search); // Check if search is a valid MongoDB ObjectID

      orders = orders.filter((order) =>
        isValidObjectId
          ? order?._id.toString() === search
          : order.gameUsername.match(regex) || order.limitedId.name.match(regex)
      );
    }

    // Get total count after filtering
    const totalOrders = orders.length;

    // Apply pagination on the filtered data
    const paginatedOrders = orders.slice(skip, skip + DEFAULT_LIMIT);

    res.status(200).json({ orders: paginatedOrders, total: totalOrders });
  } catch (error) {
    console.log("Error getting orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const countRecentOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Count orders in the last 24 hours
    const recentOrderCount = await Order.countDocuments({
      sellerId: userId,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    res.status(200).json(recentOrderCount);
  } catch (error) {
    console.error("Error counting recent orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const calculateRecentRevenue = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Calculate timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Aggregate the total revenue for completed orders in the last 24 hours
    const result = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(userId), // Match the seller ID
          createdAt: { $gte: twentyFourHoursAgo }, // Orders created in the last 24 hours
          paymentStatus: "completed", // Only completed payments
        },
      },
      {
        $group: {
          _id: null, // Group all matching orders
          totalRevenue: { $sum: "$amount" }, // Sum up the amount
        },
      },
    ]);

    // Extract total revenue or set to 0 if no matches
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating recent revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getAuto2FaQr = asyncHandler(async (req, res) => {
  try {
    const { secret } = req.body;
    const { accountId } = req.params;

    if (!accountId || !secret) {
      return res
        .status(400)
        .json({ error: "Something went wrong, please try again" });
    }

    const account = await RobloxAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const username = account.name;
    console.log(username);

    // Save the temporary secret to the database
    account.temp_robloxTwoFactor = secret;
    await account.save();

    // Generate the URI for the authenticator app
    const uri = authenticator.keyuri(username, "Roblox", secret);

    // Generate QR code from URI
    const image = await qrcode.toDataURL(uri);

    res.status(200).json({ qr: image, secret });
  } catch (error) {
    console.error("Error getting auto 2fa qr:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const setAuto2Fa = asyncHandler(async (req, res) => {
  try {
    const { code, robloxSecurity } = req.body;
    const { accountId } = req.params;
    const userId = req.user?._id;

    if (!code || !robloxSecurity) {
      return res
        .status(400)
        .json({ error: "Code and .ROBLOSECURITY are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const account = await RobloxAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    const temp_secret = account.temp_robloxTwoFactor;
    if (!temp_secret) {
      return res.status(400).json({ error: "No 2FA key found" });
    }

    const verified = authenticator.check(code, temp_secret);
    if (!verified) {
      return res.status(400).json({ error: "Invalid code" });
    }
    const authenticated = await axios.get("https://www.roblox.com/home", {
      headers: {
        Cookie: `.ROBLOSECURITY=${robloxSecurity}`,
      },
    });

    if (authenticated.status !== 200) {
      return res.status(400).json({ error: "Invalid .ROBLOSECURITY cookie" });
    }

    if (user.role === "user") {
      user.role = "seller";
    }
    await user.save();
    account.robloxSecurity = robloxSecurity;
    account.isRobloxSecurity = true;
    account.robloxTwoFactor = temp_secret;
    account.isRobloxTwoFactor = true;

    await account.save();

    res.status(200).json({ message: "2FA set successfully" });
  } catch (error) {
    console.log("Error setting auto 2fa:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const headers = (cookie) => ({
  Cookie: `.ROBLOSECURITY=${cookie}`,
});

const addAcount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { robloxSecurity } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!robloxSecurity) {
      return res.status(400).json({ error: "Roblox Security is required" });
    }

    // Step 1: Validate the cookie and get authenticated user details
    let userResponse;
    try {
      userResponse = await axios.get(
        "https://users.roblox.com/v1/users/authenticated",
        {
          headers: headers(robloxSecurity),
        }
      );
    } catch (error) {
      return res.status(400).json({ error: "Invalid .ROBLOSECURITY cookie" });
    }

    if (userResponse.status === 200) {
      const { id, name } = userResponse.data;
      const account = await RobloxAccount.findOne({ playerId: id });
      if (account) {
        return res
          .status(400)
          .json({ error: "This Account was already added" });
      }
      // Step 2: Get the user's avatar image
      const avatarResponse = await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=false`
      );
      const avatarUrl =
        avatarResponse?.data?.data?.[0]?.imageUrl ||
        `https://eu.ui-avatars.com/api/?name=${name}&size=150`;

      // Step 3: Optionally save the Roblox account details in MongoDB
      const robloxAccount = new RobloxAccount({
        from: userId, // Assuming you have user authentication
        playerId: id,
        robloxSecurity,
        name,
        image: avatarUrl,
        isRobloxSecurity: true,
      });

      await robloxAccount.save();

      if (user.role === "user") {
        user.role = "seller";
      }
      user.account += 1;
      await user.save();

      // Step 4: Return the details
      res.status(200).json({ message: "Account added successfully" });
    }
  } catch (error) {
    console.log("Error adding account:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return res.status(400).json({ error: "Invalid ROBLOSECURITY cookie" });
  }
});

const getAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const authUserId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const authUser = await User.findById(authUserId);

    if (
      userId.toString() !== authUserId.toString() &&
      authUser.role !== "admin"
    ) {
      return res
        .status(400)
        .json({ error: "You are not authorized to view this account" });
    }

    // Fetch accounts for the user
    const robloxAccounts = await RobloxAccount.find({ from: userId });

    // Validate `.ROBLOSECURITY` for each account
    const validationPromises = robloxAccounts.map(async (account) => {
      try {
        const response = await axios.get(
          "https://users.roblox.com/v1/users/authenticated",
          {
            headers: {
              Cookie: `.ROBLOSECURITY=${account.robloxSecurity}`,
            },
          }
        );

        // If successful, ensure `isRobloxSecurity` is true
        if (response.status === 200) {
          account.isRobloxSecurity = true;
        }
      } catch (error) {
        // If error, set `isRobloxSecurity` to false
        account.isRobloxSecurity = false;
        console.log(`Invalid .ROBLOSECURITY for account: ${account.name}`);
      }

      // Save the updated account
      return account.save();
    });

    // Wait for all validations to complete
    await Promise.all(validationPromises);

    // Respond with the updated accounts
    res.status(200).json(robloxAccounts);
  } catch (error) {
    console.error("Error getting account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateCookie = asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const account = await RobloxAccount.findById(accountId);
  try {
    const userId = req.user?._id;
    const { robloxSecurity } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    if (!robloxSecurity) {
      return res.status(400).json({ error: "Roblox Security is required" });
    }

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // Step 1: Validate the cookie and get authenticated user details
    const userResponse = await axios.get(
      "https://users.roblox.com/v1/users/authenticated",
      {
        headers: {
          Cookie: `.ROBLOSECURITY=${robloxSecurity}`,
        },
      }
    );

    if (userResponse.status === 200) {
      const { id, name } = userResponse.data;
      // Step 2: Get the user's avatar image
      const avatarResponse = await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=false`
      );
      const avatarUrl =
        avatarResponse?.data?.data?.[0]?.imageUrl ||
        "https://via.placeholder.com/150";

      // Step 3: Update the Roblox account details in MongoDB
      account.playerId = id;
      account.robloxSecurity = robloxSecurity;
      account.name = name;
      account.image = avatarUrl;
      account.isRobloxSecurity = true;
      await account.save();

      // Step 4: Return the details
      res.status(200).json({ message: "Cookie updated successfully" });
    }
  } catch (error) {
    console.log("Error updating cookie:", error);
    return res.status(404).json({ error: "Invalid .ROBLOSECURITY cookie" });
  }
});

const deleteAccount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { accountId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const account = await RobloxAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (
      account.from.toString() !== user?._id.toString() &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized access to this account" });
    }

    // Delete the Roblox account
    await account.deleteOne();

    const accountCount = await RobloxAccount.countDocuments({ from: userId });
    if (accountCount === 0 && user.role !== "admin") {
      user.role = "user";
    }
    if (user.role !== "admin") {
      user.account -= 1;
    }
    await user.save();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log("Error deleting account:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getNotification = asyncHandler(async (req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const DEFAULT_LIMIT = 10;
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const cacheKey = `notification:${userId}:skip:${skip}`;
    const cachedNotifications = await redis.get(cacheKey);

    if (cachedNotifications) {
      return res.status(200).json(JSON.parse(cachedNotifications));
    }

    const notifications = await Notification.find({ to: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(DEFAULT_LIMIT);

    await redis.set(cacheKey, JSON.stringify(notifications), "EX", 300); // Cache for 5 mins

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error getting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const viewListings = asyncHandler(async (req, res) => {
  try {
    const { accountId } = req.params;

    const userId = req.user?._id;
    const account = await RobloxAccount.findById(accountId);

    const user = await User.findById(userId).select("role");

    if (
      user.role !== "admin" &&
      account.from.toString() !== userId.toString()
    ) {
      return res
        .status(404)
        .json({ error: "Account not found or does not belong to the user" });
    }

    const cachedListings = await redis.get(`listings:${accountId}`);

    if (cachedListings) {
      return res.status(200).json(JSON.parse(cachedListings));
    }

    const listings = await Limited.find({ fromRbxAccount: accountId });
    if (listings.length > 0) {
      await redis.set(
        `listings:${accountId}`,
        JSON.stringify(listings),
        "EX",
        5 * 60
      );
    }
    res.status(200).json(listings);
  } catch (error) {
    console.log("Error getting viewListings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// const getPlayerLimitedItems = asyncHandler(async (req, res) => {
//   try {
//     const { playerId } = req.params;
//     const userId = req.user?._id;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!playerId) {
//       return res.status(400).json({ error: "Player ID is required" });
//     }
//     // const account = await RobloxAccount.findOne({ playerId });
//     // if (!account) {
//     //   return res.status(404).json({ error: "Account not found" });
//     // }
//     // if (
//     //   account.from.toString() !== userId.toString() &&
//     //   user.role !== "admin"
//     // ) {
//     //   return res.status(400).json({ error: "This account is not yours" });
//     // }
//     // Redis cache keys
//     const itemDetailsCacheKey = "itemDetails";
//     const playerInventoryCacheKey = `playerInventory:${playerId}`;

//     // Check if final processed inventory is cached
//     const cachePlayerInventory = await redis.get(playerInventoryCacheKey);
//     if (cachePlayerInventory) {
//       return res.status(200).json(JSON.parse(cachePlayerInventory));
//     }

//     // Step 1: Fetch player assets from Rolimons API
//     let playerAssetsResponse;
//     try {
//       playerAssetsResponse = await axios.get(
//         `https://api.rolimons.com/players/v1/playerassets/${playerId}`
//       );
//     } catch (err) {
//       if (err.response && err.response.status === 503) {
//         return res
//           .status(404)
//           .json({ error: "No limited items found for this account." });
//       }
//       console.error("Error fetching player assets:", err);
//       return res.status(500).json({ error: "Failed to fetch player assets." });
//     }

//     const playerAssets = playerAssetsResponse?.data?.playerAssets || {};

//     // Ensure the response is always an array
//     if (!playerAssets || Object.keys(playerAssets).length === 0) {
//       return res.status(200).json([]); // ✅ Always return an array
//     }

//     // Step 2: Fetch item details from Redis or API
//     let itemDetails = await redis.get(itemDetailsCacheKey);

//     if (!itemDetails) {
//       try {
//         const itemDetailsResponse = await axios.get(
//           "https://api.rolimons.com/items/v1/itemdetails"
//         );

//         if (!itemDetailsResponse.data.success) {
//           return res
//             .status(400)
//             .json({ error: "Failed to fetch item details" });
//         }

//         itemDetails = itemDetailsResponse.data.items;

//         // Cache item details for 1 hour
//         await redis.set(
//           itemDetailsCacheKey,
//           JSON.stringify(itemDetails),
//           "EX",
//           2 * 60
//         );
//       } catch (err) {
//         console.error("Error fetching item details:", err);
//         return res.status(500).json({ error: "Failed to fetch item details." });
//       }
//     } else {
//       itemDetails = JSON.parse(itemDetails);
//     }

//     // Step 3: Combine the data
//     const limitedItems = await Promise.all(
//       Object.keys(playerAssets).map(async (assetId) => {
//         const item = itemDetails[assetId];
//         if (item) {
//           try {
//             const imageUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&size=420x420&format=png`;
//             const imageResponse = await axios.get(imageUrl);
//             const image = imageResponse.data.data?.[0]?.imageUrl || null;

//             return {
//               assetId,
//               name: item[0], // Name
//               rap: item[2], // Recent Average Price (RAP)
//               defaultValue: item[4], // Default Value
//               imageUrl: image, // Image URL
//             };
//           } catch (err) {
//             console.error(`Error fetching image for asset ${assetId}:`, err);
//             return null; // Skip if image fails
//           }
//         }
//         return null;
//       })
//     );

//     // Filter out null values
//     const filteredLimitedItems = limitedItems.filter((item) => item);

//     // Cache final processed inventory for 1 hour
//     try {
//       await redis.set(
//         playerInventoryCacheKey,
//         JSON.stringify(filteredLimitedItems),
//         "EX",
//         2 * 60
//       );
//     } catch (err) {
//       console.error("Error caching player inventory:", err);
//     }

//     // Return response (Always return an array)
//     return res.status(200).json(filteredLimitedItems);
//   } catch (error) {
//     console.error("Error fetching player limited items:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const getPlayerLimitedItems = asyncHandler(async (req, res) => {
  try {
    const { playerId } = req.params;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!playerId) {
      return res.status(400).json({ error: "Player ID is required" });
    }

    // Redis cache keys
    const itemDetailsCacheKey = "itemDetails";
    const playerInventoryCacheKey = `playerInventory:${playerId}`;

    // Check if final processed inventory is cached
    const cachePlayerInventory = await redis.get(playerInventoryCacheKey);
    if (cachePlayerInventory) {
      return res.status(200).json(JSON.parse(cachePlayerInventory));
    }

    // Step 1: Fetch player assets from Rolimons API
    let playerAssetsResponse;
    try {
      playerAssetsResponse = await axios.get(
        `https://api.rolimons.com/players/v1/playerassets/${playerId}`
      );
    } catch (err) {
      if (err.response && err.response.status === 503) {
        return res
          .status(404)
          .json({ error: "No limited items found for this account." });
      }
      console.error("Error fetching player assets:", err);
      return res.status(500).json({ error: "Failed to fetch player assets." });
    }

    const playerAssets = playerAssetsResponse?.data?.playerAssets || {};

    // Ensure the response is always an array
    if (!playerAssets || Object.keys(playerAssets).length === 0) {
      return res.status(200).json([]); // ✅ Always return an array
    }

    // Step 2: Fetch item details from Redis or API
    let itemDetails = await redis.get(itemDetailsCacheKey);

    if (!itemDetails) {
      try {
        const itemDetailsResponse = await axios.get(
          "https://api.rolimons.com/items/v1/itemdetails"
        );

        if (!itemDetailsResponse.data.success) {
          return res
            .status(400)
            .json({ error: "Failed to fetch item details" });
        }

        itemDetails = itemDetailsResponse.data.items;

        // Cache item details for 2 minutes
        await redis.set(
          itemDetailsCacheKey,
          JSON.stringify(itemDetails),
          "EX",
          2 * 60
        );
      } catch (err) {
        console.error("Error fetching item details:", err);
        return res.status(500).json({ error: "Failed to fetch item details." });
      }
    } else {
      itemDetails = JSON.parse(itemDetails);
    }

    // Step 3: Collect assetIds for batch thumbnail fetch
    const assetIds = Object.keys(playerAssets).filter(
      (assetId) => itemDetails[assetId]
    );

    let thumbsMap = {};
    try {
      const thumbsResponse = await axios.get(
        "https://thumbnails.roblox.com/v1/assets",
        {
          params: {
            assetIds: assetIds.join(","),
            size: "420x420",
            format: "Png",
            isCircular: false,
          },
        }
      );

      thumbsResponse.data.data.forEach((thumb) => {
        thumbsMap[thumb.targetId] = thumb.imageUrl;
      });
    } catch (err) {
      console.error("Error fetching thumbnails in batch:", err);
    }

    // Step 4: Combine the data
    const limitedItems = assetIds.map((assetId) => {
      const item = itemDetails[assetId];
      return {
        assetId,
        name: item[0], // Name
        rap: item[2], // Recent Average Price (RAP)
        defaultValue: item[4], // Default Value
        imageUrl: thumbsMap[assetId] || null, // Batch image URL
      };
    });

    // Filter out null values (in case some failed)
    const filteredLimitedItems = limitedItems.filter((item) => item);

    // Cache final processed inventory for 2 minutes
    try {
      await redis.set(
        playerInventoryCacheKey,
        JSON.stringify(filteredLimitedItems),
        "EX",
        2 * 60
      );
    } catch (err) {
      console.error("Error caching player inventory:", err);
    }

    // ✅ Always return an array
    return res.status(200).json(filteredLimitedItems);
  } catch (error) {
    console.error("Error fetching player limited items:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const rejectOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ error: "Order is not pending" });
    }

    order.sellerOk = false;
    order.status = "rejected"; // Update status to "rejected"
    await order.save();

    const limited = await Limited.findById(order.limitedId);
    limited.sold = false;
    await limited.save();

    const buyer = await User.findById(order.buyerId);
    buyer.buyerBalance += order.amount;
    await buyer.save();
    await redis.del(`user:${order.buyerId}`);

    const seller = await User.findById(order.sellerId);
    seller.sellerBalance -= order.amount;
    await seller.save();
    await redis.del(`user:${order.sellerId}`);
    await redis.del(`orders:${order.sellerId}`);

    await Notification.create({
      from: "admin",
      to: order.buyerId,
      amount: limited.name,
      type: "orderRejected",
    });

    return res.status(200).json({ message: "Order rejected successfully" });
  } catch (error) {
    console.error("Error rejecting order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const markDeliveredOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ error: "Order is not pending" });
    }

    order.sellerOk = true; // Update status to "delivered"
    await order.save();

    const limited = await Limited.findById(order.limitedId);

    await Notification.create({
      to: order.buyerId,
      amount: limited.name,
      type: "orderDelivered",
    });

    return res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    console.error("Error rejecting order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  createItem,
  deleteItem,
  getSellerLimiteds,
  placeWithdraw,
  getWithdrawTransactions,
  getRecentOrders,
  countRecentOrders,
  calculateRecentRevenue,
  getNotification,
  addAcount,
  getAccount,
  deleteAccount,
  getAuto2FaQr,
  setAuto2Fa,
  updateCookie,
  viewListings,
  getPlayerLimitedItems,
  getSellerOrders,
  getBuyerOrders,
  rejectOrder,
  markDeliveredOrder,
};
