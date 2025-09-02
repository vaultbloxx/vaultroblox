import { redis } from "../config/redis.js";
import { Deposit } from "../models/deposit.model.js";
import { Limited } from "../models/limited.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import qrcode from "qrcode";
import { authenticator } from "otplib";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Notification } from "../models/notification.model.js";
import axios from "axios";
import { Withdraw } from "../models/withdraw.model.js";

const updateBtcAddy = asyncHandler(async (req, res) => {
  const { btcAddy } = req.body;

  if (!btcAddy.length > 0) {
    return res.status(400).json({ error: "BTC address is required" });
  }
  if (!btcAddy) {
    return res.status(400).json({ error: "BTC address is required" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.btcAddy = btcAddy || user.btcAddy;
  await user.save();

  res.status(200).json({ message: "BTC address updated successfully" });
});

const updateUsdtAddy = asyncHandler(async (req, res) => {
  const { usdtAddy } = req.body;

  if (!usdtAddy.length > 0) {
    return res.status(400).json({ error: "BTC address is required" });
  }
  if (!usdtAddy) {
    return res.status(400).json({ error: "BTC address is required" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.usdtAddy = usdtAddy || user.usdtAddy;
  await user.save();

  res.status(200).json({ message: "BTC address updated successfully" });
});

const updateLtcAddy = asyncHandler(async (req, res) => {
  const { ltcAddy } = req.body;

  if (!ltcAddy.length > 0) {
    return res.status(400).json({ error: "BTC address is required" });
  }
  if (!ltcAddy) {
    return res.status(400).json({ error: "BTC address is required" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.ltcAddy = ltcAddy || user.ltcAddy;
  await user.save();

  res.status(200).json({ message: "BTC address updated successfully" });
});

const getDepositTransactions = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(404).json({ error: "User not found" });
    }
    const cachedTransactions = await redis.get(`deposit:${userId}`);

    if (cachedTransactions) {
      return res.status(200).json(JSON.parse(cachedTransactions));
    }
    const transactions = await Deposit.find({ userId }).sort({ createdAt: -1 });
    if (transactions.length > 0) {
      await redis.set(
        `deposit:${userId}`,
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

const checkEligibility = asyncHandler(async (req, res) => {
  try {
    const { username } = req.body;
    let playerId = "";

    // Step 1: Fetch player ID using username
    const response = await axios.post(
      "https://users.roblox.com/v1/usernames/users",
      {
        usernames: [username],
        excludeBannedUsers: false, // Include banned users
      }
    );

    if (response.data && response.data.data.length > 0) {
      const player = response.data.data[0]; // First matching user
      playerId = player.id;
    } else {
      return res.status(404).json({ error: "Username not found" });
    }

    // Step 2: Check player termination and premium status
    let playerDetailsResponse;
    try {
      playerDetailsResponse = await axios.get(
        `https://api.rolimons.com/players/v1/playerinfo/${playerId}`
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res
          .status(404)
          .json({ error: "Player not found with this username" });
      }
      throw error; // For other errors, rethrow to handle them in the catch block below
    }
    const playerDetails = playerDetailsResponse.data;

    if (playerDetails.terminated) {
      return res.status(400).json({ error: "Player account is terminated" });
    }

    if (!playerDetails.premium) {
      return res
        .status(400)
        .json({ error: "Player does not have Premium membership" });
    }

    // Step 3: Attempt to fetch player inventory using the faster `playerassets` API
    const playerAssetsResponse = await axios.get(
      `https://api.rolimons.com/players/v1/playerassets/${playerId}`
    );

    if (playerAssetsResponse.data.success) {
      // Process the asset IDs from the `playerassets` API
      const assetIds = Object.keys(playerAssetsResponse.data.playerAssets);
      let items = [];

      const cachedItems = await redis.get("itemDetails");
      if (cachedItems) {
        items = JSON.parse(cachedItems);
      } else {
        // Fetch all item details once
        const itemDetailsResponse = await axios.get(
          "https://api.rolimons.com/items/v1/itemdetails"
        );
        items = itemDetailsResponse.data.items;
        await redis.set("itemDetails", JSON.stringify(items), "EX", 60 * 60);
      }

      for (const assetId of assetIds) {
        const itemDetails = items[assetId];
        if (itemDetails) {
          const defaultValue = itemDetails[4]; // Default value is the fifth element
          if (defaultValue < 1500 || defaultValue > 1500) {
            // Step 2: Get the user's avatar image
            const avatarResponse = await axios.get(
              `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${playerId}&size=150x150&format=Png&isCircular=false`
            );
            const avatarUrl =
              avatarResponse?.data?.data?.[0]?.imageUrl ||
              `https://eu.ui-avatars.com/api/?name=${username}&size=150`;
            return res.status(200).json({
              success: true,
              avatarUrl,
              username,
            });
          }
        }
      }

      // If no eligible item is found in `playerassets`
      return res.status(400).json({
        error:
          "Player inventory does not meet eligibility criteria (Own small under 1.5K)",
      });
    }

    // Step 4: If `playerassets` API fails, fallback to the paginated inventory fetch
    let nextPageToken = null;

    const fetchInventoryPage = async (token) => {
      const inventoryResponse = await axios.get(
        `https://apis.roblox.com/cloud/v2/users/${playerId}/inventory-items`,
        {
          headers: {
            "x-api-key": process.env.ROBLOX_ALL_ACCESS_API_KEY,
          },
          params: token ? { nextPageToken: token } : {}, // Include nextPageToken if available
        }
      );
      return inventoryResponse.data;
    };

    let items = [];
    const cachedItems = await redis.get("itemDetails");

    if (cachedItems) {
      items = JSON.parse(cachedItems);
    } else {
      // Fetch all item details once
      const itemDetailsResponse = await axios.get(
        "https://api.rolimons.com/items/v1/itemdetails"
      );
      items = itemDetailsResponse.data.items;
      await redis.set("itemDetails", JSON.stringify(items), "EX", 60 * 60);
    }

    do {
      const inventoryData = await fetchInventoryPage(nextPageToken);

      if (inventoryData?.inventoryItems.length > 0) {
        for (const item of inventoryData.inventoryItems) {
          const assetId = item.assetDetails.assetId;
          const itemDetails = items[assetId];

          if (itemDetails) {
            const defaultValue = itemDetails[4]; // Default value is the fifth element
            if (defaultValue >= 1500) {
              return res.status(200).json({
                success: true,
                username,
              });
            }
          }
        }
      }

      nextPageToken = inventoryData.nextPageToken || null;

      if (nextPageToken) {
        // Add a 5-second delay before the next API call
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    } while (nextPageToken);

    // If no eligible item is found
    return res.status(400).json({
      success: false,
      error: "Player inventory does not meet eligibility criteria",
    });
  } catch (error) {
    console.log("Error checking eligibility:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const cryptomusUrl = "https://api.cryptomus.com/v1";

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, gameUsername, orderId } = req.body;
    const { limitedId } = req.params;
    const userId = req.user?._id;

    // Delete orders that are more than 15 days old and has payment status pending
    const fifteenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    await Order.deleteMany({
      paymentStatus: "pending",
      createdAt: { $lte: fifteenDaysAgo },
    });

    if (!amount || !gameUsername || !limitedId || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const limited = await Limited.findById(limitedId);
    if (!limited) {
      return res.status(404).json({ error: "Limited not found" });
    }

    const order = await Order.create({
      _id: orderId,
      sellerId: limited.sellerId,
      buyerId: userId,
      limitedId,
      gameUsername,
      amount: parseFloat(amount),
      name: limited.name,
      image: limited.image,
    });

    // Create a new payment intent
    const payload = {
      amount: amount.toString(),
      currency: "USD",
      order_id: order._id,
      url_callback: `${process.env.SERVER_URL}/api/rumman/v1/user/crypto-payment-success`,
    };

    const bufferData = Buffer.from(JSON.stringify(payload))
      .toString("base64")
      .concat(process.env.CRYPTOMUS_API_KEY);

    const sign = crypto.createHash("md5").update(bufferData).digest("hex");
    const { data } = await axios.post(`${cryptomusUrl}/payment`, payload, {
      headers: {
        merchant: process.env.CRYPTOMUS_MARCHANT,
        sign,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ paymentLink: data?.result?.url });
  } catch (error) {
    console.log("Error placeOrder controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const placeOrderByBalance = asyncHandler(async (req, res) => {
  try {
    const { amount, gameUsername, orderId } = req.body;
    const { limitedId } = req.params;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.buyerBalance < parseFloat(amount)) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const limited = await Limited.findById(limitedId);
    if (!limited) {
      return res.status(404).json({ error: "Limited not found" });
    }

    limited.sold = true;
    await limited.save();

    const order = await Order.create({
      _id: orderId,
      sellerId: limited.sellerId,
      buyerId: userId,
      limitedId,
      gameUsername,
      amount: parseFloat(amount),
      name: limited.name,
      image: limited.image,
    });

    user.buyerBalance -= parseFloat(amount);
    await user.save();
    await redis.del(`user:${userId}`);

    // Find the user and validate
    const seller = await User.findById(order.sellerId);
    if (!seller) {
      return res.status(400).json({ error: "User not found" });
    }

    // Use order.amount for balance increment
    const amountToCredit = parseFloat(order.amount);
    if (isNaN(amountToCredit) || amountToCredit <= 0) {
      return res.status(400).json({ error: "Invalid order amount" });
    }

    // Increment balance and save
    const cutCommission = amountToCredit * 0.05; // 5% commission
    const finalAmount =
      parseFloat(seller.sellerBalance) + amountToCredit - cutCommission;
    seller.sellerBalance = finalAmount;
    await seller.save();

    // Update payment status
    order.paymentStatus = "completed";
    await order.save();

    await redis.del(`orders:${seller._id}`);

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Delete notifications older than 15 days
    await Notification.deleteMany({ createdAt: { $lt: fifteenDaysAgo } });

    //create notification
    await Notification.create({
      from: "admin",
      to: order.sellerId,
      amount: order.amount,
      type: "order",
    });
    await redis.del(`notification:${order.sellerId}`);

    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.log("Error placeOrderBalance controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const payNowCallback = asyncHandler(async (req, res) => {
  try {
    console.log("payNowCallback", req.body);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    logger.error("Error in payNowCallback controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// payNowCallback {
//   actually_paid: 0,
//   actually_paid_at_fiat: 0,
//   fee: { currency: 'ltc', depositFee: 0, serviceFee: 0, withdrawalFee: 0 },
//   invoice_id: 5412403526,
//   order_description: 'Vault',
//   order_id: 'vaultO949u4e0jsf',
//   outcome_amount: 0.0175857,
//   outcome_currency: 'ltc',
//   parent_payment_id: null,
//   pay_address: '0x68586bdfe27727304b42d90A1E338d5578E2A863',
//   pay_amount: 1.99589426,
//   pay_currency: 'usdcmatic',
//   payin_extra_id: null,
//   payment_extra_ids: null,
//   payment_id: 5183778412,
//   payment_status: 'waiting',
//   price_amount: 2,
//   price_currency: 'usd',
//   purchase_id: '5213580215'
// }

const paymentSuccess = asyncHandler(async (req, res) => {
  try {
    const { sign, order_id } = req.body;

    if (!sign) {
      return res.status(400).json({ error: "Invalid payment request" });
    }

    // Verify payment signature
    const data = JSON.parse(req.rawBody);
    delete data.sign;
    const bufferData = Buffer.from(JSON.stringify(data))
      .toString("base64")
      .concat(process.env.CRYPTOMUS_API_KEY);

    const hash = crypto.createHash("md5").update(bufferData).digest("hex");
    if (hash !== sign) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Find the order
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    // Prevent duplicate processing
    if (order.paymentStatus === "completed") {
      return res.status(200).json({ message: "Payment already processed" });
    }

    // Find the user and validate
    const seller = await User.findById(order.sellerId);
    if (!seller) {
      return res.status(400).json({ error: "User not found" });
    }

    // Use order.amount for balance increment
    const amountToCredit = parseFloat(order.amount);
    if (isNaN(amountToCredit) || amountToCredit <= 0) {
      return res.status(400).json({ error: "Invalid order amount" });
    }

    // Increment balance and save
    const cutCommission = amountToCredit * 0.05; // 5% commission
    const finalAmount =
      parseFloat(seller.sellerBalance) + amountToCredit - cutCommission;
    seller.sellerBalance = finalAmount;
    await seller.save();
    await redis.del(`orders:${seller._id}`);

    // Update payment status
    order.paymentStatus = "completed";
    await order.save();

    const limited = await Limited.findById(order.limitedId);
    limited.sold = true;
    await limited.save();

    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    // Delete notifications older than 15 days
    await Notification.deleteMany({ createdAt: { $lt: fifteenDaysAgo } });

    //create notification
    await Notification.create({
      from: "admin",
      to: order.sellerId,
      amount: order.amount,
      type: "order",
    });

    res.status(200).json({ message: "Payment processed successfully" });
  } catch (error) {
    console.log("Error paymentSuccess controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const createDeposit = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?._id;

    // Delete deposit that are more than 15 days old and has payment status pending
    const fifteenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    await Deposit.deleteMany({
      status: "pending",
      createdAt: { $lte: fifteenDaysAgo },
    });

    if (!amount || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Step 1: Calculate the timestamp for 3 hours ago
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    // Step 2: Find deposits older than 3 hours with status 'pending'
    const outdatedDeposits = await Deposit.find({
      status: "pending",
      createdAt: { $lt: threeHoursAgo },
    });

    if (outdatedDeposits.length > 0) {
      // Step 3: Delete the found deposits
      await Deposit.deleteMany({
        status: "pending",
        createdAt: { $lt: threeHoursAgo },
      });
      console.log(`${outdatedDeposits.length} outdated deposits deleted.`);
    } else {
      console.log("No outdated deposits found.");
    }

    const deposit = await Deposit.create({
      userId,
      amount,
    });

    const payload = {
      amount,
      currency: "USD",
      order_id: deposit._id,
      url_return: `${process.env.CLIENT_URL}`,
      url_success: `${process.env.CLIENT_URL}/crypto/success`,
      url_callback: `${process.env.SERVER_URL}/api/rumman/v1/user/crypto-deposit-success`,
    };

    const bufferData = Buffer.from(JSON.stringify(payload))
      .toString("base64")
      .concat(process.env.CRYPTOMUS_API_KEY);

    const sign = crypto.createHash("md5").update(bufferData).digest("hex");
    const { data } = await axios.post(`${cryptomusUrl}/payment`, payload, {
      headers: {
        merchant: process.env.CRYPTOMUS_MARCHANT,
        sign,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({ paymentLink: data?.result?.url });
  } catch (error) {
    console.log("Error getting deposit controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const depositSuccess = asyncHandler(async (req, res) => {
  try {
    console.log("depositSuccess webhook:", req.body);

    const { sign, order_id } = req.body;
    if (!sign) {
      return res.status(400).json({ error: "Invalid payment request" });
    }

    // Verify payment signature
    const data = JSON.parse(req.rawBody);
    delete data.sign;
    const bufferData = Buffer.from(JSON.stringify(data))
      .toString("base64")
      .concat(process.env.CRYPTOMUS_API_KEY);

    const hash = crypto.createHash("md5").update(bufferData).digest("hex");
    if (hash !== sign) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Find the deposit
    const deposit = await Deposit.findById(order_id);
    if (!deposit) {
      return res.status(400).json({ error: "Deposit not found" });
    }

    // Prevent duplicate processing
    if (deposit.status === "completed") {
      return res.status(200).json({ message: "Payment already processed" });
    }

    // Find the user and validate
    const user = await User.findById(deposit.userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Use deposit.amount for balance increment
    const amountToCredit = parseFloat(deposit.amount);
    if (isNaN(amountToCredit) || amountToCredit <= 0) {
      return res.status(400).json({ error: "Invalid order amount" });
    }

    // Increment balance and save
    user.buyerBalance += amountToCredit;
    await user.save();

    deposit.status = "completed";
    await deposit.save();

    await redis.del(`user:${user._id}`);

    await Notification.create({
      from: "admin",
      to: user._id,
      amount: amountToCredit,
      type: "deposit",
    });

    res.status(200).json({ message: "Payment processed successfully" });
  } catch (error) {
    console.log("Error depositSuccess controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// depositSuccess webhook: {
//   type: 'payment',
//   uuid: '3e3b89ff-0231-440f-9d38-f0361c54c275',
//   order_id: '68b5e604f83f65ffe96c90e2',
//   amount: '1.00000000',
//   payment_amount: '0.04395481',
//   payment_amount_usd: '1.00',
//   merchant_amount: '0.04307572',
//   commission: '0.00087909',
//   is_final: true,
//   status: 'paid',
//   from: null,
//   wallet_address_uuid: null,
//   network: 'dash',
//   currency: 'USD',
//   payer_currency: 'DASH',
//   payer_amount: '0.04395481',
//   payer_amount_exchange_rate: '22.75063866',
//   additional_data: null,
//   transfer_id: null,
//   txid: 'de4f48ffbe7131242ef924da95629995750e8d07b263e5a23f4865e7b7141747',
//   sign: 'dca5dbfbb890251f9fd65c25c6289570'
// }

const likeUnlikeLimited = asyncHandler(async (req, res) => {
  try {
    const { limitedId } = req.params;
    const userId = req.user?._id;

    if (!limitedId || !userId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const limited = await Limited.findById(limitedId);
    if (!limited) {
      return res.status(404).json({ error: "Limited not found" });
    }

    const userIsLiked = limited.likes.includes(userId);

    if (userIsLiked) {
      //unlike
      await Limited.findByIdAndUpdate(
        limitedId,
        { $pull: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $pull: { likedLimiteds: limitedId } },
        { new: true }
      );
    } else {
      await Limited.findByIdAndUpdate(
        limitedId,
        { $push: { likes: userId } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        { $push: { likedLimiteds: limitedId } },
        { new: true }
      );
    }

    await redis.del(`user:${userId}`);

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("Error likeUnlikeLimited controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const qrImg = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const email = user?.email;

    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(email, "VAULT", secret);
    const image = await qrcode.toDataURL(uri);
    user.temp_secret = secret;
    await user.save();
    res.status(200).json({ qr: image, manual: secret });
  } catch (error) {
    console.log("Error qrImg controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const set2Fa = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { code } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const temp_secret = user.temp_secret;

    const verified = authenticator.check(code, temp_secret);
    if (!verified) {
      return res.status(400).json({ error: "Invalid code" });
    }

    user.secret = temp_secret;
    user.twoFa = true;
    await user.save();
    redis.del(`user:${userId}`);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("Error in set2Fa controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteAllLikedItems = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    await User.findByIdAndUpdate(userId, { likedLimiteds: [] });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("Error in deleteAllLikedItems controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const markReceived = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?._id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(401).json({ error: "Order not found" });
    }

    if (order.buyerId.toString() !== userId.toString()) {
      return res.status(400).json({ error: "Unauthorized" });
    }
    if (order.status === "rejected") {
      return res.status(400).json({ error: "Order is rejected" });
    }
    order.buyerOk = true;
    order.sellerOk = true;
    order.status = "delivered";
    await order.save();
    await redis.del(`buyerOrders:${userId}`);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log("Error in markReceived controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  updateBtcAddy,
  updateUsdtAddy,
  updateLtcAddy,
  getDepositTransactions,
  getWithdrawTransactions,
  placeOrder,
  paymentSuccess,
  createDeposit,
  depositSuccess,
  likeUnlikeLimited,
  qrImg,
  set2Fa,
  deleteAllLikedItems,
  checkEligibility,
  markReceived,
  placeOrderByBalance,
  payNowCallback,
};
